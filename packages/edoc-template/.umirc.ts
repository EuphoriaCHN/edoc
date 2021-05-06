import { defineConfig } from 'umi';
import EdocWebpackPlugin from 'edoc-webpack-plugin';

import Webpack from './node_modules/@umijs/deps/compiled/webpack';
import WebpackChain from 'webpack-chain';

import request from './src/hooks/api/request';

import _edocConfig from './.edocrc';

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

    const edocConfig: any = _edocConfig;

    const { AK } = edocConfig;

    const data: any = await request('checkProjectAK', true)({ AK });

    edocConfig.projectID = data.projectId;
    
    if (typeof edocConfig.prefix !== 'string') {
      edocConfig.prefix = '';
    }
    if ((edocConfig.prefix as string).endsWith('/')) {
      edocConfig.prefix = edocConfig.prefix.split(/\/$/)[0];
    }

    config.plugin('edoc-configs').use(new Webpack.DefinePlugin({
      Edoc: JSON.stringify(edocConfig)
    }));
  }
});
