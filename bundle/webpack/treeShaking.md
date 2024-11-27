---
layout: doc
outline: deep
---

tree-shaking 是一个用于描述移除 JavaScript 上下文中的未引用代码(dead-code) 行为的术语。

目的是为了减少最终构建体积

## tree-shaking VS dead code elimination
两者结果相同，但是过程是完全不同的

DCE 好比做蛋糕时，直接放入整个鸡蛋，做完时再从蛋糕中取出蛋壳。而 tree-shaking 则是先取出蛋壳，在进行做蛋糕

webpack 不支持 dead code elimination 吗？是的，webpack 不支持。

原来，在 webpack 中实现 dead code elimination 功能并不是 webpack 本身, 而是大名鼎鼎的 uglify。而 terser-webpack-plugin 插件内部使用了 uglify 实现的。

## 原理
1. ES6的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码。
2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码。uglify没有分析程序流的能力

但是并不是太完美，因为副作用的存在
## 副作用
一个函数会、或者可能会对函数外部变量产生影响的行为

```js
// module.js

export const foo = 'bar'.toUpperCase();

export const PI_2 = Math.PI * 2;

export function sum(a, b) {
  return a + b;
}

// index.js

import { sum } from './module.js'

console.log(sum);

// bundle.js

(() => {
  "use strict";
  "bar".toUpperCase(), Math.PI;
  console.log((function(a, b) {
    return a + b;
  }));
})();
```
您可能会惊讶地发现，尽管只导入了函数，但所有导出的实体都存在于包中sum

删除未使用的函数非常简单。如果从未调用过某个函数，则应将其声明视为“死代码”并从包中删除。这样做之所以有效，是因为函数声明没有副作用：它们不会更新全局变量，不会与 DOM 一起工作等

分析上面的例子(import 会自动执行一遍进行模块的初始化)
1. 'bar'.toUpperCase()。这是一个函数调用，它可能会产生副作用。好吧，我们知道这toUpperCase是一个纯函数，这意味着调用它没有副作用。但是，压缩器对标准库一无所知。这就是为什么函数调用没有从包中删除
2. Math.PI？它表示访问对象的属性，并且可能有副作用。访问变量始终是纯粹的，但访问属性可能会调用可以执行任何操作的 getter 方法。压缩器不知道该代码有多纯粹，因此它们会保持其完整

## 如何让纯代码可进行 tree-shake 操作
如果你确定是纯代码，可以放置`/* #__PURE__ */`在函数调用或者new class之前

如果访问对象的属性是纯代码，需要把他放在一个纯函数里

like this

```js
// module.js

export const foo = /* #__PURE__ */ 'bar'.toUpperCase();

function getPi2() {
  return Math.PI * 2;
}

export const PI_2 = /* #__PURE__ */ getPi2();

export function sum(a, b) {
  return a + b;
}

// index.js

import { sum } from './module.js'

console.log(sum);

// bundle.js

(() => {
  "use strict";
  console.log((function(a, b) {
    return a + b;
  }));
})();
```
## sideEffects: false
如果是在构建一个库，你应该知道package.jso中的sideEffects

它与`/* #__PURE__ */`类似，不同是它是模块级别另一个是语句级别

设置为false代表你整个库都是纯代码

也接受一个数组
```js
  "sideEffects": [
    "dist/*",
    "theme-chalk/**/*.css",
    "theme-chalk/src/**/*.scss",
    "es/components/*/style/*",
    "lib/components/*/style/*"
  ],
```
:::tip :rocket:
设置sideEffects: false,完整导入时才能被跳过
```js
// module.js

export const foo = 'bar'.toUpperCase();

export const PI_2 = Math.PI * 2;

export function sum(a, b) {
  return a + b;
}

// index.js

import './module.js'

console.log('noop');

// bundle.js

(() => {
  "use strict";
  console.log('noop');
})();
```
如果是分开导入的，还是需要`/* #__PURE__ */`
```js
// module.js

export const foo = 'bar'.toUpperCase();

export const PI_2 = Math.PI * 2;

export function sum(a, b) {
  return a + b;
}

// index.js

import { sum } from './module.js'

console.log(sum);

// bundle.js

(() => {
  "use strict";
  "bar".toUpperCase(), Math.PI;
  console.log((function(a, b) {
    return a + b;
  }));
})();
```
:::
如果你的库提供了全局样式表（而不是CSS 模块），那么也应该将它们添加到包含副作用的文件数组中：
```js
  "sideEffects": [
    "dist/*",
    "theme-chalk/**/*.css",
    "theme-chalk/src/**/*.scss",
    "es/components/*/style/*",
    "lib/components/*/style/*"
  ],
```
```js
import 'mylib/dist/index.css' 
```
## 参考
[如何构建可摇树的 JavaScript（js）库](https://cube.dev/blog/how-to-build-tree-shakeable-javascript-libraries)