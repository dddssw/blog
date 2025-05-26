---
outline: deep
layout: doc
---
## 工程化
组件化开发,组件库建设,使用vitepres创建组件库文档

代码规范:通过eslint prettier等工具强制统一代码风格

协作规范:制定git分支管理,commit message格式,利用git hooks拦截不规范代码的提交

前后端联调:mock接口

构建与打包

CICD

单元测试

前端监控

根据实际项目解决重复性工作,例如编写脚本,插件

## ast
### ast原理
* 首先进行词法分析，将源代码拆分成最小语法单元token,通过有限状态机生成token序列
* 进行语法分析，根据编程语言的语法规则，将Tokens组合成AST,语法分析器会检验代码是否符合语法规范

### ast节点查询优化
优化的本质是减少不必要的AST扫描

* 避免多次遍历，尽量在一次遍历收集全部信息
* 当只需要访问特定节点的数据时，不必使用path.traverse(深度优先)进行遍历,而是手动查找.或者如果找到了节点，可以提前skip跳出深度优先遍历
* 对应嵌套访问器,对于内层的访问器每次都会重新创建.会造成额外的性能开销.我们可以把访问器对象存储在一个变量中，这样就能重复使用它
* 对已解析的文件建立缓存，如果没有修改就没必要重新解析
* 使用swc代替babel解析ast


### AST与CST的区别
* CST (Concrete Syntax Tree, 具体语法的)

严格遵循源代码的上下文无关文法规则生成

保留所有语法的细节包括括号、分号、空格等冗余符号

所有他是原始文本完整映射
* AST (Abstract SyntaTree,抽象的)

忽略对执行无意义的细节(如括号优先级通过结构隐式表达)

所有他是语义等价的最小表达

并且ast在工程化中起到了重要作用,例如在webapack.

* 在依赖解析阶段,根据ast导入导出节点,构建依赖图
* 在代码转化阶段,例如es6转es5,babel就是通过ast parse,traverse,generate来实现的
* tree-shaking也是利用ast进行静态分析
* UglifyJS也是利用ast进行代码压缩
* vite用的esbuild有个功能是将cjs转出esm,也是通过ast来实现的

### tree-shaking
基于静态分析，只适用于esm，因为esm是静态的，在编译时就可以确定导入导出，据此去除未使用的代码
### 举例
```js
let a = 1
```
```js
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",//表示一个完整的变量声明语句
      "declarations": [//这是一个数组
        {
          "type": "VariableDeclarator",//表示单个变量的声明
          "id": {
            "type": "Identifier",//标识符节点
            "name": "a"
          },
          "init": {
            "type": "Literal",//字面量节点
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "script"
}
```

