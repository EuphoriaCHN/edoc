const ossClient = require('./client');

const path = require('path');
const fs = require('fs');

function getFileChildItems(dirPath) {
    const data = {};
    const childItems = fs.readdirSync(dirPath, 'utf8');

    for (const fileName of childItems) {
        const filePath = path.resolve(dirPath, fileName);
        const isDir = fs.statSync(filePath).isDirectory();

        if (isDir) {
            data[filePath] = getFileChildItems(filePath);
        } else {
            data[filePath] = null;
        }
    }

    return data;
}

let promiseList = [];

function put(filesData, resourcePath) {
    Object.keys(filesData).forEach(fullFilePath => {
        if (!!filesData[fullFilePath]) {
            put(filesData[fullFilePath], resourcePath);
            return;
        }
        const bucketFilePath = fullFilePath.replace(resourcePath, '').replace(/^\\/, '').replace(/\\/g, '/');
        promiseList.push(ossClient.put(bucketFilePath, fullFilePath));
    });
}

module.exports = async function(resourcePath) {
    promiseList = [];

    const fileItems = getFileChildItems(resourcePath);
    put(fileItems, resourcePath);

    Promise.all(promiseList).then(value => {
        console.log('SUCCESS');
    }, err => {
        console.error(err);
    });
};