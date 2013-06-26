var mongo = require('mongodb');
function all_keys(dict){
	ret = []
	for(key in dict) ret.push(key);
	return ret;
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
		db.collection('pages',function(err,collection){
			callback(collection);
		});
	});
}

function get_pages(url_list,callback,check){
	check=check|true; 
	if(check) url_list = check_urls(url_list);
	get_collection(function(collection){
		collection.find({'url':{$in:url_list}},function(err,cursor){
			ret = {};
			cursor.each(function(err,doc){
				if(doc!=null)
					ret[doc.url] = doc.html;
				else {
					collection.db.close();
					callback(ret);
				}
			});
		});
	});
}

function put_pages(url_html_dict){
	//console.dir(url_html_dict);
	urls = all_keys(url_html_dict);
	urls = check_urls(urls);
	get_collection(function(collection){
		for(i in urls){
			url = urls[i];
			html=url_html_dict[url];
			collection.update({'url':url} , { '$set' : { 'html':html }   }  , {upsert:true}  );	
		}
		collection.db.close();
	});
}
function test(){
	var right_pages = {
		'http://www.baidu.com/':'right!'
	}	,wrong_pages = {
		'www.baidu.com':'wrong!'
		,'http://www.baidu.com':'wrong!'
	};
	put_pages(right_pages,console.dir);
	get_pages(all_keys(right_pages));
	//put_pages(wrong_pages,console.dir);
	//get_pages(all_keys(wrong_pages),console.dir);	
}

//test()
//console.log('Hello world');
exports.put_pages=put_pages;
exports.get_pages=get_pages;
