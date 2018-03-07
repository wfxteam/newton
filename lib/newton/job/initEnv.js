const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, exec } = require('child_process');
const {md5} = require('../../util');

let Log = require('../../log');
function getTimeDesc(date) {
	return String(date.getFullYear())
		+ String(date.getMonth()+1).padStart(2,'0')
		+ String(date.getDate()).padStart(2,'0')
		+ String(date.getHours()).padStart(2,'0')
		+ String(date.getMinutes()).padStart(2,'0')
		+ String(date.getSeconds()).padStart(2,'0');
}
module.exports = {
	run: function() {
		return new Promise((resolve, reject)=>{
			let compileDir = g_config.compileDir;
			if(!fs.existsSync(compileDir)) {
				Log(`创建编译根目录${compileDir}`);
				fs.mkdirSync(compileDir);
			}
			let appCompileDir = path.resolve(compileDir, g_config.app);
			if(!fs.existsSync(appCompileDir)){
				Log(`创建项目${g_config.app}的编译目录`);
				fs.mkdirSync(appCompileDir);
			}
			Log('清理1天前的编译文件');
			let files = fs.readdirSync(appCompileDir);
			let oneDay = 24*60*60*1000;
			let yestoday = new Date(Date.now()-oneDay);
			yestoday = getTimeDesc(yestoday);
			for(let file of files) {
				if(file < yestoday) {
					fs.rmdir(path.resolve(appCompileDir,file), ()=>{});
				}
			}

			Log('创建本次编译目录');
			let now = new Date();
			let dir = getTimeDesc(now);
			let workDir = path.resolve(appCompileDir, dir);
			//如果同一时间有其它人也在编译，增加随机字符串，以区别
			if(fs.existsSync(workDir)) {
				workDir += String(Math.random()).substring(2);
			}
			fs.mkdirSync( workDir );

			let srcTplDir = path.resolve(g_config.appDir, g_config.tplDir);
			if(!fs.existsSync(srcTplDir)){
				Log.error('模板目录不存在');
			}
			let srcResDir = path.resolve(g_config.appDir, g_config.resDir);
			if(!fs.existsSync(srcResDir)){
				Log.error('静态文件目录不存在');
			}
			execSync(`mkdir -p ${g_config.tplDir};cp -r ${srcTplDir}/* ${g_config.tplDir}`,{cwd: workDir, encoding:'utf8'});
			execSync(`mkdir -p ${g_config.resDir};cp -r ${srcResDir}/* ${g_config.resDir}`,{cwd: workDir, encoding:'utf8'});

			let node_modules = path.resolve(__dirname, '../../../node_modules');
			execSync(`ln -s ${node_modules} ./`,{cwd: workDir, encoding:'utf8'});
			execSync(`cp ${__dirname}/../../../.babelrc ./`,{cwd: workDir, encoding:'utf8'});

			execSync(`cp ${__dirname}/../../../.browserslistrc ./`,{cwd: workDir, encoding:'utf8'});

			execSync(`cp ${__dirname}/../../../.postcssrc.js ./`,{cwd: workDir, encoding:'utf8'});			exec('find . -type f',{cwd: workDir, encoding: 'utf8'}, (err, stdout, stderr)=>{
				if(err) throw err;
				let files = stdout.split('\n').filter(file=>!!file.trim());
				let tplList = {}, resList = {};
				console.log(files.length)
				for(let file of files){
					let hash = md5(path.resolve(workDir, file));
					let key = file.replace('./','');
					if(key.startsWith(g_config.tplDir)){
						key = path.relative(g_config.tplDir, key);
						tplList[key] = hash;
					} else if(key.startsWith(g_config.resDir)){
						key = path.relative(g_config.resDir, key);
						resList[key] = hash;
					}
				}
				g_config.workDir = workDir;
				g_config.tplWorkDir = path.resolve(workDir, g_config.tplDir);
				g_config.resWorkDir = path.resolve(workDir, g_config.resDir);
				g_compileData.tplHashList = tplList;
				g_compileData.resHashList = resList;
				resolve();
			});
		});
	}
};