#!/bin/bash

ng build --configuration production --aot --base-href https://lukasmican.github.io/uhelne-elektrarny/

rm -r docs
mv dist/hvt-uhelne-elektrarny/ docs/

echo "Compilation done and files are in correct folders, push changes to git to complete the operation."
