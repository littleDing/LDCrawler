/*
 * a center pool accept and buffers crawler requests, offer to fetcher later
 */
var URL = require('url');
var UNIQ = require('./uniq');
var QUEUE = require('./queue');

var default_arg={
	ack_timeout : 60*1000
};

function pool(args){
	var arg = {};
	for(k in default_arg) arg[k] = default_arg[k];
	for(k in args) arg[k] = args[k];
	this.args = arg;
	this.uniq =UNIQ.create();
	this.uniq_waiting =UNIQ.create();
	this.queue = QUEUE.create();
	this.waiting_timers = [];
}

//push the some crawl requests
pool.prototype.push=function(url_list){
	//console.dir(this);
	console.log('push : '+url_list);
	for(i in url_list){
		var url = url_list[i];
		if(this.uniq.push(url)){
			this.queue.push_back(url);
		}
	}
}

//pull some crawl requests, need to ack when crawl is finished, otherwise they will be back to pool again later(180s)
pool.prototype.pull=function(max_num,callback){
	console.log('pull : '+max_num);  
	urls = this.queue.pop(max_num);
	this.uniq_waiting.push(urls);
	if(urls.length!=0){
		var self = this;
		var timer = setTimeout(function(){
			for(i in urls){
				var url = urls[i];
				if(self.uniq_waiting.pop(url)){
					self.queue.push_front(url);	
				}
			}	
		},this.args.ack_timeout);
		this.waiting_timers.push(timer);
	}
	callback(urls);
}

//ack the pulled url have finished crawling
pool.prototype.ack=function(url_list){
	console.log('ack : '+url_list);  
	for(i in url_list){
		var url = url_list[i];
		if(this.uniq_waiting.pop(url)){
			this.uniq.pop(url);
		}
	}	
	if(this.uniq_waiting.length()==0){
		for(i in this.waiting_timers)
			clearTimeout(this.waiting_timers[i]);
		this.waiting_timer = [];
	}
	console.log('ack ends. waiting_size:'+this.uniq_waiting.length());
}

function test(){
	//var urls = ['www.baidu.com'];
	//post_data('http://172.18.218.28:12345/',urls);
	//setup_server();
	//console.log(handles['haha'] + ' ' + handles['/push'] + ' ' + ('haha' in handles));
}
//test();
exports.create=function(){
	return new pool();
}
