function client(opt_map,opt,help_string){
	if(opt in opt_map){
		process.stdin.resume();
		var all = "";
		process.stdin.on('data',function(chunk){
			all +=chunk.toString();
		});
		process.stdin.on('end', function () {
			opt_map[opt](JSON.parse(all));
		});
	}else {
		var outs = "";
		for(o in opt_map) outs+=opt;
		console.log('opt "'+opt+'" not supported! only supporting: ' + outs);
		console.log(help_string);
	}
}

function test(){
	client({haha:console.log,hehe:console.log},process.argv[2]);
}

//test();

exports.create=client

