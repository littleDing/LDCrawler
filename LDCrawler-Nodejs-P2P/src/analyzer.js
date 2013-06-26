var util = require('util'),events=require('events');
var router = require('./router');
var fs = require('fs');
function analyzer(config,pool){
	this.init(config,pool);
}
util.inherits(analyzer,events.EventEmitter);
analyzer.prototype.init = function(config,pool){
	var _self=this;
	_self.pool = pool;
	console.log(config);
	_self.routers = {};
	
	for(rk in config){
		_self.routers[rk] = router.create();
		for(i in config[rk]){
			_self.routers[rk].add(config[rk][i].pattern);
		}
	}	
	_self.configurators = {
		saver:function(conf){
	 		var fp = fs.openSync(conf.path,'a');
			_self.on('saver::'+conf.pattern,function(url,html){
				console.log('saver::'+url);
				try{
					obj = conf.handler(url,html);
					data = JSON.stringify(obj) + '\n';
					fs.writeSync(fp,data,0,data.length);
				}catch(exception){ console.log('failed!'); console.dir(exception); }
			});			
		},url_generator:function(conf){
			_self.on('url_generator::'+conf.pattern,function(url,html){
				console.log('url_generator::' + url);			
				try{
					var urls = conf.handler(url,html);
					_self.pool.push(urls);
				}catch(exception){ console.log('failed!'); console.dir(exception); }
			});	
		},parser:function(conf){
			_self.on('parser::'+conf.pattern,function(url,html){
				console.log('parser::'+url);
				try{
					conf.handler(url,html);
				}catch(exception){ console.log('failed!'); console.dir(exception); }				
			});
		}			
	};
	for(rk in config){
		for(i in config[rk]){
			_self.configurators[rk](config[rk][i]);
		}
	}
}

analyzer.prototype.analyze=function(url,html){
	console.log('analyzing ' + url  +  '\n' + html);
	for(rk in this.routers){
		r = this.routers[rk];
		ps = r.find(url);
		for(i in ps){
			p = ps[i];
			this.emit(rk+'::'+p,url,html);
		} 
	}
}
exports.create=function(config,pool){
	var ret =  new analyzer(config,pool);
	return ret;
}
