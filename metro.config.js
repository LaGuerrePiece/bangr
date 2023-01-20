const path = require('path');

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

const moduleRoot = path.resolve(__dirname, '../');

module.exports = {
  watchFolders: [moduleRoot],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    nodeModulesPaths
  },
};