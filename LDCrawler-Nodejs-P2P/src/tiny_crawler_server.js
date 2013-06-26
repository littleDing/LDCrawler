var fs = require('fs');
var loadConfig = require('./router').loadConfig;
var fetchers = require('./fetchers');
function main(){
	var pool = require('./pool').create()
		,fetcher = require('./fetcher_server').create(loadConfig('./config.fetcher.json'))
		,analyzer = require('./analyzer').create(loadConfig('./config.analyzer.json'),pool);
	fetcher.on('data',function(url,html){analyzer.analyze(url,html);});
	seeds = []
	process.argv.forEach(function(val,index){
		if(index<=1) return ;
		console.log('seeding : ' + val);					
		data = fs.readFileSync(val).toString().split(/\s+/);
		console.log(data);
		for(i in data){
			if(data[i].length>0){
				seeds.push(data[i]);
			}
		}
	});
	pool.push(seeds);
	fetcher.run(pool);
	var pool_server = require('./pool_server').create(18080,pool);
}
main();
