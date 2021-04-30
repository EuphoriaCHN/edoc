import babelParser from '../babelParser';
import MdxCodeFrameError from '../MdxCodeFrameError';

import { Node, Parent } from 'unist';
import { SKIP } from 'unist-util-visit';

export default function (node: Node, index: number, parent: Parent) {
  try {
    babelParser(node.value as string);
  } catch (error) {
    const { line, column } = error.loc || {};
    const errLine = node.position.start.line + line - 1;
    throw new MdxCodeFrameError({
      message: (error.message.split(/\n/)[0] || '').replace(/\(\d+\:\d+\)$/, `(${errLine}:${column})`),
      line: errLine,
      column
    });
  }
  return SKIP;
}