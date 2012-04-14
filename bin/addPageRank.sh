#!/bin/bash
include=`dirname $0`
source "${include}/../conf/crawl.conf"

## Input:  	$1 => site name
## 			$2 => number of links per submit,default is 16
##			$3 => seconds between submits,default is 1
## Output: 	new linkbase file(link pagerank)
function addPageRank(){
local site=$1; if [ "x$1" = "x"  ]; then return; fi; 
local n=$2; if [ "x$2" = "x"  ]; then n=20; fi; 
local second=$3; if [ "x$3" = "x" ]; then second=1; fi
local tmp=${TMP}/addPageRank.${site}; rm -rf ${tmp}; mkdir -p ${tmp}
	if [ -d "${PAGEBASE}/${site}" ]; then
	local current=`pwd`
	cd ${tmp}
		links=${LINKBASE}/${site}
		split_size=$n
		split -a 10 -l ${split_size} ${links}
		output=${tmp}/${site}.pagerank
		rm ${output} 2>/dev/null
		for file in `ls` ; 
		do	
			cat ${tmp}/${file} | ${PAGE_RANK}  >>${output} 
			sleep ${second}s	
		done
		cp ${output} ${LINKBASE}
	cd ${current};
	fi
}

for site in `ls ${PAGEBASE}` ; do
	echo "processing $site...plz wait"
	addPageRank ${site}
done

