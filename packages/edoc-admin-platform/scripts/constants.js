const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');
const I18N_PATH = path.resolve(SRC_PATH, 'common', 'locales');

module.exports = {
    EDOC_ADMIN_BUCKET_PREFIX: '/edoc_platform/',
    ROOT_PATH,
    SRC_PATH,
    NODE_MODULES_PATH,
    I18N_PATH,

    I18N_DEFAULTS: 'zh-CN',
    I18N_LANGS: ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR']
};