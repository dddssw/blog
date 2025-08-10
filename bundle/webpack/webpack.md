---
layout: doc
outline: deep
---
## 流程
* 初始化：读取合并配置信息，加载plugin，实例化compiler
* 编译：从entry出发，针对每个module调用对应的loader去翻译源代码，再找到该module依赖的module，递归的进行编译处理
* 输出：将编译后的module组合成chunk，将chunk转化为文件，输出到文件系统中
## loader
一个loader其实就是一个Node.js模块，这个模块需要导出一个函数，接收原内容，返回处理之后的内容。

由于loader运行在node.js上，所以我们可以调用任意node.js自带的api,或者按照第三方模块进行调用

```js
const { validate } = require('schema-utils'); // 配置验证工具 [4](@ref)
const loaderUtils = require('loader-utils'); // 工具库（Webpack 内置）

// 1. 定义配置的 JSON Schema（用于参数校验）
const schema = {
  type: 'object',
  properties: {
    prefix: { type: 'string' }, // 示例参数
    debug: { type: 'boolean' }
  },
  additionalProperties: false // 禁止额外参数
};

// 2. Loader 主体函数
module.exports = function(source) {
  // 异步模式（通过回调返回结果）
  const callback = this.async();
  
  // 3. 获取并验证配置项
  const options = loaderUtils.getOptions(this) || {};
  validate(schema, options, { name: 'My Loader' }); // 校验失败时抛出错误 [4](@ref)

  // 4. 处理内容（示例：为文本添加前缀）
  let result = source;
  if (options.prefix) {
    result = options.prefix + result;
  }

  // 5. 返回结果（支持多种格式）
  callback(null, result);
};

// 6. 声明是否处理二进制文件（默认处理文本）
module.exports.raw = false; // 若需处理图片等二进制数据，设为 true [6](@ref)
```
## plugin
* compiler:Webpack的​​全局单例对象​​，代表​​整个构建环境
* compilation:代表一次新的编译