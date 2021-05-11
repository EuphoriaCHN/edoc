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
  async chainWebpack(config: WebpackChain) {
    config.plugin('edoc').use(new EdocWebpackPlugin());

    config.plugin('edoc-configs').use(new Webpack.DefinePlugin({
      Edoc: JSON.stringify(edocConfig)
    }));
  }
});
