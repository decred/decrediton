#!/bin/sh

# This script regenerates the static js bindings for the api.proto file
# You will need protoc and grpc_node_plugin bins installed for this to run properly
protoc --js_out=import_style=commonjs,binary:./walletrpc --grpc_out=./walletrpc --plugin=protoc-gen-grpc=$(which grpc_node_plugin) ./api.proto