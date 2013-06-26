<?php
	function fix_url(&$url){
		$pos=stripos($url,"http");
		if($pos === false || $pos!=0 ){
			$url='http://'.$url;
		}
		$pos=strrchr($url,"/");
		if($pos <=6) $url.="/";
	}
	function sogou_rank($url){
		fix_url($url);
		$url=urlencode($url);
		$request="/sogourank.php?ur=".$url;
		$socket=fsockopen("rank.ie.sogou.com",80,$erron,$errstr,30);
		$rank=0;
		if($socket){
			$out ="GET ".$request." HTTP/1.1\r\n";
			$out.="Host: rank.ie.sogou.com\r\n";
			$out .= "User-Agent: Mozilla/4.0 (compatible; GoogleToolbar 2.0.114-big; Windows XP 5.1)\r\n";
      		$out .= "Connection: Close\r\n\r\n";
			fwrite($socket,$out);
			$header = "";
     		while ($str = trim(fgets($socket, 4096))) {
     		   $header .= $str;
     		}
     		$data = "";
     		while (!feof($socket)) {
    		     $data .= fgets($socket, 4096);
	     	}
			sscanf($data,"sogourank=%d",$rank);
		}		
		return $rank;
	}	

$STDIN = fopen("php://stdin","r");
$STDOUT = fopen("php://stdout","w+");
$first=true;
while(!feof($STDIN)){	
	if (!$first) fputs($STDOUT,$url." ".$rank."\n");
	fscanf($STDIN,"%s",$url);
	$rank = sogou_rank($url);	
	$first = false;
}
fclose($STDIN);
fclose($STDOUT);
?>
