include=`dirname $0`
CONF=${include}/../conf/
source ${CONF}/crawl.conf

## Input:  stdin(domains)
## Output: 
## save mirrors in data/pagebase/domain/
function mirror(){
	while read seed 
	do
		output=${PAGEBASE}/
		rm -rf "${output}"
		mkdir -p "${output}"
		wget -m -P "${output}" -A ${ACCEPT_FILES} ${seed} 2>${LOG}/stderr.${seed} 1>${LOG}/stdout.${seed} &
	done	
}

cat ${SEED} | mirror

