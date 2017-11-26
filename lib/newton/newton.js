const path = require('path');
const util = require('./util');
let Log = require('./log');
exports.run = function(){
	let program = require('commander');
	program
		.version(require('../package.json').version)
		.option('-c, --config [config]', '指定配置文件，默认项目目录下的newton.config.js')
		.option('-a, --app-dir [path]', '指定项目所在目录，默认是配置文件所在目录')
		.parse(process.argv);
	let pwd = process.env.PWD;
	let configFile = program.config||'newton.config.js';
	let appPath = program.appDir||pwd;
	try{
		let ret = util.requireFile(configFile, appPath);
		let config = ret[0];
		config.appDir = program.appDir;
		if(!config.appDir)
			config.appDir = path.dirname(ret[1]);
		
		if(!config.compileDir) {
			config.compileDir = path.resolve(require('os').userInfo().homedir, '.newton');
		}
		if(!config.app){
			Log.error('config没有指定app的名字');
		}
		
		let jobs = ['initEnv'];
		let p = Promise.resolve();
		for(let job of jobs){
			p = p.then(()=>{
				return require('./job/'+job).run(config);
			});
		}
		p.then(()=>{}).catch(function(e){
			console.log(e);
			process.exit(1);
		});
	}catch(e){
		console.log(e);
	}
};