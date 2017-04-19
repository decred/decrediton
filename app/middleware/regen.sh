#!/bin/sh

# This script regenerates the static js bindings for the api.proto file
# You will need protoc (3.2.0) and grpc-tools (which installs grpc_tools_node_protoc_plugin) installed for this to run properly
protoc --js_out=import_style=commonjs,binary:./walletrpc --grpc_out=./walletrpc --plugin=protoc-gen-grpc=$(which grpc_tools_node_protoc_plugin) ./api.proto