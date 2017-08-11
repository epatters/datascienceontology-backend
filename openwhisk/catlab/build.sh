#!/bin/bash

JULIA_VERSION=0.6

rm -rf build/
mkdir -p build/OpenDiscCore
cp -r ~/.julia/v${JULIA_VERSION}/OpenDiscCore/{REQUIRE,src,test} build/OpenDiscCore

docker build -t epatters/whisk-catlab .
