import * as React from 'react';
import MDXRenderer from '../MDXRenderer/MDXRenderer';
import { MDXProvider } from '@mdx-js/react';
import { Tag, message, notification } from 'antd';

import { EdocMdxParser } from 'edoc-mdx-parser';

import { getDefaultProviderComponents } from '../../lib/getProviderComponents';

const DEFAULT_RENDERER = 'return function(a){return null;};';
const compiler = new EdocMdxParser();

export const Core = props => {
  const [renderer, setRenderer] = React.useState(DEFAULT_RENDERER);
  const [frontmatter, setFrontmatter] = React.useState<{ [k: string]: any }>({});
  const [isError, setIsError] = React.useState(false);

  const providerComponents = React.useMemo(() => {
    return getDefaultProviderComponents({
      withoutLinkTitle: !!props.withoutLinkTitle,
      onTitleCopy: props.onTitleCopy
    });
  }, [props.withoutLinkTitle, props.onTitleCopy]);

  React.useEffect(() => {
    typeof props.getYamlConfig === 'function' && props.getYamlConfig(frontmatter);
  }, [frontmatter]);

  React.useEffect(() => {
    props.onRenderStart && props.onRenderStart();
    setIsError(false);
    if (typeof props.renderer === 'string') {
      // 手动传入了 renderer
      setRenderer(props.renderer);
      setFrontmatter(props.frontmatter || {});
      return;
    }
    // 传入了错误的 Markdown 字符串，展示 null
    if (typeof props.markdown !== 'string') {
      setRenderer(DEFAULT_RENDERER);
      setFrontmatter(props.frontmatter || {});
      return;
    }

    // 将 Markdown 进行 parse
    try {
      const { code, frontmatter: parsedFrontmatter } = compiler.mdx2Renderer(props.markdown);
      setRenderer(code);
      setFrontmatter(parsedFrontmatter);
    } catch (err) {
      setIsError(true);
      typeof props.onRenderError === 'function' && props.onRenderError(err);
    } finally {
      props.onRenderEnd && props.onRenderEnd();
    }
  }, [props.markdown, props.renderer, props.frontmatter]);

  const renderTitleArea = React.useMemo(() => {
    const { title, draft, brief } = frontmatter;
    if (!title && !draft && !brief) {
      return null;
    }

    return (
      <div className={'title-area'}>
        <div>
          {draft ? <Tag color="orange">DRAFT</Tag> : null}
          <h1 className={'article-title'} dangerouslySetInnerHTML={{ __html: title }} />
          <div className={'article-brief'} dangerouslySetInnerHTML={{ __html: brief }} />
        </div>
      </div>
    );
  }, [frontmatter]);

  const renderMainArticle = React.useMemo(() => (
    <div className={'main-article'}>
      <MDXProvider components={Object.assign({}, providerComponents, props.components || {})}>
        <MDXRenderer scope={{ message, notification }}>
          {renderer}
        </MDXRenderer>
      </MDXProvider>
    </div>
  ), [props.components, renderer]);

  const render = React.useMemo(() => {
    return (
      <div className={(props.className || '').concat(' article-wrapper')}>
        {renderTitleArea}
        {renderMainArticle}
      </div>
    );
  }, [renderTitleArea, renderMainArticle, props.className]);

  return isError ? (props.errorView || null) : render;
};
