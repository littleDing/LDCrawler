var mongo = require('mongodb');
function all_keys(dict){
	ret = []
	for(key in dict) ret.push(key);
	return ret;
}
function check_url(url){
	var reg = /^.+:\/\/.+\/.*/
	if(reg.test(url)){
		//throw url + " does not match reg " + reg;
		return false;
	}
	return true;
}
function check_urls(url_list){
	var ret = [];
	var reg = /^.+:\/\/.+\/.*/
	for(i in url_list){
		url = url_list[i];
		if(reg.test(url)){
			//throw url + " does not match reg " + reg;
			ret.push(url);
		}
	}
	return ret;
}

function get_collection(callback){
	var server = new mongo.Server('172.18.218.28',27017);
	var connect = new mongo.Db('crawler',server);
	connect.open(function(err,db){
		db.collection('links',function(err,collection){
			callback(collection);
		});
	});
}

var values_in_linkbase = ['time','keyword_id','media_source','media_id'];

function get_links(url_list,callback,check){
	check=check|true; 
	if(check) url_list = check_urls(url_list);
	get_collection(function(collection){
		collection.find({'url':{'$in':url_list}},function(err,cursor){
			ret = {};
			cursor.each(function(err,doc){
				if(doc!=null){
					ret[doc.url] = {}
					for(index in values_in_linkbase){
						value = values_in_linkbase[index];
						ret[doc.url][value] = doc[value];
					}
				}
				else {
					collection.db.close();
					callback(ret);
				}
			});
		});
	});
}

function put_links(url_dict){
	urls = all_keys(url_dict);
	urls = check_urls(urls);
	now = (new Date()).getTime()/1000;
	get_collection(function(collection){
		for(i in urls){
			url = urls[i];
			tmp = {}
	  		tmp.time = url_dict[url].time | now;
			if(url_dict[url].keyword) tmp.keyword = url_dict[url].keyword;
			collection.update({'url':url} , { '$set' : tmp }  , {upsert:true}  )	;
		}
		collection.db.close();
	});
}

function update_links(url_list){
	url_list = check_urls(url_list);
	now = (new Date()).getTime()/1000;
	get_collection(function(collection){
		for(i in url_list){
			url = url_list[i];
			collection.update({'url':url} , { '$set' : {time:now} }  , {upsert:true}  )	;
		}
		collection.db.close();
	});
}
function update_link(url){
	if(!check_url(url)) return ;
	now = (new Date()).getTime()/1000;
	get_collection(function(collection){
		for(i in url_list){
			url = url_list[i];
			collection.update({'url':url} , { '$set' : {time:now} }  , {upsert:true}  )	;
		}
		collection.db.close();
	});
}


function test(){
	var right_pages = {
	//	'http://www.baidu.com/': { 'time' : new Date().getTime()/1000  }
		'http://www.tom.com/' : {}
	}	,wrong_pages = {
		'http://www.baidu.com/': undefined
		,'http://www.baidu.com/': null
		,'www.baidu.com':'wrong!'
		,'http://www.baidu.com':'wrong!'
	};
	put_links(right_pages);
	get_links(all_keys(right_pages),console.dir);
//	put_links(wrong_pages,console.dir);
//	get_links(all_keys(wrong_pages),console.dir);	
}

//test()
//console.log('Hello world');
exports.put_links=put_links;
exports.get_links=get_links;
exports.update_links=update_links;
