const fs = require('fs');
const path = require('path');

const translate = require('google-translate-open-api').default;

const { I18N_PATH, I18N_DEFAULTS } = require('./constants');

(async function () {
    const i18nFileNames = fs.readdirSync(I18N_PATH);
    const sourceLangSimple = I18N_DEFAULTS.startsWith('zh') ? I18N_DEFAULTS.toLowerCase() : I18N_DEFAULTS.split('-')[0].toLowerCase();

    for (const i18nFileName of i18nFileNames) {
        const i18nFilePath = path.resolve(I18N_PATH, i18nFileName);

        const targetLang = i18nFileName.split(/([a-zA-Z-]+).json$/)[1];
        const targetLangSimple = targetLang.startsWith('zh') ? targetLang.toLowerCase() : targetLang.split(/-/)[0].toLowerCase();

        const fileStringData = fs.readFileSync(i18nFilePath, 'utf8');
        const fileData = JSON.parse(fileStringData);

        const translationKeys = Object.keys(fileData);

        console.log(`Start translate ${i18nFileName}, Source lang is ${sourceLangSimple}, Total ${translationKeys.length} keys`);

        if (targetLang === I18N_DEFAULTS) {
            for (const key in fileData) {
                fileData[key] = key;
            }
        } else {
            const { data } = await translate(translationKeys, {
                tld: 'cn',
                to: targetLangSimple,
                from: sourceLangSimple,
                client: 'dict-chrome-ex'
            });
            data[0].map(i => i[0][0][0]).forEach((text, index) => (fileData[translationKeys[index]] = text));
        }

        console.log(`End translate ${i18nFileName}\n`);
        fs.writeFileSync(i18nFilePath, JSON.stringify(fileData, null, 2), { encoding: 'utf8' });
    }
})();