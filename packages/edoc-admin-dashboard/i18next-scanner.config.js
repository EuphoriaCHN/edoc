const { I18N_LANGS, I18N_DEFAULTS } = require('./scripts/constants');

module.exports = {
    options: {
      debug: false,
      func: {
        list: ['i18next.t', 'i18n.t', 'props.t', 't'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      trans: false,
      lngs: I18N_LANGS,
      defaultLng: I18N_DEFAULTS,
      resource: {
        loadPath: './src/common/locales/{{lng}}.json',
        savePath: './src/common/locales/{{lng}}.json',
        jsonIndent: 2,
        lineEnding: '\n',
      },
      removeUnusedKeys: true,
      nsSeparator: true,
      keySeparator: true,
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
    },
  };