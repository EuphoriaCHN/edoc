import * as React from 'react';
import { mdx } from '@mdx-js/react';
import { useMDXScope, IMDXRendererScope } from './Context';

export interface IMDXRendererProps {
  children: string;
  scope?: IMDXRendererScope;
  [k: string]: any;
}

export default function MDXRenderer(_props: IMDXRendererProps) {
  const { children, scope, ...props } = _props;

  const mdxScope = useMDXScope(scope);

  const End = React.useMemo(() => {
    if (!children) {
      return null
    }

    const fullScope = {
      React,
      mdx,
      ...mdxScope,
    }

    const keys = Object.keys(fullScope)
    const values = keys.map(key => fullScope[key])
    const fn = new Function(`_fn`, ...keys, `${children}`)

    return fn({}, ...values)
  }, [children, scope])

  return <End {...props} />;
}
