#!/bin/sh

[ $# = 2 ] || {
	echo "usage: $0 version link pass" 2>&1
	exit 2
}

LINK=$1
PASS=$2
NODE_MODULES=node_modules
YARNCACHE=.yarncache

set -ex
[ -d ${NODE_MODULES} ] && rm -rf ${NODE_MODULES}
[ -d ${YARNCACHE} ] && rm -rf ${YARNCACHE}
mkdir -p ${YARNCACHE}

# prepare directory with package files
yarn install --cache-folder ${YARNCACHE}
yarn rebuild-natives
set WIN_CSC_LINK=${LINK} && set WIN_CSC_KEY_PASSWORD=${PASS} && yarn package-win
