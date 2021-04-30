import * as React from 'react';

export interface IMDXRendererScope {
  [k: string]: any;
}

const GatsbyMDXScopeContext = React.createContext<IMDXRendererScope>({});

export const useMDXScope = (scope?: IMDXRendererScope) => {
  const contextScope = React.useContext(GatsbyMDXScopeContext)
  return scope || contextScope;
}

export const MDXScopeProvider = ({ __mdxScope, children }) =>
  React.createElement(
    GatsbyMDXScopeContext.Provider,
    { value: __mdxScope },
    children
  );
