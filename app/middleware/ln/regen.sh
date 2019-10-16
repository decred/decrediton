#!/bin/sh

# This script regenerates the static js bindings for the api.proto file
# You will need protoc (3.2.0) and grpc-tools (which installs
# grpc_tools_node_protoc_plugin) installed for this to run properly

protoc \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs,binary:./ \
  ../../../node_modules/google-proto-files/google/api/annotations.proto \
  ../../../node_modules/google-proto-files/google/api/http.proto

protoc \
  -I/usr/local/include \
  -I. \
  -I../../../node_modules/google-proto-files \
  --js_out=import_style=commonjs,binary:./ \
  --grpc_out=./ \
  --plugin=protoc-gen-grpc=./../../../node_modules/grpc-tools/bin/grpc_node_plugin \
  ./rpc.proto
