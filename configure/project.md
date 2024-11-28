---
outline: deep
layout: doc
---

## commitlint

```js
npm install --save-dev @commitlint/cli
npm install --save-dev @commitlint/config-conventional
```
生成配置文件
```js
//commitlint.config.js
module.exports = { extends: ["@commitlint/config-conventional"] };
```

## husky
```js
npm install --save-dev husky

npx husky init

//.husky/commit-msg
pnpm exec commitlint --config commitlint.config.js --edit "${1}"
```
## cz-git
```js
npm install -D cz-git
npm install -D czg

// 修改 package.json 添加 config 指定使用的适配器
{
  "scripts": {
    //添加命令
   "cz": "czg"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}

//cz-git 与 commitlint 进行联动给予校验信息，所以可以编写于 commitlint 配置文件之中
```