const del = require('./delete');
const publish = require('./publish');
const path = require('path');

const RESOURCE_PATH = path.resolve(__dirname, '..', 'dist', 'resource');

(async function() {
    await del();
    await publish(RESOURCE_PATH);
})();