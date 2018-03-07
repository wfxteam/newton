module.exports = {
	"tplExt":"tpl",
	"cssCompress": true,
	"jsCompress": true,
	"staticToCdn": true,
	"fepack": true,
	"cdnDomain": [
		"https://s.wandougongzhu.cn",
		"https://s1.wandougongzhu.cn",
		"https://s2.wandougongzhu.cn",
		"https://s3.wandougongzhu.cn",
		"https://s4.wandougongzhu.cn",
		"https://s5.wandougongzhu.cn"
	],
	//支持跨域的域名，比如字体、canvas处理图片等，都需要允许跨域
	corsDomain: "https://s5.wandougongzhu.cn",
	"cdnServer": [
		"123.56.166.77:/home/q/system/cdn",
		"182.92.71.103:/home/q/system/cdn",
		"101.200.120.169:/home/q/system/cdn",
		"123.56.224.210:/home/q/system/cdn",
		"123.57.164.238:/home/q/system/cdn",
		"112.126.81.87:/home/q/system/cdn"
	],
	"autoPrefix": true,
	"jsCompressExclude": ["dist/","coms/"],

	browserslist: [
		"chrome >= 50",
		"android >= 4.4",
		"ios >= 9.3",
		"ie >= 9",
		"safari >= 10.1"
	]
};