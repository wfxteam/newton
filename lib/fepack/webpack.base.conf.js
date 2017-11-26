const path = require('path');
module.exports = function(config) {
	let resRoot = path.resolve(config.appDir, config.resDir);
	const ExtractTextPlugin = require('extract-text-webpack-plugin');
	let distDir;
	if(config.dist)
		distDir = path.resolve(config.appDir, config.dist);
	else 
		distDir = path.resolve(resRoot, 'dist');
	return {
		//context: path.resolve(config.appDir, config.resDir),
		entry: config.entry,
		resolve: {
			extensions: ['.js', '.vue', '.wp.js'],
			modules: [
				resRoot
			],
			output: {
				path: distDir,
				filename: '[name].js'
			}
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: ['vue-style-loader', 'css-loader'],
						cssSourceMap: false,
						extractCss: config.extractCss,
						postcss: {
							plugins: [
								require('autoprefixer')()
							]
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
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'postcss-loader']
					})
				},
				{
					test: /\.html$/,
					loader: 'html-loader'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin({
				filename: '[name].css'
			})
		]
	};
};