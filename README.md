# decrediton

[![Build Status](https://travis-ci.org/decred/decrediton.png?branch=master)](https://travis-ci.org/decred/decrediton)
[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)

decrediton is a cross-platform GUI for decred written in node.js using
Electron.

## Installation

Currently decrediton is available on Windows, Linux, and macOS.

Decrediton will NOT use or in any way disrupt the CLI wallet file you may
already be using at this time.

Download the decrediton release for your operating system on [decred/decred-binaries](https://github.com/decred/decred-binaries/releases).

On macOS, Ubuntu (14.04 LTS kernel 3.16 and later), and recent Debians, there should be
no additional dependencies needed (exception: Ubuntu 18.04+, see [issue #1404](https://github.com/decred/decrediton/issues/1404)).

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

You can also install via [brew cask](https://caskroom.github.io):
```bash
brew cask install decrediton
```

From there follow the on screen instructions to setup your wallet.

### Options

When running a release version, there are a few options available.

To see additional debug information (including the output of dcrd and dcrwallet) run:

```
decrediton --debug
```

To pass additional arguments to dcrwallet (such as to increase the logging level run:

```
decrediton --extrawalletargs='-d=debug'
```

## Developing

Due to potential compatibility issues, for now, all work should be
done with electron 2.0.0.

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

## Setting up your development environment
The following steps will help you configure your decrediton development environment and reduce future startup times.

### Wallet
When you launch decrediton, you will be prompted to select a wallet to use. Select your wallet or create a new one using the in-app wizard. Be sure to save your seed and make your password memorable.

### Decred Node
It will be helpful to you to run the Decred node in a separate process and simply attach to it between decrediton restarts. In order to see the advanced daemon configuration options you open your ```config.json``` and set the ```daemon_start_advanced``` flag to ```true``` as follows:

```"daemon_start_advanced": true,```

Note: Your config.json file is located in the following directory(s)

Windows - ```C:\Users\<your-username>\AppData\Local\Decrediton\config.json```

OSX - ```$HOME/Library/Application\ Support/Decrediton/config.json```

Linux - ```~/.config/decrediton/config.json```

Run the following to start the Decred daemon in a standalone terminal window:

Windows - ```dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=C:\Users\<username>\AppData\Local\Dcrd\rpc.cert```

OSX - ```dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=$HOME/Library/Application\ Support/Dcrd/rpc.cert```

Linux - ```dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=~/.dcrd/rpc.cert```

You can connect to this daemon in ```Advanced Startup => Different Local Daemon Location``` and input the parameters requested. Note that all the parameters needed are present in the command you used to start the node for your respective system.

### Windows

On windows you will need some extra steps to build grpc.  This assumes
you are using msys2 with various development tools (compilers, make,
etc) all installed.

Install node from the official package https://nodejs.org/en/download/
and add it to your msys2 path.  You must install the same version of node as required for Linux and OSX (8.6.0+).

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
yarn
yarn package
```

## Building release versions

### Linux

You need to make sure you have the following packages installed for the building to work:
- icns2png
- graphicsmagick
- rpm-build

```bash
yarn package-linux
```

After it is finished it will have the built rpm, deb and tar.gz in the releases/ directory.

If you're only interested in a tar.gz, you can alternatively use:

```bash
yarn package-dev-linux
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
