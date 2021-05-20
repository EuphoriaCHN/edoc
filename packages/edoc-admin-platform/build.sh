./node_modules/.bin/umi build

mkdir ./bundle

mv ./dist/index.html ./bundle/index.html

mv ./dist ./bundle

cd ./bundle

mv ./dist ./resource

cd ../

mv ./bundle ./dist

node ./scripts/index.js

rm -rf ./dist/resource

node ./__tests__/index.js