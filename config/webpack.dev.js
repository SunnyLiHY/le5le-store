const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const commonConfig = require('./webpack.common.js');

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8102;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
});


const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

module.exports = function (options) {
  return webpackMerge(commonConfig({env: ENV}), {
    devtool: 'cheap-module-source-map',
    output: {
      path: helpers.root('docs'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
      library: 'ac_[name]',
      libraryTarget: 'var',
    },
    module: {
      // rules: [
      //   {
      //     test: /\.ts$/,
      //     use: [
      //       {
      //         loader: 'tslint-loader',
      //         options: {
      //           configFile: 'tslint.json'
      //         }
      //       }
      //     ],
      //     exclude: [/\.(spec|e2e)\.ts$/]
      //   }
      // ]
    },
    plugins: [
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
        }
      }),
      new DllBundlesPlugin({
        bundles: {
          polyfills: [
            'core-js',
            {
              name: 'zone.js',
              path: 'zone.js/dist/zone.js'
            },
            {
              name: 'zone.js',
              path: 'zone.js/dist/long-stack-trace-zone.js'
            },
          ],
          vendor: [
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/core',
            '@angular/common',
            '@angular/forms',
            '@angular/http',
            '@angular/router',
            '@angularclass/hmr',
            'rxjs',
          ]
        },
        dllDir: helpers.root('dll'),
        webpackConfig: webpackMergeDll(commonConfig({env: ENV}), {
          devtool: 'cheap-module-source-map',
          plugins: []
        })
      }),
      new AddAssetHtmlPlugin([
        { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('polyfills')}`) },
        { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('vendor')}`) }
      ]),
      new LoaderOptionsPlugin({
        debug: true,
        options: {
          postcss: function (bundler) {
            return [
              require('postcss-import')({ addDependencyTo: bundler }),
              require('precss')(),
              require('autoprefixer')({
                browsers: helpers.AUTOPREFIXER_BROWSERS
              })
            ];
          },
        }
      }),
      new ExtractTextPlugin('[name].css'),
    ],
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}
