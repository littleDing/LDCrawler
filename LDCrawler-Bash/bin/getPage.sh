#!/bin/bash
include=`dirname $0`
source ${include}/../conf/crawl.conf

function removeHttpHead(){
	sed "s/http:\/\///g" \
	| sed "s/https:\/\///g"
}

function getPage(){
	removeHttpHead | {
		while read line
		do
			furl=${PAGEBASE}/${line}
			if [ -f ${furl} ] ; then 
				cat ${furl}
			else
				for index in ${ACCEPT_INDEX_FILES} ; do
					indexUrl=${furl}/index.${index}
					if [ -f ${indexUrl} ]; then 
						cat ${indexUrl}
						break
					fi
				done
			fi
		done
	}
}

getPage
