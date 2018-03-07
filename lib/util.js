const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
module.exports = {
	requireFile(filename, dir) {
		while(dir) {
			let file = path.resolve(dir, filename);

			if(fs.existsSync(file)){
				return [require(file), file];
			} else {
				let pdir = path.dirname(dir);
				if(pdir==dir){
					return false;
				} else {
					dir = pdir;
				}
			}
		}
	},
	md5(file) {
		let sum = crypto.createHash('md5');
		sum.update(fs.readFileSync(file))
		return sum.digest('hex');
	}
};