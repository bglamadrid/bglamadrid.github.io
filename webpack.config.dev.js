const config = require('./webpack.config');

module.exports = Object.assign(
  config,
  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    }
  }
);
