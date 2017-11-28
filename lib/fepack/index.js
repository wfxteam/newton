const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Log = require('../log');
exports.run = function(config) {
	//拷贝.babelrc到项目目录
	let sourceCode = fs.readFileSync('./.babelrc',{encoding:'utf8'});
	sourceCode = sourceCode.replace(/_node_modules_path/g, path.resolve(__dirname, '../../node_modules'));
	fs.writeFileSync(
		path.resolve(config.appPath, '.babelrc'),
		sourceCode,
		{encoding:'utf8'}
	);
	//拷贝postcss配置文件到项目目录
	fs.copyFileSync(
		path.resolve(__dirname, '.postcssrc.js'),
		path.resolve(config.appPath, '.postcssrc.js')
	);
	//拷贝浏览器支持配置
	if(config.browserslist) {
		fs.writeFileSync(
			path.resolve(config.appPath, '.browserslistrc'),
			config.browserslist.join('\n'),
			{encoding:'utf8'}
		);
	}
	
	let env = config.online ? 'prod' : 'dev';
	let webpackConfig = require(`./webpack.${env}.conf`)(config);
	webpackConfig.watch = config.watch||false;
	webpack(webpackConfig, function (err, stats) {
		if (err){
			throw err;
			process.exit(1);
		}
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n');

		if (stats.hasErrors()) {
			Log.error('Build failed with errors.');
		}

		Log('Build complete.');

		fs.unlinkSync(path.resolve(config.appPath, '.babelrc'));
		fs.unlinkSync(path.resolve(config.appPath, '.postcssrc.js'));
		fs.unlinkSync(path.resolve(config.appPath, '.browserslistrc'));
	});
};