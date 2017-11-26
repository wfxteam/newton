let fs = require('fs');
let path = require('path');
const { execSync } = require('child_process');

let Log = require('../log');
module.exports = {
	run: function(config) {
		return new Promise((resolve)=>{
			let compileDir = config.compileDir;
			if(!fs.existsSync(compileDir)) {
				Log(`创建编译根目录${compileDir}`);
				fs.mkdirSync(compileDir);
			}
			let appCompileDir = path.resolve(compileDir, config.app);
			if(!fs.existsSync(appCompileDir)){
				Log(`创建项目${config.app}的编译目录`);
				fs.mkdirSync(appCompileDir);
			}
			Log('清理1天前的编译文件');
			let files = fs.readdirSync(appCompileDir);
			let timeReg = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2}):(\d{3})/;
			let oneDay = 24*60*60*1000;
			for(let file of files) {
				if(timeReg.test(file)) {
					let d = new Date(RegExp.$1,RegExp.$2-1,RegExp.$3,RegExp.$4,RegExp.$5,RegExp.$6,RegExp.$7);
					if(d.getTime()+oneDay < Date.now()) {
						fs.rmdirSync(path.resolve(appCompileDir,file));
					}
				}
			}

			Log('创建本次编译目录');
			let now = new Date();
			let dir = now.getFullYear()
				+ '-' + String(now.getMonth()+1).padStart(2,'0')
				+ '-' + String(now.getDate()).padStart(2,'0')
				+ '_' + String(now.getHours()).padStart(2,'0')
				+ ':' + String(now.getMinutes()).padStart(2,'0')
				+ ':' + String(now.getSeconds()).padStart(2,'0')
				+ ':' + String(now.getMilliseconds()).padStart(3,'0');
			let destDir = path.resolve(appCompileDir, dir); 
			fs.mkdirSync( destDir );

			let srcTplDir = path.resolve(config.appDir, config.tplDir);
			if(!fs.existsSync(srcTplDir)){
				Log.error('模板目录不存在');
			}
			let srcResDir = path.resolve(config.appDir, config.resDir);
			if(!fs.existsSync(srcResDir)){
				Log.error('静态文件目录不存在');
			}
			execSync(`cp -r ${srcTplDir} ${destDir}`,{encoding:'utf8'});
			execSync(`cp -r ${srcResDir} ${destDir}`,{encoding:'utf8'});

			resolve();
		});
	}
};