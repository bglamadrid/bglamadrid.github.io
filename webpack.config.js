const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/views/index.pug'
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true
  },
  plugins: [
    new PugPlugin({
      modules: [
        PugPlugin.extractCss({
          filename: 'styles/[name].css'
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
          'postcss-loader'
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
