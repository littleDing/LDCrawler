function queue(){
	this.data = []
}

queue.prototype.push_back_one = function(item){
	this.data.push(item);
}

queue.prototype.push_back = function(item){
	if(item instanceof Array){
		for(i in item){
			this.push_back_one(item[i]);
		}
	}else{
		this.push_back_one(item);
	}
}

queue.prototype.push_front_one = function(item){
	this.data.unshift(item);
}

queue.prototype.push_front = function(item){
	if(item instanceof Array){
		for(i in item){
			this.push_front_one(item[i]);
		}
	}else{
		this.push_front_one(item);
	}
}



queue.prototype.pop = function (max_num){
	var ans = [];
	while(this.data.length!=0&&max_num!=0){
		ans.push(this.data.shift());
		max_num--;
	}
	return ans;
}


function test(){
	var u = new queue;
	console.log( u.push('1'));	
	console.log( u.push('1'));		
	console.log( u.push('2'));		
	console.log( u.pop(2));
	console.log( u.push([9,9,'2',3,4]));
	console.log( u.pop(2));
	console.log( u.pop(100));
}
//test();
exports.create=function(){
	return new queue;
}
