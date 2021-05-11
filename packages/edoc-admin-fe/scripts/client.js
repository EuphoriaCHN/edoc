const OSS = require('ali-oss');
const config = require('./config');

const client = new OSS(config);

module.exports = client;