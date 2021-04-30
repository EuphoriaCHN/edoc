import remarkFrontMatter from 'remark-frontmatter';
import remarkEmoji from 'remark-emoji';

import mdx from '@mdx-js/mdx';
import vFile from 'vfile';

import transform from './transform';
import { makeEventListenerName, CODE_FRAME_RANGE } from './utils';
import babelParser from './babelParser';
import MdxCodeFrameError from './MdxCodeFrameError';

import edocParserTransformerJsx from './transformers/jsx';
import edocParserTransformerYaml from './transformers/yaml';

import { FrozenProcessor, Processor, Settings, Plugin, ProcessCallback } from 'unified';
import { Visitor } from 'unist-util-visit';
import { Node, Parent } from 'unist';

export type IEdocMdxParserPlugin<
  B extends any = any,
  S extends B[] = [B?]
  > = Plugin<S, Settings> | [Plugin<S, Settings>, B];

export type IEdocTransformer = (
  node?: Node,
  index?: number,
  parent?: Parent,
  emit?: IEdocEmitListener
) => ReturnType<Visitor<Node>>;

export type IEdocEmitListener = (name: string, ...values: any[]) => void;

export interface IEdocMdxParserOptions {
  remarkPlugins?: Array<IEdocMdxParserPlugin>;
  rehypePlugins?: Array<IEdocMdxParserPlugin>;
  transformer?: {
    [type: string]: IEdocTransformer;
  };
  emitListener?: IEdocEmitListener;

  debug?: boolean;
}

export const EVENT_LISTENER_NAME = {
  yaml: makeEventListenerName('yaml'),
  ast: makeEventListenerName('ast')
}

export const DEFAULT_COMPILER_PLUGINS: Required<Pick<IEdocMdxParserOptions, 'rehypePlugins' | 'remarkPlugins'>> = {
  remarkPlugins: [
    remarkEmoji,
    [remarkFrontMatter, ['yaml', 'toml']],
  ],
  rehypePlugins: []
}

export const DEFAULT_COMPILER_TRANSFORMER: {
  [type: string]: IEdocTransformer
} = {
  // jsx: edocParserTransformerJsx,
  yaml: edocParserTransformerYaml
};

export default class EdocMdxParser {
  private _compiler: Processor & FrozenProcessor;
  private _debug: boolean;
  private _emitListenerInterceptor: IEdocEmitListener;

  private _yamlData: { [k: string]: any };
  private _hast: Node;

  constructor(options: IEdocMdxParserOptions = {}) {
    this._emitListenerInterceptor = (name, ...values) => {
      if (name === EVENT_LISTENER_NAME.yaml) {
        this._yamlData = values[0];
        return;
      }
      if (name === EVENT_LISTENER_NAME.ast) {
        this._hast = values[0];
        return;
      }
      typeof options.emitListener === 'function' && options.emitListener(name, ...values);
    };

    const remarkPlugins = DEFAULT_COMPILER_PLUGINS.remarkPlugins.concat(options.remarkPlugins || []);
    remarkPlugins.push([
      transform,
      [
        Object.assign({}, DEFAULT_COMPILER_TRANSFORMER, options.transformer || {}),
        !!options.debug,
        this._emitListenerInterceptor
      ]
    ]);

    this._compiler = mdx.createCompiler({
      remarkPlugins,
      rehypePlugins: DEFAULT_COMPILER_PLUGINS.rehypePlugins.concat(options.rehypePlugins || [])
    });

    this._debug = !!options.debug;
  }

  get yamlData() {
    return this._yamlData;
  }

  get hast() {
    return this._hast;
  }

  private _validateCompiler() {
    if (!this._compiler) {
      throw new Error('Error: Empty compiler');
    }
  }

  private _makeErrorCodeFrame<R extends any>(
    processor: () => R,
    content: string = ''
  ): R {
    try {
      return processor();
    } catch (error) {
      if (error instanceof MdxCodeFrameError) {
        // make code frame
        const { line, column } = error;
        // range
        const lowerLimit = Math.max(line - CODE_FRAME_RANGE, 0);
        const upperLimit = Math.max(line + CODE_FRAME_RANGE - 1, 0);
        const needFormat = `${lowerLimit}`.length !== `${upperLimit}`.length;

        // 起始坐标偏移量，防止代码前几行就错了，line - CODE_FRAME < 0，导致计算错误
        const offset = line - CODE_FRAME_RANGE < 0 ? CODE_FRAME_RANGE - line : 0;

        const codeFrame = content
          .split(/\n/)
          .slice(lowerLimit, upperLimit)
          .map((row, index) => {
            // 当前行号（相对于源文件
            const rowId = line - CODE_FRAME_RANGE + 1 + index + offset;

            // 行号左对齐
            const prefix = `${rowId}${needFormat && String(rowId).length === String(lowerLimit).length ? ' ' : ''} | `;

            if (rowId - line === 0) {
              // 发生错误的行
              return `${prefix}${row}
${Array(String(upperLimit).length + 3).fill(' ').join('')}${Array(column).fill(' ').join('')}^`;
            }
            return `${prefix}${row}`
          })
          .join('\n');

        error.message = `${error.message}\n\n${codeFrame}`;
      }
      throw error;
    }
  }

  private _clearCache() {
    this._yamlData = {};
    this._hast = null;
  }

  use(...args: Parameters<Processor['use']>): ReturnType<Processor['use']> {
    this._validateCompiler();
    return this._compiler.use(...args);
  }

  md2Jsx(code: string, done: ProcessCallback): void {
    this._validateCompiler();
    this._clearCache();

    return this._makeErrorCodeFrame(
      () => this._compiler.process(code, done),
      code
    );
  }

  md2JsxSync(code: string): ReturnType<Processor['processSync']> {
    this._validateCompiler();
    this._clearCache();

    return this._makeErrorCodeFrame(
      () => this._compiler.processSync(code),
      code
    );
  }

  transformJsx(jsxCode: string): ReturnType<Processor['processSync']> {
    if (!jsxCode.startsWith('/')) {
      jsxCode = '/* @jsxRuntime classic */\n/* @jsx mdx */\n\n'.concat(jsxCode);
    }
    const { code } = babelParser(jsxCode);
    return vFile(code);
  }

  js2MdxRenderer(jsCode: string) {
    jsCode = jsCode.replace(/export default function MDXContent/, 'return function MDXContent');
    return {
      code: jsCode,
      frontmatter: this.yamlData || {}
    };
  }

  mdx2Renderer(mdxCode: string) {
    this._validateCompiler();
    // mdx => jsx
    const { contents: jsxCode } = this.md2JsxSync(mdxCode);
    // jsx => babel => js
    const { contents: jsCode } = this.transformJsx(jsxCode as string);
    // js => renderer
    return this.js2MdxRenderer(jsCode as string);
  }
}
