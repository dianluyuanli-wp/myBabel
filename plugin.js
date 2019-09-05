const {resolve, isAbsolute, dirname}  = require('path');
function _pluginSyntaxOptionalChaining() {
    const data = _interopRequireDefault(require("@babel/plugin-syntax-optional-chaining"));
  
    _pluginSyntaxOptionalChaining = function () {
      return data;
    };
  
    return data;
  }

function _core() {
  const data = require("@babel/core");

  _core = function () {
    return data;
  };

  return data;
}  

const loose = false;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
module.exports = function(babel){
    let t = babel.types;

	return {
        inherits: _pluginSyntaxOptionalChaining().default,
	    visitor: {
            // Identifier(path) {
            //     console.log(path.node.name, path.node.type);
            //     console.log('----------------------')
            //     if (
            //     path.node.type === "Identifier" &&
            //     path.node.name === "n"
            //     ) {
            //     path.node.name = "x";
            //     }
            // },
            "OptionalCallExpression|OptionalMemberExpression"(path) {
                const {
                    parentPath,
                    scope
                  } = path;
                  const optionals = [];
                  let optionalPath = path;
                  //console.log(parentPath, 'chat');
          
                  while (optionalPath.isOptionalMemberExpression() || optionalPath.isOptionalCallExpression()) {
                    const {
                      node
                    } = optionalPath;
                    //console.log(node, 'node')
          
                    if (node.optional) {
                      optionals.push(node);
                    }
          
                    if (optionalPath.isOptionalMemberExpression()) {
                      optionalPath.node.type = "MemberExpression";
                      optionalPath = optionalPath.get("object");
                    } else if (optionalPath.isOptionalCallExpression()) {
                      optionalPath.node.type = "CallExpression";
                      optionalPath = optionalPath.get("callee");
                    }
                  }
                  let replacementPath = path;

                  //  是否是一元表达式 删除
                  if (parentPath.isUnaryExpression({
                    operator: "delete"
                  })) {
                    replacementPath = parentPath;
                  }
                  // console.log(replacementPath, 'replacementPath');
                  // console.log(path, 'path');
          
                  //  for循环所有的可选表达式节点
                  for (let i = optionals.length - 1; i >= 0; i--) {
                    const node = optionals[i];
                    //  判断是否是调用表达式
                    const isCall = _core().types.isCallExpression(node);
                    
                    //  判断先前被替换过的key是哪个
                    const replaceKey = isCall ? "callee" : "object";
                    //  获取登记结点的object或者callee属性
                    const chain = node[replaceKey];
                    let ref;
                    let check;
          
                    //  如果是宽松并且是调用
                    if (loose && isCall) {
                      check = ref = chain;
                    } else {
                      ref = scope.maybeGenerateMemoised(chain);
                      // console.log(chain, 'chain');
                      // console.log(ref, 'ref');
          
                      if (ref) {
                        check = _core().types.assignmentExpression("=", _core().types.cloneNode(ref), chain);
                        node[replaceKey] = ref;
                      } else {
                        check = ref = chain;
                      }
                    }
          
                    if (isCall && _core().types.isMemberExpression(chain)) {
                      if (loose) {
                        node.callee = chain;
                      } else {
                        const {
                          object
                        } = chain;
                        let context = scope.maybeGenerateMemoised(object);
          
                        if (context) {
                          chain.object = _core().types.assignmentExpression("=", context, object);
                        } else {
                          context = object;
                        }
          
                        node.arguments.unshift(_core().types.cloneNode(context));
                        node.callee = _core().types.memberExpression(node.callee, _core().types.identifier("call"));
                      }
                    }
          
                    replacementPath.replaceWith(_core().types.conditionalExpression(loose ? _core().types.binaryExpression("==", _core().types.cloneNode(check), _core().types.nullLiteral()) : _core().types.logicalExpression("||", _core().types.binaryExpression("===", _core().types.cloneNode(check), _core().types.nullLiteral()), _core().types.binaryExpression("===", _core().types.cloneNode(ref), scope.buildUndefinedNode())), scope.buildUndefinedNode(), replacementPath.node));
                    console.log(replacementPath.get("alternate"), 'test')
                    //   replacementPath.get("alternate")
                    //replacementPath = replacementPath.get("alternate");
                  }
                  //console.log(optionals);
            }
	    }
	 };
}