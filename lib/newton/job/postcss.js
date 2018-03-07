const fs = require('fs');
const path = require('path');
const postcss  = require('postcss');
const autoprefixer = require('autoprefixer');
const resCache = require('../resCache');

const REG_FONT = new RegExp(
	'@font-face'
		+ '\\s*'
		+ '\\{'
			+ '([^}]+)'
		+ '\\}', 
	'gi'
);
const REG_FONT_URL = new RegExp(
	'url'
		+ '\\s*'
		+ '\\('
			+ '([^\\)]+)'
		+ '\\)',
	'gi');

function replaceFont(css, file){
	css = css.replace(REG_FONT, function(_$, _$1){
		let changed = false;
		_$1 = _$1.replace(REG_FONT_URL, function(_m, _$m1){
			_$m1 = _$m1.trim();
			_$m1 = _$m1.replace(/^['"]\s*|\s*['"]$/g,'');

			let ret = resCache.add({
				url: _$m1,
				relativeFile: file
			});

			if(!ret) return _m;
			changed = true;
			return 'url("'+ret+'")'; 
		});
		if(changed){
			return '@font-face{'+_$1+'}';
		}else{
			return _$;
		}
	});
	return css;
}


const REG_CSS_IMG = 
	/(background(?:-image)?\s*:\s*[^;\}]*?\burl\(\s*["']?)(.+?)(["']?\s*\))/gi;
function replaceImg(css, file) {
	css = css.replace(REG_CSS_IMG, function(_$, _$1, _$2, _$3){
		let ret = resCache.add({url: _$2, relativeFile:file})
		if(ret){
			return _$1+ret+_$2;
		}else{
			return _$;
		}
	});
	return css;
}
module.exports = {
	run() {
		return new Promise((resolve) => {
			let ps = [];
			let browsers = g_config.browserslist;
			let prefixer = postcss([autoprefixer({browsers})])
			for(let file in g_compileData.resHashList) {
				if(file.endsWith('.css')) {
					let p = new Promise(resolveFun=>{
						let cssFile = path.resolve(g_config.workDir, g_config.resDir, file);
						fs.readFile( cssFile, 'utf8', (err, css)=>{
							if(err) throw err;
							//首先处理原始文件中的字体、图片文件，以缓存
							//replaceFont(css, cssFile);
							replaceImg(css, cssFile);
							prefixer.process(css, {from: cssFile, map: false}).then(res=>{
								res.file = cssFile;
								fs.writeFile(cssFile, res.css, 'utf8', err=>{
									if(err) throw err;
									resolveFun();
								});
							}).catch(err=>{console.log(err)});
						});
					});
					ps.push(p);
				}
			}
			Promise.all(ps).then(()=>{
				resolve();
			},err=>{
				console.log(err)
			}).catch(err=>{
				console.log(err)
			})
		});
	}
};