const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  entry: {
    index: './src/views/index.pug'
  },
  output: {
    filename: 'scripts/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true
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
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render'
        }
      },
      {
        test: /\.(css)$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env'
                ]
              }
            }
          }
        ]
      },
      {
        test: /favicon\.ico/,
        type: 'asset/resource',
        generator: {
          filename: 'favicon.ico'
        }
      }
    ]
  }
};
