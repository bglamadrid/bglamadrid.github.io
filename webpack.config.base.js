const path = require('path');

module.exports = {
  entry: {
    index: './src/views/index.pug',
    bio: './src/views/bio.pug'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      Images: path.join(__dirname, './src/images'),
      Scripts: path.join(__dirname, './src/scripts'),
      Views: path.join(__dirname, './src/views')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /styles\.css$/,
        use: [
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|webp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]'
        }
      },
      {
        test: /favicon\.ico$/,
        type: 'asset/resource',
        generator: {
          filename: 'favicon.ico'
        }
      }
    ]
  }
};
