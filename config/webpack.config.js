const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const rootPath = process.cwd()
const distPath = path.join(rootPath, 'dist')
const srcPath = path.join(rootPath, 'src')

const ATTRIBUTES_TO_EXPAND = [
  'src', 'href', 'gltf-model', 'cover-image-url', 'footer-image-url', 'watermark-image-url',
]

const NON_BUNDLED_HTML_ASSET = /\.svg(?:[?#].*)?$/i
const EXTERNAL_OR_INLINE_URL = /^(?:https?:|data:|blob:|#)/i

const shouldExpandHtmlAttribute = (tag, attribute, attributes = {}) => {
  const value = attributes[attribute]
  if (!value || typeof value !== 'string') return false
  if (tag === 'script' && attribute === 'src') return false
  if (attribute === 'href' && String(attributes.rel || '').toLowerCase().split(/\s+/).includes('ar')) {
    return false
  }
  if (NON_BUNDLED_HTML_ASSET.test(value)) return false
  if (EXTERNAL_OR_INLINE_URL.test(value)) return false
  return true
}

const makeJsLoader = () => ({
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
  exclude: /node_modules/,
})

const makeCssLoader = () => ({
  test: /\.css$/,
  exclude: /\/assets\//,
  use: ['style-loader', 'css-loader'],
})

const makeAssetLoader = () => ({
  test: /\..*$/,
  include: [path.join(srcPath, 'assets')],
  loader: path.join(__dirname, 'asset-loader.js'),
})

const makeDefaultHtmlLoader = () => ({
  test: /\.html$/,
  use: {
    loader: 'html-loader',
    options: {
      esModule: false,
      sources: {
        list: [
          '...',
          {
            tag: 'script',
            attribute: 'src',
            type: 'src',
            filter: () => false,
          },
          ...ATTRIBUTES_TO_EXPAND.map(attr => ({
            tag: '*',
            attribute: attr,
            type: 'src',
            filter: shouldExpandHtmlAttribute,
          })),
        ],
      },
    },
  },
})

module.exports = {
  entry: path.join(srcPath, 'app.js'),
  output: {
    filename: 'bundle.js',
    path: distPath,
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(rootPath, 'external'),
          to: path.join(distPath, 'external'),
          noErrorOnMissing: true,
        },
        {
          from: path.join(rootPath, 'node_modules', '@8thwall', 'engine-binary', 'dist'),
          to: path.join(distPath, 'external', 'xr'),
          noErrorOnMissing: true,
        },
        {
          from: path.join(srcPath, 'assets'),
          to: path.join(distPath, 'assets'),
          noErrorOnMissing: true,
        },
        {
          from: path.join(rootPath, '_headers'),
          to: path.join(distPath, '_headers'),
          toType: 'file',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      makeJsLoader(),
      makeCssLoader(),
      makeAssetLoader(),
      makeDefaultHtmlLoader(),
    ],
  },
  mode: 'production',
  context: srcPath,
  devServer: {
    open: false,
    compress: true,
    hot: true,
    liveReload: false,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
}
