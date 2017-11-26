const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(config) {
	let baseConfig = require('./webpack.base.conf')(config);
	return merge(baseConfig, {
		plugins: [
			new webpack.DefinePlugin({
				'process.env': "'production'"
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				},
				sourceMap: config.build.productionSourceMap,
				parallel: true
			}),
			new OptimizeCSSPlugin({
				cssProcessorOptions: {
					safe: true
				}
			}),
			// keep module.id stable when vender modules does not change
			new webpack.HashedModuleIdsPlugin(),
		]
	});
};