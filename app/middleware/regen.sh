#!/bin/sh

# This script regenerates the static js bindings for the dcrwallet .proto file.
# You will need grpc-tools (which installs grpc_tools_node_protoc_plugin)
# installed for this to run properly
./../../node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:./walletrpc \
    --grpc_out=generate_package_definition:./walletrpc \
    --plugin=protoc-gen-grpc=./../../node_modules/grpc-tools/bin/grpc_node_plugin ./api.proto