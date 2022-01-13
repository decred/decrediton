#!/bin/sh

# submit a package to be notarized
# returns: notarization uuid
notary_submit() {
	xcrun altool -f release/decrediton-${VERSION}.zip \
		--notarize-app \
		--primary-bundle-id org.Electron.Decrediton \
		--asc-provider ${IDENTITY} \
		-p @keychain:${KEYCHAIN} 2>&1 \
	| perl -ne 'print if s/^RequestUUID = //'
}

# check notarization status after successful submission
# arg 1: uuid
# returns: altool output
notary_status() {
	local _uuid=$1
	xcrun altool --notarization-info ${_uuid} -p @keychain:${KEYCHAIN} 2>&1
}

[ $(uname) = Darwin ] || {
	echo "$0 must be run from darwin" 2>&1
	exit 1
}
[ $# = 3 ] || {
	echo "usage: $0 version identity arch" 2>&1
	exit 2
}

VERSION=$1
IDENTITY=$2
ARCH=$3
KEYCHAIN=${KEYCHAIN:-signer}
NODE_MODULES=node_modules
YARNCACHE=.yarncache

set -ex
[ -d ${NODE_MODULES} ] && rm -rf ${NODE_MODULES}
[ -d ${YARNCACHE} ] && rm -rf ${YARNCACHE}
mkdir -p ${YARNCACHE}

# prepare directory with package files
yarn install --cache-folder ${YARNCACHE}
yarn rebuild-natives
yarn package-mac-${ARCH}

# submit notarization
_uuid=$(notary_submit)

# poll notarization status until no longer in-progress
set +ex
while :; do
	sleep 60
	_date=$(date)
	_output=$(notary_status ${_uuid})
	_status=$(echo "${_output}" | perl -ne 'print if s/^\s*Status: //')
	echo "check at ${_date}: Status: ${_status}"
	case ${_status} in
	"in progress")
		continue
		;;
	"success")
		# move on to stapling
		break
		;;
	"")
		echo "warn: unknown status -- full output:\n${_output}" 2>&1
		continue
		;;
	*)
		echo "${_output}" 2>&1
		exit 1
		;;
	esac
done
set -ex
