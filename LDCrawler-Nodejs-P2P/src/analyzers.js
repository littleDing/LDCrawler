/*
 * extract infomations and urls need to crawl from html
 */

var $=require('jquery');
var URL = require('url');

function extract_all(url,html){
	dom = $(html);
	urls = [];
	dom.find('[href]').each(function(){
		urls.push($(this).attr('href'));
	});
	return urls;
}

function extract_same_domain(url,html){
	get_domain = function(url){
		var opt = URL.parse(url);
		return opt.hostname;
	};
	domain = get_domain(url);
	dom = $(html);
	urls = [];
	dom.find('[href]').each(function(){
		href = $(this).attr('href');
		if(get_domain(href)==domain)
			urls.push(href);
	});
	return urls;
}

function save_to_db(url,html){
console.log('saving to db :' + url);
	var pagebase = require('./pagebase_client'),linkbase = require('./linkbase_client');
	linkbase.update_links([url]);
	dict = {};
	dict[url] = html;
	pagebase.put_pages(dict);
}

function saver(url,html){
		
	
	
}


function test(){
	var fetcher = require('./fetchers')
	var url = 'http://www.douban.com/group/yuelvxing/';
	var html = fetcher.fetch(url,function(html){
		console.log(html);
		console.log(extract_same_domain(url,html));	
		console.log(extract_all(url,html));			
	});
}

//test();
exports.extract_same_domain = extract_same_domain;
exports.extract_all = extract_all;
exports.save_to_db = save_to_db;

