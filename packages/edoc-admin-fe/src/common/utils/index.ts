import { createElement } from 'react';
import { Link } from 'react-router-dom';

import { Route as BreadcrumbRoute } from 'antd/lib/breadcrumb/Breadcrumb';

export function calculatePagination (current: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: (current - 1) * pageSize
  };
}


/**
 * AntD 面包屑配合 Browser Router 使用
 */
export function breadcrumbItemRender (
  route: BreadcrumbRoute, params: any, routes: Array<BreadcrumbRoute>, paths: Array<string>
) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last
    ? createElement('span', {}, route.breadcrumbName)
    : createElement(Link, { to: route.path }, route.breadcrumbName);
}
