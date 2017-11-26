function log(txt, type){
	console.log(`${type}: ${txt}`);
	if(type=='error')
		process.exit(1);
}
function Log(txt, type) {
	type = ['info','warning', 'error'].includes(type)?type: 'info';
	log(txt, type);
}
Log.info = function(txt) {
	log(txt, 'info');
};
Log.warning = function(txt) {
	log(txt, 'warning');
};
Log.error = function(txt) {
	log(txt, 'error');
};
module.exports = Log;