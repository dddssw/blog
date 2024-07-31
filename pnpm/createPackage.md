---
layout: doc
outline: deep
---
## 快速生成包
```js
npm config set init.author.email "xxx"
npm config set init.author.name "xxx"
npm config set init.author.url "xxx"
npm config set init.license "MIT"
npm config set init.version "0.1.0"

npm init -f
```

运行 npm run xxx 时，基本步骤如下：
1. 从 package.json 文件中读取 scripts 对象里面的全部配置；
2. 以传给 npm run 的第一个参数作为键，在 scripts 对象里面获取对应的值作为接下来要执行的命令，如果没找到直接报错；
3. 在系统默认的 shell 中执行上述命令，系统默认 shell 通常是 bash，windows 环境下可能略有不同

:::tip
npm 在执行指定 script 之前会把 node\_modules/.bin 加到环境变量 $PATH 的前面，这意味着任何内含可执行文件的 npm 依赖都可以在 npm script 中直接调用，换句话说，你不需要在 npm script 中加上可执行文件的完整路径，比如 ./node_modules/.bin/eslint **.js。
:::
## 管理多个命令
npm-run-all