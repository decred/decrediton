#!/bin/sh

[ $(uname) = Linux ] || {
	echo "$0 must be run from linux" 2>&1
	exit 1
}

NODE_MODULES=node_modules
YARNCACHE=.yarncache

set -ex
[ -d ${NODE_MODULES} ] && rm -rf ${NODE_MODULES}
[ -d ${YARNCACHE} ] && rm -rf ${YARNCACHE}
mkdir -p ${YARNCACHE}

# prepare directory with package files
yarn install --cache-folder ${YARNCACHE}
yarn rebuild-natives
yarn package-linux

