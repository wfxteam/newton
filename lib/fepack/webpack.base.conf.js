const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config){
	let resourceRoot = path.resolve(config.appPath,'www/resource');
	let distPath = path.resolve(resourceRoot, 'dist');
	var webpackConfig = {
		entry: config.entry,
		resolve: {
			extensions: ['.wp.js', '.js', '.vue'],
			modules: [
				resourceRoot,
				path.resolve(__dirname,'../../node_modules')
			]
		},
		resolveLoader: {
			//extensions: ['.wp.js', '.js', '.vue'],
			modules: [
				path.resolve(__dirname,'../../node_modules')
			]
		},
		output: {
			path: distPath,
			filename: '[name].js'
		},
		module: {
			rules: [
				{ 
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						use: [{
							loader: 'css-loader',
							options: {
								minimize: true,
								sourceMap: false
							}
						},{
							loader: 'postcss-loader'
						}],
						fallback: 'vue-style-loader'
					})
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							css: ExtractTextPlugin.extract({
								use: [{
									loader: 'css-loader',
									options: {
										minimize: true,
										sourceMap: false
									}
								}],
								fallback: 'vue-style-loader'
							})
						}
					}
				},
				{
		      test: /\.js$/,
		      exclude: /(node_modules|bower_components)/,
		      use: {
		        loader: 'babel-loader?cacheDirectory'
		      }
		    },
				{
					test: /\.html$/,
					loader: 'html-loader'
				}
			]
		}
	};
	return webpackConfig;
}