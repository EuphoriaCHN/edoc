import { defineConfig } from 'umi';
import EdocWebpackPlugin from 'edoc-webpack-plugin';

import WebpackChain from 'webpack-chain';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      component: '@/layouts/index',
      path: '*',
      routes: [
        { path: '/siteDetail/:siteID/:pageLibraryID/:documentID', component: '@/containers/EditDocument' },
        { path: '/siteDetail/:siteID/:pageLibraryID', component: '@/containers/BusinessDocuments' },
        { path: '/siteDetail/:siteID', component: '@/containers/SiteDetail' },
        { path: '/platform', component: '@/containers/Platform' },
        { path: '/', component: '@/containers/Platform', exact: true },
        { path: '*', component: '@/containers/NotFound' }
      ]
    },
  ],
  fastRefresh: {},
  history: {
    type: 'browser'
  },
  chainWebpack(config: WebpackChain) {
    config.plugin('edoc').use(new EdocWebpackPlugin());

    config.module
      .rule('edoc-editor-preset-mdx-loader')
      .test(/\.mdx?$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
  ignoreMomentLocale: true,
  polyfill: {
    imports: ['core-js/stable']
  },
  dynamicImport: {
    loading: '@/containers/Loading'
  },
  publicPath: process.env.NODE_ENV === 'development' ? undefined : 'https://abs-console.oss-cn-hangzhou.aliyuncs.com/',
  define: {
    AUTHORIZATION_KEY: 'Authorization'
  },
  favicon: 'https://s2.aconvert.com/convert/p3r68-cdx67/aoybn-a6snw-001.ico'
});
