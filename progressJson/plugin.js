//  要小心循环引用，超过迭代次数还没有出来就会自动停止，而且不会报错
module.exports = function (babel) {
    const { types: t } = babel;
    return {
        name: 'write in new content', // not required
        visitor: {
            //  捕捉对象属性
            //  t表示的是type,也就是各种属性，要对节点做操作，需要对path做处理，相关api在@babel/traverse里面，市面上几乎没有文档
            ObjectProperty(path) {
                const node = path.node;
                if (node.key.value === 'ppp') {
                    //  删除节点
                    // path.remove();
                    //  插入节点
                    path.insertAfter(t.objectProperty(t.identifier('load'), t.nullLiteral()));
                    path.remove();
                }
              }
        }
    };
};