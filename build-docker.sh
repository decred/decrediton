#!/bin/bash

set -e

BUILD_TAG=${1:-master}
BUILD_OS=${2:-linux}
BUILD_ARCH=${3:-amd64}
BUILD_REPO=${4:-decred}

if [ "${TRAVIS}" = "true" ]; then
    if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
	BUILD_TAG=$TRAVIS_PULL_REQUEST_SHA
    else
	BUILD_TAG=$TRAVIS_TAG
    fi
fi

DCRD_RELEASE=v1.0.1

DOCKER_IMAGE_TAG=decrediton-builder

DIST_DIR=$(pwd)/dist

DCRD_RELEASE_FILE=decred-$BUILD_OS-$BUILD_ARCH-$DCRD_RELEASE.tar.gz
DCRD_RELEASE_URL=https://github.com/decred/decred-binaries/releases/download/${DCRD_RELEASE}/${DCRD_RELEASE_FILE}

GRPC_COMMIT=cc2e048e84eaa418cab393553594a3fefb891037

# this will be passed on to `npm package-*`
BUILD_TARGET=$BUILD_OS
if [ "$BUILD_OS" == "darwin" ]; then
  BUILD_TARGET=mac
fi

echo "------------------------------------------"
echo " Building $BUILD_TAG for $BUILD_OS:$BUILD_ARCH from $BUILD_REPO on github"
echo "------------------------------------------"
echo

# initialize directory for build artifacts
if [ -d $DIST_DIR ]; then
  rm -rf $DIST_DIR
fi
mkdir $DIST_DIR && chmod 777 $DIST_DIR

# to build the docker image yourself run this:
docker build -t $DOCKER_IMAGE_TAG .

docker run --rm -it -v $DIST_DIR:/release $DOCKER_IMAGE_TAG /bin/bash -c "\
  . \$HOME/.nvm/nvm.sh && \
  git clone https://github.com/$BUILD_REPO/decrediton && \
  cd decrediton && \
  git checkout -b $BUILD_TAG && \
  cd ..
  git clone https://github.com/grpc/grpc && \
  cd grpc && \
  git checkout $GRPC_COMMIT && \
  git submodule update --init && \
  cd ../decrediton && \
  npm install && \
  npm run lint && \
  mkdir bin && \
  curl -L ${DCRD_RELEASE_URL} | tar zxvf - --strip-components=1 -C ./bin/ && \
  npm run package-$BUILD_TARGET && \
  rsync -ra ./release/ /release/"


echo "------------------------------------------"
echo "Build complete, artifacts in $DIST_DIR"
