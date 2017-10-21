# decrediton

[![Build Status](https://travis-ci.org/decred/decrediton.png?branch=master)](https://travis-ci.org/decred/decrediton)
[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)

decrediton is a cross-platform GUI for decred written in node.js using
Electron.

## Installation

Currently decrediton is available on Windows, Linux, and macOS.

Decrediton will NOT use or in any way disrupt the wallet file you may
already be using at this time.

Download the decrediton release for your operating system on [decred/decred-binaries](https://github.com/decred/decred-binaries/releases).

On macOS, Ubuntu (14.04 and later), and recent Debians, there should be
no additional dependencies needed.

On Fedora or similar distros you may need to install the libXScrnSaver
package if you see this error:
```
error while loading shared libraries: libXss.so.1
```

You can install this on a recent Fedora with the command:

```bash
sudo dnf -y install libXScrnSaver
```

On linux you will need to decompress the package:
```bash
tar -xvzf decrediton-X.X.X.tar.gz
```
and then run the file:
```bash
./decrediton
```

This will start dcrd and dcrwallet for you.

On macOS, double-click the .dmg file, drag the .app to your
Applications folder.  Double click on Decrediton.app to start.

From there follow the on screen instructions to setup your wallet.

### Options

When running a release version, there are a few options available.

To see additional debug information (including the output of dcrd and dcrwallet) run:

```
decrediton --debug
```

To pass additional arguements to dcrwallet (such as to increase the logging level run:

```
decrediton --extrawalletargs='-d=debug'
```

## Developing

Due to potential compatibility issues, for now, all work should be
done with electron 1.4.15.

You need to install dcrd, dcrwallet and dcrctl.  

- [dcrd/dcrctl installation instructions](https://github.com/decred/dcrd#updating)
- [dcrwallet installation instructions](https://github.com/decred/dcrwallet#installation-and-updating)

This has been tested on Linux and OSX.

Adjust the following steps for the paths you want to use.

``` bash
mkdir code
cd code
git clone https://github.com/decred/decrediton.git
cd decrediton
yarn
mkdir bin/
cp $GOPATH/bin/dcr* bin/
yarn dev
```

### Note about developing with testnet

The first time you run with testnet, you may get a "Failed to connect wallet by deadline error".  If so, make sure you change your config.json:
```bash
"network": "testnet",
```

### Using existing dcrd and dcrwallet daemons

During development it may be useful to run the `dcrd` and `dcrwallet` daemons separately from decrediton (to speed up start up time or to test with different versions of the back-ends).

To do that, change the following directives on your config.json file:

```bash
"daemon_skip_start": true,
"wallet_skip_start": true,
```

This will prevent decrediton from starting the daemons. You can then start them manually:

```bash
dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=$HOME/.dcrd/rpc.cert

dcrwallet --testnet --rpcconnect=127.0.0.1:19119 --grpclisten=127.0.0.1:19121 --noinitialload --tlscurve=P-256 --onetimetlskey --appdata=~/.config/decrediton
```

Or on MacOS:

```bash
dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=$HOME/Library/Application\ Support/Dcrd/rpc.cert

dcrwallet --testnet --rpcconnect=127.0.0.1:19119 --grpclisten=127.0.0.1:19121 --noinitialload --tlscurve=P-256 --onetimetlskey --appdata=$HOME/Library/Application\ Support/decrediton
```

### Windows

On windows you will need some extra steps to build grpc.  This assumes
you are using msys2 with various development tools (copilers, make,
ect) all installed.

Install node from the official package https://nodejs.org/en/download/
and add it to your msys2 path.  You must install the same version of node as required for Linux and OSX (6.9.5).

Install openssl from the following site:
https://slproweb.com/products/Win32OpenSSL.html

From an admin shell:

```bash
npm install --global --production windows-build-tools
```

Then build grpc as described above.

## Building the package

You need to install dcrd, dcrwallet and dcrctl.  

- [dcrd/dcrctl installation instructions](https://github.com/decred/dcrd#updating)
- [dcrwallet installation instructions](https://github.com/decred/dcrwallet#installation-and-updating)

To build a packaged version of decrediton (including a dmg on OSX and
exe on Windows), follow the development steps above.  Then build the
dcr command line tools:

```bash
cd code/decrediton
mkdir bin
cp `which dcrd` bin/
cp `which dcrctl` bin/
cp `which dcrwallet` bin/
npm install
npm run package
```

## Building release versions

### Linux

You need to make sure you have the following packages installed for the building to work:
- icns2png
- graphicsmagick
- rpm-build

```bash
npm run package-linux
```

After it is finished it will have the built rpm, deb and tar.gz in the releases/ directory.

## Docker

A docker file for building decrediton is also provided.  With no options it builds for linux on amd64 although it is possible to attempt OSX or arm builds (neither of which have been tested).

```
$ ./build-docker.sh <OS> <ARCH>
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
