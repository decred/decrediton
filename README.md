# decrediton

decrediton is a cross-platform GUI for decred written in node.js using
Electron.

## Installation

Currently decrediton has only been tested and built on Linux and
macOS.  Additional systems will be added in the future.

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
done with node v6.9.5 and electron 1.4.15.  The recommended way to install
node is using nvm.

This has primarily been tested on Linux at the moment although OSX
should work similarly.

``` bash
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
. ~/.nvm/nvm.sh
nvm install v6.9.5
nvm use v6.9.5
nvm alias default v6.9.5
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
git clone https://github.com/grpc/grpc
cd grpc
git checkout cc2e048e84eaa418cab393553594a3fefb891037 
git submodule update --init
npm install
cd ../decrediton
npm install
```

Start dcrd and dcrwallet with the following options.  Note, you must
NOT already have rpc certs from dcrwallet so it is easiest to start
with an emtpy $HOME/.dcrwallet

```bash
dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19109 --rpccert=$HOME/.dcrd/rpc.cert
```

```bash
dcrwallet --testnet --experimentalrpclisten=127.0.0.1:19112 --noinitialload --tlscurve=P-256 --onetimetlskey --appdata=~/.config/decrediton
```

On macOS you should use:
```bash
dcrd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19109 --rpccert=$HOME/Library/Application\ Support/Dcrd/rpc.cert
```
```bash
dcrwallet --testnet --experimentalrpclisten=127.0.0.1:19112 --noinitialload --tlscurve=P-256 --onetimetlskey --appdata=$HOME/Library/Application\ Support/decrediton
```

Start decrediton

```bash
npm run dev
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

To build a packaged version of decrediton (including a dmg on OSX and
exe on Windows), follow the development steps above.  Then build the
dcr command line tools:

```bash
go get -u -v github.com/decred/dcrd
go get -u -v github.com/decred/dcrwallet
go get -u -v github.com/Masterminds/glide
cd $GOPATH/src/github.com/decred/dcrd
glide i
go install . ./cmd/dcrctl/
cd ../dcrwallet
glide i
go install
cd
cd code/decrediton
mkdir bin
cp `which dcrd` bin/
cp `which dcrctl` bin/
cp `which dcrwallet` bin/
npm install
npm run package
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

