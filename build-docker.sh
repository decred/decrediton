#!/bin/bash
set -ex

# To run on docker on windows, symlink /mnt/c to /c and then execute the script
# from the repo path under /c.  See:
# https://github.com/Microsoft/BashOnWindows/issues/1854
# for more details.

BUILD_OS=${1:-linux}
BUILD_ARCH=${2:-amd64}

DCRD_RELEASE=v1.1.2

DOCKER_IMAGE_TAG=decrediton-builder

DIST_DIR=$(pwd)/dist

DCRD_RELEASE_FILE=decred-$BUILD_OS-$BUILD_ARCH-$DCRD_RELEASE.tar.gz
DCRD_RELEASE_URL=https://github.com/decred/decred-binaries/releases/download/${DCRD_RELEASE}/${DCRD_RELEASE_FILE}

YARN_INSTALL_URL=https://yarnpkg.com/install.sh
YARN_VERSION=1.3.2

# this will be passed on to `npm package-*`
BUILD_TARGET=$BUILD_OS
if [ "$BUILD_OS" == "darwin" ]; then
  BUILD_TARGET=mac
fi

echo "------------------------------------------"
echo " Building for $BUILD_OS:$BUILD_ARCH "
echo "------------------------------------------"
echo

# initialize directory for build artifacts
if [ -d $DIST_DIR ]; then
  rm -rf $DIST_DIR
fi
mkdir $DIST_DIR && chmod 777 $DIST_DIR

docker pull decred/$DOCKER_IMAGE_TAG

docker run --rm -it -v $DIST_DIR:/release -v $(pwd):/src decred/$DOCKER_IMAGE_TAG /bin/bash -c "\
  . \$HOME/.nvm/nvm.sh && \
  curl -o- -L $YARN_INSTALL_URL | bash -s -- --version $YARN_VERSION && \
  export PATH=\$HOME/.yarn/bin:\$PATH && \
  mkdir decrediton && \
  rsync -ra --filter=':- .gitignore'  /src/ decrediton/ && \
  cd decrediton && \
  yarn && \
  yarn lint && \
  yarn test && \
  mkdir -p bin && \
  curl -L ${DCRD_RELEASE_URL} | tar zxvf - --strip-components=1 -C ./bin/ && \
  yarn package-$BUILD_TARGET && \
  rsync -r ./release/ /release/"

echo "------------------------------------------"
echo "Build complete, artifacts in $DIST_DIR"
