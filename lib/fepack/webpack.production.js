'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const baseWebpackConfig = {};

// generate loader string to be used with extract text plugin
function generateLoaders () {
	const loaders = [{
    loader: 'css-loader',
    options: {
      sourceMap: false
    }
  }];

	return ExtractTextPlugin.extract({
		use: loaders,
		fallback: 'vue-style-loader'
	});
}
exports.getConfig = function(config) {
	const webpackConfig = {
		//mode: 'production',
		context: config.resWorkDir,
		entry: config.entry,
		output: {
			path: path.resolve(config.resWorkDir, config.dist||'dist'),
			filename: '[name].js'
		},
		resolve: {
			extensions: ['.wp.js', '.js', '.vue', '.json'],
			alias: {
				'vue$': 'vue/dist/vue.esm.js',
				'@': config.resWorkDir,
			},
			modules: [
				config.resWorkDir,
				path.resolve(__dirname, '../../node_modules')
			]
		},
		resolveLoader: {
			extensions: ['-loader','.js', '.vue'],
			modules: [
				path.resolve(__dirname, '../../node_modules')
			]
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {css: generateLoaders()},
						cssSourceMap: false,
						// postcss: {
						// 	plugins: [
						// 		require('autoprefixer')()
						// 	]
						// }
					}
				},
				{
					test: /\.js$/,
					loader: 'babel-loader?cacheDirectory',
					exclude: /(node_modules|bower_components)/,
					include: [config.resWorkDir]
				},
				{
					test: /\.css$/,
					use: generateLoaders()
				},
				{
					test: /\.html$/,
					loader: 'html-loader'
				}
			]
		},
		plugins: [
			// http://vuejs.github.io/vue-loader/en/workflow/production.html
			new webpack.DefinePlugin({
				'process.env': 'production'
			}),
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						warnings: false
					}
				},
				sourceMap: false,
				parallel: true,
				cache: true
			}),
			// extract css into its own file
			new ExtractTextPlugin({
				filename: '[name].css',
				// Setting the following option to `false` will not extract CSS from codesplit chunks.
				// Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
				// It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
				// increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
				allChunks: true,
			}),
			// Compress extracted CSS. We are using this plugin so that possible
			// duplicated CSS from different components can be deduped.
			new OptimizeCSSPlugin({
				cssProcessorOptions: { safe: true }
			}),
			// keep module.id stable when vendor modules does not change
			new webpack.HashedModuleIdsPlugin(),
			// enable scope hoisting
			new webpack.optimize.ModuleConcatenationPlugin()
		],
		node: {
			// prevent webpack from injecting useless setImmediate polyfill because Vue
			// source contains it (although only uses it if it's native).
			setImmediate: false,
			// prevent webpack from injecting mocks to Node native modules
			// that does not make sense for the client
			dgram: 'empty',
			fs: 'empty',
			net: 'empty',
			tls: 'empty',
			child_process: 'empty'
		}
	};
	return webpackConfig;
}