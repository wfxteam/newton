const path = require('path');

function getCdnDomain(index) {
	if(Array.isArray(g_config.cdnDomain)) {
		index = index%g_config.cdnDomain.length;
		return g_config.cdnDomain[index];
	} else {
		return g_config.cdnDomain;
	}
}
module.exports = {
	add({url, relativeFile}) {
		url = url.trim();
		//data uri和直线网络地址形式的直接跳过
		if(url.startsWith('data:')
			|| url.startsWith('https://')
			|| url.startsWith('http://')
			|| url.startsWith('//')){
			return false;
		}
		//绝对路径，但不是静态目录下
		if(url.startsWith('/') && !url.startsWith('/'+g_config.resRootBasename)) {
			return false;
		}
		
		//计算文件的hash key
		let file = url;
		if(url.startsWith('/')){
			file = url.replace('/'+g_config.resRootBasename+'/', '');
		} else {
			file = path.resolve(path.dirname(relativeFile), url);
			file = path.relative(g_config.resWorkDir, file);
		}
		let search = '', hash = '';
		if(file.includes('#')) {
			let pos = file.indexOf('#');
			hash = file.substring(pos);
			file = file.substring(0, pos);
		}
		if(file.includes('?')) {
			let pos = file.indexOf('?');
			search = file.substring(pos);
			file = file.substring(0, pos);
		}
		//处理 a/b//c.font 这种连续两个斜杠问题
		file = file.replace(/\/\/+/g, '/');

		let print = g_compileData.resHashList[file];
		if(!print){
			console.log('文件不存在却被使用：'+file);
			return false;
		}
		
		let fileHash = print.substr(-6);
		let retUrl = '';
		if(g_config.staticToCdn) {
			retUrl = getCdnDomain(parseInt(print[0], 16))
				+ '/'
				+ g_config.app
				+ '/'
				+ file.replace(/(\.[^\.]*)?$/,(_,_$1)=>{return '_'+fileHash+(_$1||'');});
			if(search)
				retUrl += search;
		} else {
			retUrl = '/'
				+ g_config.resRootBasename
				+ '/'
				+ file;
			if(search)
				search += '&_v='+fileHash
			else
				search = '?_v='+fileHash;
			retUrl += search;
		}
		if(hash)
			retUrl += hash;
		return retUrl;
	}
};