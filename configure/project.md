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