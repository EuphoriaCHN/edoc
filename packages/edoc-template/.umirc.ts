import { defineConfig } from 'umi';
import EdocWebpackPlugin from 'edoc-webpack-plugin';

import Webpack from './node_modules/@umijs/deps/compiled/webpack';
import WebpackChain from 'webpack-chain';

import edocConfig from './.edocrc';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      component: '@/layouts/index',
      path: '*',
      routes: [
      ]
    },
  ],
  fastRefresh: {},
  history: {
    type: 'browser'
  },
  chunks: ['antdesigns', 'vendors', 'default.umi', 'umi', 'edocs'],
  async chainWebpack(config: WebpackChain) {
    config.plugin('edoc').use(new EdocWebpackPlugin());

    config.plugin('edoc-configs').use(new Webpack.DefinePlugin({
      Edoc: JSON.stringify(edocConfig)
    }));

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
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|moment|axios)[\\/]/,
          priority: -10,
        },
        antdesigns: {
          name: 'antdesigns',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
          priority: -11,
        },
        edocs: {
          name: 'edocs',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](edoc-mdx-materials|edoc-mdx-renderer)[\\/]/,
          priority: -12,
        },
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    })
  },
  publicPath: process.env.NODE_ENV === 'development' ? undefined : 'https://abs-console.oss-cn-hangzhou.aliyuncs.com/edoc_users/',
  polyfill: {
    imports: ['core-js/stable']
  },
  ignoreMomentLocale: true,
});
