//const babel = require('@babel/core');
module.exports = function({types: t}) {
    return {
        visitor: {
            FunctionDeclaration(path) {
                path.scope.rename("n", "x");
              }
        }
    }
}