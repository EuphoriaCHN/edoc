const fs = require('fs');
const { fork } = require('child_process');
const path = require('path');

const ROOT = process.cwd();
const DIST = `${ROOT}\\dist`;

const UMI_SCRIPT = path.resolve(ROOT, 'node_modules', 'umi', 'bin', 'umi.js');

if (fs.existsSync(DIST)) {
    fs.readdirSync(DIST).forEach(name => {
        const itemPath = path.resolve(DIST, name);
        fs.unlinkSync(itemPath);
    });
    fs.rmdirSync(DIST);
}

const runProcess = fork(UMI_SCRIPT, ['dev']);
