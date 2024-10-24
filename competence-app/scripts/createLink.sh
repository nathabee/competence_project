#!/bin/bash

TARGET_DIR="../../src/demo/media"
LINK_DIR="../public/demo"

if [ ! -L "$LINK_DIR" ]; then
    ln -s "$TARGET_DIR" "$LINK_DIR"
    echo "Symbolic link created from public/demo/media to src/demo/media."
else
    echo "Symbolic link already exists."
fi


TARGET_DIR="../../src/demo/data"
LINK_DIR="../public/demo"

if [ ! -L "$LINK_DIR" ]; then
    ln -s "$TARGET_DIR" "$LINK_DIR"
    echo "Symbolic link created from public/demo/data to src/demo/data."
else
    echo "Symbolic link already exists."
fi



TARGET_DIR="../../../../static/html/swagger.json"
LINK_DIR="../public/demo/swagger"

if [ ! -L "$LINK_DIR" ]; then
    ln -s "$TARGET_DIR" "$LINK_DIR"
    echo "Symbolic link created from ../public/demo/swagger to ../../../static/html/swagger.json  "
else
    echo "Symbolic link already exists."
fi

 

TARGET_DIR="../../../../static/html/swagger_json.html"
LINK_DIR="../public/demo/swagger"

if [ ! -L "$LINK_DIR" ]; then
    ln -s "$TARGET_DIR" "$LINK_DIR"
    echo "Symbolic link created from ../public/demo/swagger to ../../../static/html/swagger_json.html "
else
    echo "Symbolic link already exists."
fi
