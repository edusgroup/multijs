const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['cache-loader', 'babel-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '@wumvi/fileupload': path.resolve(__dirname, 'src/')
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
}
