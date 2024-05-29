#!/bin/sh

# This script regenerates the static js bindings for the LN .proto files.
# You will need grpc-tools (which installs grpc_tools_node_protoc_plugin)
# installed for this to run properly


./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs_strict,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./lightning.proto

./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs_strict,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./walletunlocker.proto

./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs_strict,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./invoices.proto

./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs_strict,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./wtclient.proto

./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs_strict,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./autopilot.proto

# commonjs_strict is broken (see https://github.com/grpc/grpc-node/issues/1445).
# To fix it, we need to tweak the require at the top of the pb files
# to account for the extra package name.
sed -i "s/require('.\/lightning_pb.js')/require('.\/lightning_pb.js').lnrpc/" lightning_grpc_pb.js
sed -i "s/require('.\/lightning_pb.js')/require('.\/lightning_pb.js').lnrpc/" walletunlocker_grpc_pb.js
sed -i "s/require('.\/walletunlocker_pb.js')/require('.\/walletunlocker_pb.js').lnrpc/" walletunlocker_grpc_pb.js
sed -i "s/require('.\/wtclient_pb.js')/require('.\/wtclient_pb.js').wtclientrpc/" wtclient_grpc_pb.js
sed -i "s/require('.\/invoices_pb.js')/require('.\/invoices_pb.js').invoicesrpc/" invoices_grpc_pb.js
sed -i "s/require('.\/autopilot_pb.js')/require('.\/autopilot_pb.js').autopilotrpc/" autopilot_grpc_pb.js
