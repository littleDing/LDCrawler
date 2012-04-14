#!/bin/bash
include=`dirname $0`
source "${include}/../conf/crawl.conf"

for site in `ls ${PAGEBASE}` ; do
	if [ -d ${PAGEBASE}/${site} ]; then 
		echo ${site}
	fi
done

