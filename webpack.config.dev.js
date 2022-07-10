const config = require('./webpack.config');

module.exports = Object.assign(
  config,
  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
    output: {
      filename: 'scripts/[name].[contenthash:8].js'
    },
    plugins: [
      new PugPlugin({
        modules: [
          PugPlugin.extractCss({
            filename: 'styles/[name].[contenthash:8].css'
          })
        ]
      })
    ],
  }
);
