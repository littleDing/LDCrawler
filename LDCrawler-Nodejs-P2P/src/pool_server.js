/*
 * a center pool accept and buffers crawler requests, offer to fetcher later
 */
var HTTP = require('http');
var URL = require('url');
var POOL = require('./pool');

var ip="172.18.218.28"
	,port=23456
	,base_url='http://'+ip+':'+port+'/'
	,ack_timeout=60*1000;

function setup_server(port,pool){	
	pool = pool || POOL.create();
	port = port || 12345;
	var handles = {
		'/push':'pool.push'
		,'/pull':'pool.pull'
		,'/ack':'pool.ack'
	}
	var server = HTTP.createServer(function(request,response){
		var path = URL.parse(request.url).pathname;
		if(path in handles){
			response.writeHead(200,{'Content-Type':'text/plain'});
			request.setEncoding('utf-8');
			var req_data = "";
			request.on('data',function(data){
				req_data += data;
			});
			request.on('end',function(){
				var value = null;
				var input = JSON.parse(req_data);
				if(path=='/push'){
					value = pool.push(input);
				}else if (path=='/pull'){
					value = pool.pull(input);
				}else if (path=='/ack'){
					value = pool.ack(input);
				}
				if (value != null){ 
					response.write(JSON.stringify(value));
				}
				response.end();		
			});
		}else{
			response.writeHead(404,{'Content-Type':'text/plain'});
			response.write('404 not found');
			response.end();
		}
		console.dir(path);
		console.dir(request.method);
	});
	server.listen(port);
	console.log('running pool server on port:'+ port);
	return server;
}

//setup_server();

function test(){
	//var urls = ['www.baidu.com'];
	//post_data('http://172.18.218.28:12345/',urls);
	setup_server();
	//console.log(handles['haha'] + ' ' + handles['/push'] + ' ' + ('haha' in handles));
}
//test();

exports.create=setup_server;

