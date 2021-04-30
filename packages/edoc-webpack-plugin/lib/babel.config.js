const { identity } = require('lodash');

module.exports = function babelConfig({ resolve = identity }) {
  return {
    presets: [
      [
        resolve('@babel/preset-env'),
        {
          modules: false,
          debug: false,
        },
      ],
      resolve('@babel/preset-react'),
      resolve('@babel/preset-typescript')
    ],
    plugins: [
      resolve('@babel/plugin-transform-runtime'),
      resolve('@babel/plugin-proposal-class-properties'),
      resolve('@babel/plugin-proposal-object-rest-spread'),
    ],
  };
};
