#!/bin/sh

# This script regenerates the static js bindings for the LN .proto files.
# You will need grpc-tools (which installs grpc_tools_node_protoc_plugin)
# installed for this to run properly


./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./rpc.proto

./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./walletunlocker.proto

./../../../node_modules/grpc-tools/bin/protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs,binary:./ \
  --grpc_out=generate_package_definition:./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./wtclient.proto
