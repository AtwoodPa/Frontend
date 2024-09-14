source ~/.bash_profile

rm -rf 2023*
rm gaoq-extension.zip

current_name=`date +"%Y%m%d%H%M%S"`
mkdir $current_name

js=""
js+="export default '"
js+=$current_name
js+="';"
echo $js
echo $js > ./src/publication.js

nvm use 16
npm run build
cp src/assets/ionicons.* dist/assets


git add ./src/publication.js
git commit -m 'publication.js'
git push

cp -r dist/* $current_name

zip -r gaoq-extension.zip $current_name

rm -rf $current_name

cp gaoq-extension.zip /mnt/upload/29

cp ./mitmproxy/* /mnt/upload/29

# cp /mnt/upload/29/mitmproxy-* ./gaoq-chrome-extension/mitmproxy/