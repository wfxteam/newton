const path = require('path');
const util = require('../util');
let Log = require('../log');
exports.run = function(){
	let startTime = Date.now();
	let program = require('commander');
	program
		.version(require('../../package.json').version)
		.option('-c, --config [config]', '指定配置文件，默认项目目录下的newton.config.js')
		.option('-a, --app-dir [path]', '指定项目所在目录，默认是配置文件所在目录')
		.parse(process.argv);
	let pwd = process.env.PWD;
	let configFile = program.config||'newton.config.js';
	let appPath = program.appDir||pwd;
	try{
		let ret = util.requireFile(configFile, appPath);
		//todo，如果没有找到，报error
		let config = ret[0];
		config.appDir = program.appDir;
		if(!config.appDir)
			config.appDir = path.dirname(ret[1]);
		
		if(!config.compileDir) {
			config.compileDir = path.resolve(require('os').userInfo().homedir, '.newton');
		}

		if(!config.app){
			config.app = path.basename(config.appDir);
		}
		config = Object.assign(require('./default.config'), config);
		config.resRootBasename = path.basename(config.resDir);
	
		//全局变量，用户和系统默认置
		global.g_config = config;
		//全局变量，编译数据
		global.g_compileData = {
			tplHash: {},
			resHash: {},
			resCache: {}
		};
		
		let jobs = [
			'initEnv',
			'postcss',
			'cleancss',
			'webpack'
		];
		let p = Promise.resolve({});
		let lastJobEndTime;
		let lastJobName;
		for(let job of jobs) {
			p = p.then(()=>{
				if(!lastJobEndTime) {
					lastJobEndTime = new Date;
				} else {
					console.log(`Job ${lastJobName} 花费 ${new Date-lastJobEndTime} ms`);
					lastJobName = job;
					lastJobEndTime = new Date;
				}
				return require('./job/'+job).run();
			});
		}
		p.then(()=>{
			console.log(`Job ${lastJobName} 花费 ${new Date-lastJobEndTime} ms`);
			console.log('compile done: '+(Date.now()-startTime));
		}, res=>{
			console.log('job error', res);
		}).catch(error=>{
			console.log('catch error', error);
		})
		setImmediate(()=>{
			//编译结束
			console.log('compile all done');
		});
	}catch(e){
		console.log(e);
		process.exit(1);
	}
};