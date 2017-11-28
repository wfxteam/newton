const path = require('path');
const util = require('../util');
const Log = require('../log');

let program = require('commander');
program
	.version(require('../../package.json').version)
	.option('-o, --online', '编译模式指定为线上产品模式。此模式下，js和css都不会输出sourcemap，并且会进行代码压缩，以求文件size最小')
	.option('-a, --app-path [path]', '指定项目所在目录，默认是配置文件所在目录')
	.option('-c, --config [config]', '指定配置文件，默认项目目录下的newton.config.js')
	.option('-w, --watch', '启动监控模式。此模式下，会监控所有entry及引用文件的变更，有变化会马上自动编译一次')
	.parse(process.argv);
let pwd = process.env.PWD;
let configFile = program.config||'newton.config.js';
let appPath = program.appPath||pwd;
let ret = util.requireFile(configFile, appPath);
if(!ret) {
	Log.error('找不到配置文件');
}
let config = ret[0];
config.appPath = program.appPath || path.dirname(ret[1]);
config.appPath = path.resolve(config.appPath);
config.online = program.online||false;
config.watch = program.watch||false;

if(!config.app) {
	config.app = path.basename(config.appPath);
}

require('./index').run(config);