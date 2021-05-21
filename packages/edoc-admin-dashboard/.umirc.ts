import { defineConfig } from 'umi';
import WebpackChain from 'webpack-chain';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      component: '@/layout/index',
      path: '/',
      routes: [
        { path: '/monitor', component: '@/containers/Monitor' },
        { path: '/config', component: '@/containers/Configuration' },
        { path: '*', component: '@/containers/NotFound' }
      ]
    },
  ],
  fastRefresh: {},
  history: {
    type: 'browser'
  },
  chunks: ['antdesigns', 'vendors', 'umi'],
  chainWebpack(config: WebpackChain) {
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
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|lodash-es|moment|axios|classnames|i18next|react-i18next)[\\/]/,
          priority: -10,
        },
        antdesigns: {
          name: 'antdesigns',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](rc-|@ant-design|antd|@antv)[\\/]/,
          priority: -11,
        },
      }
    })
  },
  define: {
    AUTHORIZATION_KEY: 'Authorization',
    DEV_IP: 'http://192.168.28.24:30156',
    PROD_URL: 'http://abs.bhj-noshampoo.site',
    ONLINE_URL: 'http://edoc.bhj-noshampoo.site',
    I18N_COOKIE_KEY: 'locale',
    PREFIX: ''
  },
  publicPath: process.env.NODE_ENV === 'development' ? undefined : 'https://abs-console.oss-cn-hangzhou.aliyuncs.com/edoc_dashboard/',
  favicon: 'https://abs-image.oss-cn-hangzhou.aliyuncs.com/enhance-timer.ico',
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  ignoreMomentLocale: true,
  polyfill: {
    imports: ['core-js/stable']
  },
});
