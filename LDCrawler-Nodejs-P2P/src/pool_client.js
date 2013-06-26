/*
 * the client of request pool, also the entrance of the crawler, could be accessed with a http post methord
 */
var HTTP = require('http');
var URL = require('url');

var ip="172.18.218.28"
	,port=23456
	,base_url='http://'+ip+':'+port+'/';

function post_data(url,data,callback){
	var option = URL.parse(url);
	option.method = 'POST';
	var req = HTTP.request(option,function(res){
		console.log(res.statusCode);
		if(callback!=null){
			res.on('data',function(chunk){
				callback(chunk.toString());
			});
		}			
	});
	var tosend = JSON.stringify(data);
	req.setHeader('Content-Length',tosend.length);
	req.end(tosend);
}

//push the some crawl requests
function push(url_list){
	post_data(base_url+'push',url_list);
}

//pull some crawl requests, need to ack when crawl is finished, otherwise they will be back to pool again later(180s)
function pull(max_num,callback){
	callback = callback || console.log;
	post_data(base_url+'pull',max_num,function(data){
		callback(JSON.parse(data));				
	});
}

//ack the pulled url have finished crawling
function ack(url_list){
	post_data(base_url+'ack',url_list);
}

function test(){
	var urls = ['www.baidu.com','www.baidu.com','www.qq.com'];
	//post_data('http://172.18.218.28/',urls,console.log);
	//push(urls);
	pull(10,console.log);
	setTimeout(function(){ack(urls)},200);
	//push(urls);
	//ack(urls);
	//setTimeout(test,2000);
	//post_data('http://172.18.218.28:23456/pull','',console.log);

}

//test();

//console.log(process.argv);
//console.log(require('./tools').filename);
if(require('./tools').filename==='pool_client.js'){
	require('./client').create({ack:ack,push:push,pull:pull},process.argv[2]);	
//	console.log("running");
}

exports.ack=ack;
exports.push=push;
exports.pull=pull;
