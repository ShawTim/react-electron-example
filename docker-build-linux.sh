#!/bin/bash

npm install
mkdir -p build
mkdir -p dist

docker run --rm -ti \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:14 \
 /bin/bash -c "npm run build:linux"
