<?php
$GETPAGE='bash /home/dingweijie/Desktop/deadlink/crawler/bin/getPage.sh';
//$urls = explode("\n",$_POST['urls']);
$urls = $_POST['urls'];
$description = array(
	 0 => array("pipe","r")
	,1 => array("pipe","w")
	,2 => array("file","/dev/null","a")
);
$proc = proc_open($GETPAGE,$description,$pipes);
if(is_resource($proc)){
	fwrite($pipes[0],$urls);
	fclose($pipes[0]);
	$output=stream_get_contents($pipes[1]);
	fclose($pipes[1]);
	proc_close($proc);
	echo $output;
}
?>
