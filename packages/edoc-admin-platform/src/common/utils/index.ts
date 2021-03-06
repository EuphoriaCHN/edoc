import { createElement } from 'react';
import { useHistory } from 'umi';

import prettier from 'prettier/standalone';
import prettierMarkdown from 'prettier/parser-markdown';
import prettierHTML from 'prettier/parser-html';
import prettierJS from 'prettier/parser-babel';
import { Typography } from 'antd';

import { Route as BreadcrumbRoute } from 'antd/lib/breadcrumb/Breadcrumb';

export function calculatePagination(current: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: (current - 1) * pageSize
  };
}


/**
 * AntD 面包屑配合 Browser Router 使用
 */
export function breadcrumbItemRender(
  route: BreadcrumbRoute, params: any, routes: Array<BreadcrumbRoute>, paths: Array<string>
) {
  const _history = useHistory();

  const last = routes.indexOf(route) === routes.length - 1;
  return last
    ? createElement('span', { className: 'project-breadcrumb-text project-breadcrumb-text-active' }, route.breadcrumbName)
    : createElement(
      Typography.Link,
      {
        onClick: () => _history.push(route.path),
        className: 'project-breadcrumb-text'
      },
      route.breadcrumbName
    );
}

/**
 * 格式化 MDX 代码
 * 
 * @throws {SyntaxError}
 */
export function prettierMDX(content: string): string {
  const prettierRes = prettier.format(content, {
    parser: 'mdx',
    plugins: [prettierMarkdown, prettierHTML, prettierJS]
  });
  return prettierRes;
}