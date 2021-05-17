const fs = require('fs');
const { fork } = require('child_process');
const path = require('path');
const { ROOT_PATH, NODE_MODULES_PATH } = require('./constants');

const DIST = `${ROOT_PATH}\\dist`;

const UMI_SCRIPT = path.resolve(NODE_MODULES_PATH, 'umi', 'bin', 'umi.js');

if (fs.existsSync(DIST)) {
    fs.readdirSync(DIST).forEach(name => {
        const itemPath = path.resolve(DIST, name);
        fs.unlinkSync(itemPath);
    });
    fs.rmdirSync(DIST);
}

const runProcess = fork(UMI_SCRIPT, ['dev']);
