const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
//  原始json
const UPLOAD_DIR = path.resolve(__dirname, "origin.json"); // 大文件存储目录

//  通过babel插件，写入新的文件
const oldContent = fs.readFileSync(UPLOAD_DIR);
//  强行转换成js文件
const addContent = 'let b=' + oldContent + ';exports.b = b;';
//  通过babel处理替换，替换内容
const newContent = babel.transformSync(addContent, {
    plugins: ['./progressJson/plugin']
}).code;
//  生成中介文件
fs.writeFileSync('progressJson/relayFile.js', newContent, 'utf8');