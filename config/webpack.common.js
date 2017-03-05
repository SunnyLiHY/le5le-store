const webpack = require('webpack');
const helpers = require('./helpers');

const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const AOT = helpers.hasNpmFlag('aot');

module.exports = function (options) {
  isProd = options.env === 'production';
  return {
    entry: {
      'polyfills': './demo/polyfills.browser.ts',
      'main':      AOT ? './demo/main.browser.aot.ts' :
                  './demo/main.browser.ts'
    },

    resolve: {
      extensions: ['.ts', '.js', '.json']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: '@angularclass/hmr-loader',
              options: {
                pretty: !isProd,
                prod: isProd
              }
            },
            { // MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
              loader: 'ng-router-loader',
              options: {
                loader: 'async-import',
                genDir: 'compiled',
                aot: AOT
              }
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig.webpack.json'
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        {
          test: /\.json$/,
          use: 'json-loader'
        },

        {
          test: /\.pcss$/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [{
              loader: "css-loader"
            },{
              loader: "postcss-loader"
            }]
          })
        },

        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('demo/index.html')]
        },

        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        }
      ]
    },

    plugins: [
      new AssetsPlugin({
        path: helpers.root('docs'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new CheckerPlugin(),
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules/.test(module.resource)
      }),
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
        helpers.root('src'), // location of your src
        {
          // your Angular Async Route paths relative to this root directory
        }
      ),

      new CopyWebpackPlugin([
        { from: 'demo/assets/img', to: 'assets/img' },
        { from: 'demo/browser.html', to: '../browser.html' },
      ]),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'demo/index.html'
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new LoaderOptionsPlugin({
        options: {
        }
      }),

      // Fix Angular 2
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)async/,
        helpers.root('node_modules/@angular/core/src/facade/async.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)collection/,
        helpers.root('node_modules/@angular/core/src/facade/collection.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)errors/,
        helpers.root('node_modules/@angular/core/src/facade/errors.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)lang/,
        helpers.root('node_modules/@angular/core/src/facade/lang.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)math/,
        helpers.root('node_modules/@angular/core/src/facade/math.js')
      ),

      new ngcWebpack.NgcWebpackPlugin({
        disabled: !AOT,
        tsConfig: helpers.root('tsconfig.webpack.json'),
        resourceOverride: helpers.root('config/resource-override.js')
      })

    ],

    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
}
