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
      routes: []
    },
  ],
  fastRefresh: {},
  history: {
    type: 'browser'
  },
  define: {
    Edoc: {
      prefix: '/content'
    },
    I18N_COOKIE_KEY: 'locale'
  },
  chunks: ['antdesigns', 'vendors', 'standalone', 'edocs', 'umi'],
  async chainWebpack(config: WebpackChain) {
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
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|moment|axios|classnames|js-cookie)[\\/]/,
          priority: -10,
        },
        antdesigns: {
          name: 'antdesigns',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design|antd|@antv)[\\/]/,
          priority: -11,
        },
        standalone: {
          name: 'standalone',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@babel|remark-mdx|@mdx-js)[\\/]/,
          priority: -12,
        },
        edocs: {
          name: 'edocs',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](edoc-mdx-materials|edoc-mdx-parser|edoc-mdx-renderer)[\\/]/,
          priority: -13,
        },
        // default: {
        //   minChunks: 1,
        //   priority: -20,
        //   reuseExistingChunk: true
        // }
      }
    })
  },
  publicPath: process.env.NODE_ENV === 'development' ? undefined : 'https://abs-console.oss-cn-hangzhou.aliyuncs.com/edoc_users/',
  polyfill: {
    imports: ['core-js/stable']
  },
  ignoreMomentLocale: true,
});
