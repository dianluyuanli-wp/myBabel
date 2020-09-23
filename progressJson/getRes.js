const trueInfo = require('./relayFile.js').b;
const fs = require('fs');

//  生成最终的结果
fs.writeFileSync('progressJson/result.json', JSON.stringify(trueInfo), 'utf8');