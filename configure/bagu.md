---
outline: deep
layout: doc
---
## 事件循环
首先js是单线程语言，使用事件循环的原因是为了避免代码阻塞

由调用栈，任务队列，web Api组成

调用栈用来存储同步任务，按顺序执行函数，任务队列分为 宏任务队列（MacroTask Queue） 和 微任务队列（MicroTask Queue），webapi是浏览器提供的异步 API（如 setTimeout、fetch），处理完成后将回调推入队列。

第一步是同步任务直接进入调用栈执行，遇到异步任务交给 Web APIs 处理。第二步当调用栈为空时，事件循环优先清空微任务队列中的所有任务，第三步是从宏任务队列中取出一个任务（如 setTimeout、DOM 事件）执行，然后回到步骤 2。
```js
console.log("1"); // 同步任务

setTimeout(() => console.log("2"), 0); // 宏任务

Promise.resolve()
  .then(() => console.log("3")) // 微任务
  .then(() => console.log("4")); // 微任务

console.log("5"); // 同步任务

// 输出顺序：1 → 5 → 3 → 4 → 2
```
宏任务：`setTimeout`、`DOM 事件`、`I/O`、`requestAnimationFrame`

微任务：`Promise回调`、`MutationObserver`

## 浏览器搜索url
* 查找缓存
* DNS解析
* https还需要通过TLS协议
* 建立tcp连接
* 发送http请求
## tree-shaking
基于静态分析，只适用于esm，因为esm是静态的，在编译时就可以确定导入导出，据此去除未使用的代码