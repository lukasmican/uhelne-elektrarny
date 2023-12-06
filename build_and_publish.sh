#!/bin/bash

ng build --configuration production --aot --base-href https://lukasmican.github.io/uhelne-elektrarny/

rm -r docs
mv dist/hvt-uhelne-elektrarny/ docs/
cp docs/index.html docs/404.html

echo "Compilation done and files are in correct folders, push changes to git to complete the operation."
