const path = require('path');
const fs = require('fs');
const CleanCss = require('clean-css');
module.exports = {
	run() {
		return new Promise(resolve=>{
			let ps = [];
			for(let file in g_compileData.resHashList) {
				if(file.endsWith('.css')) {
					let abPath = path.resolve(g_config.resWorkDir, file);
					let p = new Promise(resolveFun=>{
						new CleanCss()
							.minify([abPath], (err, output)=>{
								if(err || output.errors.length>0){
									throw err||output.erros;
								} else {
									fs.writeFile(abPath, output.styles, 'utf8', (err)=>{
										if(err) throw err;
										resolveFun();
									});
								}
							});
					});
					ps.push(p);
				}
			}
			Promise.all(ps).then(()=>{
				resolve();
			}, err=>{
				throw err;
			}).catch(err=>{
				throw err;
			});
		});
	}
};