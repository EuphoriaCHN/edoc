const _ = require('lodash');
const os = require('os');
const babelConfig = require('./babel.config');

let cssLoaderDefaultOpt = {};

// Style lost after css-loader upgraded
try {
  const cssLoaderVer = require('css-loader/package.json').version || '';
  const majorVer = parseInt(cssLoaderVer.split('.')[0], 10);
  if (majorVer >= 4) {
    cssLoaderDefaultOpt.esModule = false;
  }
} catch (error) { }

const createCheckerInRule = ext => {
  return function check(rule) {
    if (rule && typeof rule === 'object') {
      const test = rule.test || _.get(rule, 'resource.test');

      if (!test) {
        const oneOf = _.get(rule, 'oneOf');

        if (Array.isArray(oneOf) && oneOf.length) {
          return _.some(oneOf, item => check(item));
        }
      }

      return !!((_.isRegExp(test) && test.test(ext)) || (_.isFunction(test) && test(ext)));
    }
    return false;
  };
};

const checkIfJsx = createCheckerInRule('.jsx');
const checkIfTsx = createCheckerInRule('.tsx');
const checkIfSass = createCheckerInRule('.scss');
const checkIfCss = createCheckerInRule('.css');
const checkIfMdx = createCheckerInRule('.mdx');

const constants = {
  DEFAULT_EDOC_COMPONENT_PATH_REGS: [/edoc-mdx-renderer/i, /edoc-mdx-materials/i, /edoc-editor/i],

  DEFAULT_EDOC_CSS_PATH_REGS: [/edoc-mdx-renderer/i, /edoc-mdx-materials/i, /edoc-editor/i],
  DEFAULT_EDOC_SASS_PATH_REGS: [/edoc-mdx-renderer/i, /edoc-mdx-materials/i, /edoc-editor/i],

  DEFAULT_EDOC_MDX_PATH_REGS: [/edoc-editor/i],

  DEFAULT_EDOC_JSX_LOADER: 'babel-loader',
  DEFAULT_EDOC_TSX_LOADER: 'babel-loader',

  DEFAULT_EDOC_STYLE_LOADER: 'style-loader',
  DEFAULT_EDOC_CSS_LOADER: 'css-loader',
  DEFAULT_EDOC_SASS_LOADER: 'sass-loader',

  DEFAULT_EDOC_MDX_LOADER: 'raw-loader'
};

class EdocWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  get loaders() {
    return {
      jsx: options => ({
        loader: this._resolve(constants.DEFAULT_EDOC_JSX_LOADER),
        options,
      }),
      tsx: options => ({
        loader: this._resolve(constants.DEFAULT_EDOC_TSX_LOADER),
        options
      }),
      extract: () => _.get(this.options.extract, 'loader'),
      style: options => ({
        loader: this._resolve(constants.DEFAULT_EDOC_STYLE_LOADER),
        options,
      }),
      css: (importLoaders, options = {}) => ({
        loader: this._resolve(constants.DEFAULT_EDOC_CSS_LOADER),
        options: {
          importLoaders,
          ...cssLoaderDefaultOpt,
          ...options,
        },
      }),
      sass: options => ({
        ...this.loaders.scss(options),
      }),
      scss: options => ({
        loader: this._resolve(constants.DEFAULT_EDOC_SASS_LOADER),
        options,
      }),
      mdx: options => ({
        loader: this._resolve(constants.DEFAULT_EDOC_MDX_LOADER),
        options
      })
    };
  }

  get plugins() {
    return {
      extract: () => _.get(this.ctorOptions.extract, 'plugin'),
    };
  }

  _resolve(moduleId) {
    const resolve = this.options.resolve || _.identity;
    return resolve(moduleId);
  }

  _handlePaths(paths, defaultPaths) {
    if (Array.isArray(defaultPaths) && os.platform() === 'win32') {
      const rawDefault = defaultPaths;
      defaultPaths = [
        filePath => {
          filePath = filePath.replace(/[\\]+/g, '/');
          return rawDefault.some(reg => {
            if (reg instanceof RegExp) {
              return reg.test(filePath);
            } else if (typeof reg === 'string') {
              return reg === filePath;
            } else if (typeof reg === 'function') {
              return reg(filePath);
            }
          });
        },
      ];
    }
    if (typeof paths === 'function') {
      return paths([...defaultPaths]);
    } else if (Array.isArray(paths)) {
      return [...defaultPaths, ...paths];
    }
    return defaultPaths;
  }

  _addExcludePaths(rule, paths = []) {
    if (rule && typeof rule === 'object') {
      let exclude = rule.exclude || _.get(rule, 'resource.exclude');

      if (!exclude || !Array.isArray(exclude)) {
        exclude = exclude ? [exclude] : [];
        rule.exclude = exclude;
      }

      if (!Array.isArray(paths)) {
        paths = paths ? [paths] : [];
      }

      exclude.push(...paths);
    }
  }

  _injectJsxRules(rules, compiler) {
    if (Array.isArray(rules)) {
      const initOptions = this.options;

      const rawJsxRules = rules.filter(rule => checkIfJsx(rule));
      const edocJsxPaths = [...constants.DEFAULT_EDOC_COMPONENT_PATH_REGS];
      const edocPaths = this._handlePaths(initOptions.paths, edocJsxPaths);

      if (rawJsxRules.length) {
        rawJsxRules.map(rule => this._addExcludePaths(rule, edocPaths));
      }

      const use = initOptions.jsxUse || [this.loaders.jsx(babelConfig({ resolve: this._resolve.bind(this) }))];

      const test = /\.jsx?$/;

      rules.push({
        test,
        include: edocPaths,
        use,
      });
    }

    return rules;
  }

  _injectTsxRules(rules, compiler) {
    if (Array.isArray(rules)) {
      const initOptions = this.options;

      const rawTsxRules = rules.filter(rule => checkIfTsx(rule));
      const edocTsxPaths = [...constants.DEFAULT_EDOC_COMPONENT_PATH_REGS];
      const edocPaths = this._handlePaths(initOptions.paths, edocTsxPaths);

      if (rawTsxRules.length) {
        rawTsxRules.map(rule => this._addExcludePaths(rule, edocPaths));
      }

      const use = initOptions.tsxUse || [this.loaders.tsx(babelConfig({ resolve: this._resolve.bind(this) }))];

      const test = /\.tsx?$/;

      rules.push({
        test,
        include: edocPaths,
        use,
      });
    }

    return rules;
  }

  _injectCssRules(rules, compiler) {
    if (Array.isArray(rules)) {
      const initOptions = this.options;
      const rawCssRules = rules.filter(rule => checkIfCss(rule));
      const edocCssPaths = this._handlePaths(initOptions.cssPaths, constants.DEFAULT_EDOC_CSS_PATH_REGS);

      if (rawCssRules.length) {
        rawCssRules.map(rule => this._addExcludePaths(rule, edocCssPaths));
      }

      const cssUse = initOptions.cssUse || [
        initOptions.extract ? this.loaders.extract() : this.loaders.style(),
        this.loaders.css()
      ];

      const test = /\.css$/;

      rules.push({
        test,
        include: edocCssPaths,
        use: cssUse,
      });
    }

    return rules;
  }

  _injectSassRules(rules, compiler) {
    if (Array.isArray(rules)) {
      const initOptions = this.options;

      const rawSassRules = rules.filter(rule => checkIfSass(rule));
      const edocSassPaths = this._handlePaths(initOptions.scssPaths, constants.DEFAULT_EDOC_SASS_PATH_REGS);

      if (!!rawSassRules.length) {
        rawSassRules.forEach(rule => this._addExcludePaths(rule, edocSassPaths));
      }

      const sassUse = initOptions.sassUse || [
        initOptions.extract ? this.loaders.extract() : this.loaders.style(),
        this.loaders.css(2),
        this.loaders.sass()
      ];

      const test = /\.s[ca]ss$/;

      rules.push({
        test,
        include: edocSassPaths,
        use: sassUse
      });
    }

    return rules;
  }

  _injectMdxRules(rules, compiler) {
    if (Array.isArray(rules)) {
      const initOptions = this.options;

      const rawMdxRules = rules.filter(rule => checkIfMdx(rule));
      const edocMdxPaths = this._handlePaths(initOptions.mdxPaths, constants.DEFAULT_EDOC_MDX_PATH_REGS);

      if (!!rawMdxRules.length) {
        rawMdxRules.forEach(rule => this._addExcludePaths(rule, edocMdxPaths));
      }

      const mdxUse = initOptions.mdxUse || this.loaders.mdx();
      const test = /\.mdx?$/;

      rules.push({
        test,
        include: edocMdxPaths,
        use: mdxUse
      });
    }
  }

  _getOrSetBeforeGetting(src, path, checkFn, defaultValue) {
    let sth = _.get(src, path);

    if (!checkFn(sth)) {
      sth = defaultValue;
      _.set(src, path, sth);
    }

    return sth;
  }

  apply(compiler) {
    let rawRules = this._getOrSetBeforeGetting(compiler, 'options.module.rules', Array.isArray, []);

    rawRules = this._injectJsxRules(rawRules, compiler);
    rawRules = this._injectTsxRules(rawRules, compiler);

    rawRules = this._injectCssRules(rawRules, compiler);
    rawRules = this._injectSassRules(rawRules, compiler);

    rawRules = this._injectMdxRules(rawRules, compiler);
  }
}

module.exports = EdocWebpackPlugin;