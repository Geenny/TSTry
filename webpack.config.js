const path = require('path');

module.exports = {
  entry: './wrapper.js',
  output: {
    filename: './wrapper.js',
    path: path.resolve(__dirname, 'dist')
  }
};
