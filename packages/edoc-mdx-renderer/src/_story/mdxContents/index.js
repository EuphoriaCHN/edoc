const contentModules = require.context('./contents', false, /\.js$/);

const contents = [];

contentModules.keys().forEach(key => {
  contents.push({ key: key.split(/^\.\/(.+)\.js$/)[1], module: contentModules(key) });
});

export default contents;