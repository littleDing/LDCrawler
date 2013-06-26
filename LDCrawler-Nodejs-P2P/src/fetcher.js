var util = require('util'),events=require('events'),router=require('./router');
var fetchers = require('./fetchers');
function fetcher(config){
	console.log(config);
	this.router = router.create();
	for(i in config){
		c = config[i];
		p = c.pattern;
		h = c.handler;
		this.router.add(p);
		this.on(p,h);
	}
	this.on('__default_fetcher',fetchers.fetch);
}
util.inherits(fetcher,events.EventEmitter);
fetcher.prototype.run=function(pool){
	console.log('run with pool : '+pool + this.pool);
	_self = this;
	_self.pool = pool;
	setTimeout(function(){_self.do_run()},10);	
}
fetcher.prototype.do_run=function(){ 
	_self = this;
	_self.pool.pull(10,function(urls){
		for(i in urls){
			url = urls[i];
			patterns = _self.router.find(url);
			patterns.push('__default_fetcher');			 
			console.log('fetching url : ' + urls + ' of pattern : /'+patterns[0]+'/');
			_self.emit(patterns[0],url,function(html){
				_self.emit('data',url,html);
				_self.pool.ack([url]);
				setTimeout(function(){_self.do_run();},0);
			});
		}
	});
}
exports.create=function(config){return new fetcher(config);}
