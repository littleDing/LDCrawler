#!/bin/bash
include=`dirname $0`
source "${include}/../conf/crawl.conf"
function removeHttpHead(){
    sed "s/http:\/\///g" \
    | sed "s/https:\/\///g"
}
## Input:  $1=>dir name
## Output: stdout(file path)
function scanFiles(){
local current=$1;
	for file in `ls ${current}` ; do
		local path=${current}/${file}
		if [ -f ${path} ]; then 
			echo ${path};
		elif [ -d ${path} ]; then 
			scanFiles ${path}
		fi
	done	
}
## Input:  $1 => site name
## Output: stdout(links_in_pagebase)
function scanLinksWithShell(){
local site=`echo $1 | removeHttpHead`;
	if [ -d "${PAGEBASE}/${site}" ]; then
		local current=`pwd`;
		local dir="${PAGEBASE}/${site}"
		cd ${dir}
		scanFiles . | sed "s/^./${site}/g"
		cd ${current}
	fi
}

## Input:  $1 => site name
## Output: stdout(links_in_pagebase)
function scanLinks(){
local site=`echo $1 | removeHttpHead`;
local site=`echo $1 | removeHttpHead`;
     if [ -d "${PAGEBASE}/${site}" ]; then
         local current=`pwd`;
         local dir="${PAGEBASE}/${site}"
         cd ${dir}
         ${BIN}/scan_links ${site}
         cd ${current}
     fi
}

for site in `ls ${PAGEBASE}` ; do
	echo "processing $site...plz wait"
	scanLinks ${site} > ${LINKBASE}/${site}
done

