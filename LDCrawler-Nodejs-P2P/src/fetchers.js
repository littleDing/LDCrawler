/*
 * fetcher a requested url to html
 */
var HTTP = require('http');
var HTTPS = require('https');
var URL = require('url');

function fetch(url,callback,header){
	try{
		var option = URL.parse(url);
		var pro = HTTP;
		if(option.protocol==='https:') pro = HTTPS;
		var html = "";
		var req = pro.request(option,function(res){
			res.on('data',function(buff){
				html += buff.toString();
			});
			res.on('end',function(){
				callback(html);
			});
		});
		req.setHeader('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4');
		for(i in header){
			req.setHeader(i,header[i]);
		}
		req.end();
	}catch(exception){
		console.log('fetch ' + url + ' failed with exception :');
		console.dir(exception);
	}
}

function test(){
	var url = 'http://mdskip.taobao.com/core/initItemDetail.htm?deliveryOption=0&ump=true&trialErrNum=0&isSpu=false&isIFC=false&sellerUserTag4=576496074252912003&notAllowOriginPrice=false&sellerUserTag2=18020086187035656&sellerUserTag3=144748506807042176&isForbidBuyItem=false&isAreaSell=false&isWrtTag=false&tmallBuySupport=true&isMeizTry=false&itemTags=4,1478,2049,2882,3974,4166,5954,6146,8578&sellerUserTag=307860000&household=false&tgTag=false&itemId=19367076692&isUseInventoryCenter=true&itemWeight=0&isSecKill=false&isApparel=true&service3C=false&cartEnable=true&callback=jsonp1351570552734_0&ip=&campaignId=&key=&abt=&cat_id=&q=&ref=http%253A%252F%252Flist.tmall.com%252Fsearch_product.htm%253Fspm%253D3.1000473.289848.6.2XxmeT%2526acm%253D456.1026.0.701.50025787_8%2526start_price%253D%2526end_price%253D%2526pic_detail%253D1%2526search_condition%253D24%2526cat%253D50025787%2526sort%253Ds%2526style%253Dg%2526vmarket%253D0%2526from%253Dsn_1_cat%2526active%253D1%2526q%253D';
	var header = {
//		Cookie:'cna=hanDCPgPUngCAXkhvrpiy039; miid=375478840316389018; tk_trace=oTRxOWSBNwn9dPyscxqAz9fIOLSAinJ6UKEciYj7slCzmydEPa5RpZI%2B6nRBVdWnOXi81z9R%2BgAxuIPxmDiqNH2QGghqAND%2Bt2sKymISbifY4cKhKN47r3WQExSdKAuPLXHs%2FHQOKFtkmuhQioNJ%2FSCkD3mJjN77zln%2FTREc9lztVrn%2F7sIr2OEL2kWsBpqZ4uvzRlsG4OXE4Re652aNXnLkHnVxNyY7o2bxjywCgtVpeQJP9pTY0U1ybyOIqg%3D%3D; _tb_token_=562GQJ3eQUQk; whl=-1%260%260%260; ck1=W89LUiXIsa8Ykg%3D%3D; tg=0; _cc_=URm48syIZQ%3D%3D; tracknick=babyboy3000; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; mpp=t%3D1%26m%3D%26h%3D1351047854029%26l%3D1351047765912; cookie2=93c51ebbecf9a9cefe537d43636a9af7; t=eace241c47d4f87f552f1e700df5a979; v=0; l=babyboy3000::1351572490358::11; uc1=cookie14=UoLZXeVqqbmNjA%3D%3D'
		//Referer:'http://detail.tmall.com/item.htm?id=19367076692&spm=a220m.1000858.1000725.1.doJ2jN'
	};
	url = 'http://book.douban.com/subject/6435569/reviews';
	fetch(url,console.log,header);
	//fetch('http://localhost/',console.log);
	//fetch('http://www.baidu.com/',console.log);
	console.log(1,2,3);
}

exports.fetch=fetch;
//test();
