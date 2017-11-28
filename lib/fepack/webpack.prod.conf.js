var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(config){
	let baseWebpackConfig = require('./webpack.base.conf')(config);
	return merge(baseWebpackConfig, {
		plugins: [
			// http://vuejs.github.io/vue-loader/en/workflow/production.html
			new webpack.DefinePlugin({
				'process.env': "'production'"
			}),
			new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					},
					sourceMap: false
				}),
			// extract css into its own file
			new ExtractTextPlugin({
				filename: '[name].css'
			}),
			// Compress extracted CSS. We are using this plugin so that possible
			// duplicated CSS from different components can be deduped.
			new OptimizeCSSPlugin({
				cssProcessorOptions: {
					safe: true
				}
			})
		]
	});
};