const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');

const EdocWebpackPlugin = require('../packages/edoc-webpack-plugin');

function resolve(...dirs) {
  return path.join(__dirname, '../', ...dirs);
}

const stories = !!process.env.EDITOR ? [
  "../packages/edoc-editor/**/*.stories.@(js|jsx|ts|tsx|mdx)"
] : [
  "../packages/edoc-mdx-renderer/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  "../packages/edoc-mdx-materials/**/*.stories.@(js|jsx|ts|tsx|mdx)"
];

module.exports = {
  "stories": stories,
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-viewport"
  ],
  webpackFinal: async config => {
    config.resolve.alias = {
      'edoc-mdx-parser': resolve('packages/edoc-mdx-parser'),
      'edoc-mdx-renderer': resolve('packages/edoc-mdx-renderer'),
      'edoc-mdx-materials': resolve('packages/edoc-mdx-materials'),

      'react': resolve('node_modules/react'),
      'react-dom': resolve('node_modules/react-dom'),
      'classnames': resolve('node_modules/classnames'),
      'react-player': resolve('node_modules/react-player'),

      'antd': resolve('node_modules/antd'),
      '@ant-design/icons': resolve('node_modules/@ant-design/icons'),
      '@ant-design/charts': resolve('node_modules/@ant-design/charts')
    };

    config.node = {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    };

    if (!!process.env.EDITOR) {
      config.plugins.push(new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }));
      if (!config.externals) {
        config.externals = {};
      }
      config.externals['jquery'] = 'jQuery';
    }

    config.plugins.push(
      new EdocWebpackPlugin({
        paths: [
          function (path) {
            return (
              (
                /packages\/edoc-mdx-renderer/i.test(path)
                || /packages\/edoc-mdx-materials/i.test(path)
                || /packages\/edoc-mdx-editor/i.test(path)
              ) &&
              !(
                /packages\/edoc-mdx-renderer\/node_modules/i.test(path)
                || /packages\/edoc-mdx-materials\/node_modules/i.test(path)
                || /packages\/edoc-mdx-editor\/node_modules/i.test(path)
              )
            );
          },
        ],
        scssPaths: [
          resolve('packages/edoc-mdx-renderer'),
          resolve('packages/edoc-mdx-materials'),
          resolve('packages/edoc-mdx-editor'),
        ],
      }),
      new webpack.DefinePlugin({
        DEV: true
      }),
    );

    return config;
  }
}