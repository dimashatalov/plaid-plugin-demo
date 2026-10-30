const path = require('path');

module.exports = {
 mode : "development",
 entry: './js/ds-plaid.js',
  output: {
    path: path.resolve(__dirname, '../'),
    filename: 'ds-plaid.js',
    library: 'DSPlaidLibrary',
    libraryTarget: "window"
  },
};
