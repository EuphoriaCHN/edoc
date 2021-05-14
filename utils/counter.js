const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const IGNORE_REGEXPS = [
    /node_modules/,
    new RegExp(path.resolve(ROOT, 'utils')),
    /package-lock\.json/,
    /package\.json/,
    /yarn\.lock/,
    /\.umi/,
    /\.git/,
    /dist/,
    /utils\\counter\.js$/
];

const filesData = {};

function readDirDeep(dirPath) {
    const dirChildItems = fs.readdirSync(dirPath, 'utf8');

    for (const itemName of dirChildItems) {
        const itemPath = path.resolve(dirPath, itemName);

        let ignoredFlag = false;
        for (const ignored of IGNORE_REGEXPS) {
            if (ignored.test(itemPath)) {
                ignoredFlag = true;
                break;
            }
        }
        if (ignoredFlag) {
            continue;
        }

        const isDir = fs.statSync(itemPath).isDirectory();

        if (isDir) {
            readDirDeep(itemPath);
        } else {
            const fileData = fs.readFileSync(itemPath, 'utf8');
            console.log(`${path.relative(ROOT, itemPath)}: ${fileData.length} characters`);

            filesData[itemPath] = {
                rows: fileData.split(/\n/).length,
                words: fileData.length
            };
        }
    }
}

readDirDeep(ROOT);

const rowsCount = Object.values(filesData).map(item => item.rows).reduce((a, b) => a + b, 0);
const wordsCount = Object.values(filesData).map(item => item.words).reduce((a, b) => a + b, 0);

console.log({
    rowsCount,
    wordsCount
});