const webpack = require('webpack');
exports.run = function(){}
exports.build = function(config) {
	return new Promise(resolve=>{
		const webpackConfig = require('./webpack.production').getConfig(config);
		webpack(webpackConfig, (err, stats)=>{
			if(err)
				console.log(err);
			if(stats.hasErrors()){
				console.log(stats.toString());
				console.log('webpack error:');
				//console.log(stats.toJson().errors);
				process.exit(1);
			}
			console.log('webpack done');
			resolve();
		});
	});
}