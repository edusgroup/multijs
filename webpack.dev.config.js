const jsonCommon = require('./webpack.common.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const entryList = {
  'crypt': './dev/crypt/index.ts',
}

const pluginsList = {
  crypt: new HtmlWebpackPlugin({
    title: 'Encrypt file',
    template: 'dev/index.html',
    filename: './crypt.html',
    chunks: ['crypt'],
    hash: true,
  }),
}

const config = env => {
  const useEntryName = env['entry'] || 'all'
  let entry = {}
  let plugin = {}
  if (useEntryName === 'all') {
    entry = entryList
    plugin = pluginsList
  } else {
    entry[useEntryName] = entryList[useEntryName]
    plugin[useEntryName] = pluginsList[useEntryName]
  }

  const result = {
    ...jsonCommon,
    entry: entry,
    plugins: Object.values(plugin),
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,
    },
  }

  // result.module.rules.push({
  //   test: /\.scss$/,
  //   use: ['style-loader', 'css-loader', 'sass-loader'],
  // })

  return result
}

module.exports = config
