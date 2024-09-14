
current_name=`date +"%Y%m%d%H%M%S"`
echo $current_name
mkdir $current_name

js=""
js+="export default '"
js+=$current_name
js+="';"
echo $js
echo $js > ./src/publication.js

npm run build
cp src/assets/ionicons.* dist/assets

test -e gaoq-extension.zip && rm gaoq-extension.zip || echo 'gaoq-extension.zip不存在'

cp -r dist/* $current_name

rm $current_name/assets/handler.index.js

zip -r gaoq-extension.zip $current_name


scp gaoq-extension.zip root@op:/mnt/upload/29

scp ./mitmproxy/* root@op:/mnt/upload/29

sleep 3

# rm -rf $current_name

# echo 'rm' $current_name
