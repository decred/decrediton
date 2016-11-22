# decrediton

decrediton is a cross-platform GUI for decred written in node.js using
Electron.

## Developing

Due to potential compatibility issues, for now, all work should be
done with node v6.5.0 and electron 1.4.6.  It is likely we can relax
this once things have settled down.  The recommended way to install
node is using nvm.

This has primarily been tested on Linux at the moment although OSX
should work similarly.

``` bash
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
. ~/.nvm/nvm.sh
nvm install v6.5.0
nvm use v6.5.0
nvm alias default v6.5.0
npm install -g npm
cd
```

Due to an incompatibility between grpc and electron, several extra
steps are necessary.  As some current PRs make it into grpc these
steps will be unnecessary in the future.  Since you must locally build
grpc, you must have compilers and the normal development tools
installed.

Adjust the following steps for the paths you want to use.

``` bash
mkdir code
cd code
git clone https://github.com/decred/decrediton.git
cd decrediton
cd ..
git clone https://github.com/grpc/grpc
cd grpc
git remote add murg https://github.com/murgatroid99/grpc.git
git fetch --all
git checkout node_electron_build
git submodule update --init
cd tools/run_tests
./build_node_electron.sh 1.4.6
cd ../../../decrediton
npm install
npm run dev
```

## Contact

If you have any further questions you can find us at:

- irc.freenode.net (channel #decred)
- [webchat](https://webchat.freenode.net/?channels=decred)
- forum.decred.org
- decred.slack.com

## Issue Tracker

The
[integrated github issue tracker](https://github.com/decred/decrediton/issues)
is used for this project.

## License

decrediton is licensed under the [copyfree](http://copyfree.org) ISC License.

