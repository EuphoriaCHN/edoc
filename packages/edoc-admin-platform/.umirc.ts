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
        { path: '/userCenter', component: '@/containers/UserCenter' },
        { path: '/aliPayLogin', component: '@/containers/AliPayLogin' },
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
  chunks: ['antdesigns', 'vendors', 'standalone', 'edocs', 'umi'],
  chainWebpack(config: WebpackChain) {
    config.plugin('edoc').use(new EdocWebpackPlugin());

    config.optimization.splitChunks({
      chunks: 'all',
      automaticNameDelimiter: '.',
      name: true,
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 5,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|lodash-es|moment|axios|classnames|@redux-toolkit|react-redux|validator|jquery)[\\/]/,
          priority: -10,
        },
        antdesigns: {
          name: 'antdesigns',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](rc-|@ant-design|antd|@antv)[\\/]/,
          priority: -11,
        },
        standalone: {
          name: 'standalone',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@babel|prettier|remark-mdx|@mdx-js)[\\/]/,
          priority: -12,
        },
        edocs: {
          name: 'edocs',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](edoc-mdx-materials|edoc-mdx-renderer|edoc-mdx-parser|tui-editor|codemirror|markdown-it|highlight.js)[\\/]/,
          priority: -14,
        },
      }
    })

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
  // dynamicImport: {
  //   loading: '@/containers/Loading'
  // },
  publicPath: process.env.NODE_ENV === 'development' ? undefined : 'https://abs-console.oss-cn-hangzhou.aliyuncs.com/edoc_platform/',
  define: {
    AUTHORIZATION_KEY: 'Authorization',
    DEV_IP: 'http://192.168.28.24:21002',
    PROD_URL: 'http://abs.bhj-noshampoo.site',
    ONLINE_URL: 'http://edoc.bhj-noshampoo.site',
    I18N_COOKIE_KEY: 'locale'
  },
  favicon: 'https://abs-image.oss-cn-hangzhou.aliyuncs.com/20210519040428160_easyicon_net_32.ico',
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  }
});
