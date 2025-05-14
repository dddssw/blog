---
outline: deep
---

## 启动
您可以通过实例化 Worker 类来注册 Web 工作器。这样做时，您可以指定网页工作器代码所在的位置，浏览器将加载该代码并随后为其创建新线程。生成的线程通常称为“工作器线程”。

```js
const worker = new Worker('/worker.js')
```

worker.js在现代框架中应该放到public下,打包之后 public下的内容与打包后的内容放在同一层级

或者

::: tip
注意：包括webpack、Vite和Parcel 在内的打包工具建议将相对于import.meta.url构造函数解析的 URL 传递给它Worker()。例如：
```js
const myWorker = new Worker(new URL("worker.js", import.meta.url));
```
这种做法可以确保 Web Worker 文件路径始终相对于当前的 JavaScript 文件，而不是 HTML 文件
:::
## 与主线程相互通信
数据并不是被共享而是被复制

通过 postMessage() 方法和 onmessage 事件处理函数触发 worker 的方法

```js
// my-web-worker.js
//在 Worker 中使用时则无需挂在对象上。这是因为在 Worker 内部，Worker 实际上是全局作用域
onmessage = (e) => {
  console.log("Message received from main script");
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;//数据在属性data中
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
```
然后在主线程上下文中的脚本中window，您可以使用另一个message事件从 Web 工作线程接收消息：

```js
// scripts.js

// Creates the web worker:
const myWorker = new Worker('/js/my-web-worker.js');

myWorker.postMessage('123');

myWorker.onmessage = (e) => {
  result.textContent = e.data;
  console.log("Message received from worker");
};
```
## 子线程
子工作线程的路径是相对于父工作线程的位置来解析的，而不是相对于主页面或其他路径。这样，工作线程能更容易地跟踪和管理自己的依赖

随着多核计算机变得越来越普遍，将计算复杂的任务分配给多个工作者通常很有用，然后这些工作者可以在多处理器核心上执行这些任务。
## 引入脚本与库
Worker 线程能够访问一个全局函数 importScripts() 来引入脚本，该函数接受 0 个或者多个 URI 作为参数来引入资源；以下例子都是合法的：

importScripts() 是 同步执行 的
```js
importScripts(); /* 什么都不引入 */
importScripts("foo.js"); /* 只引入 "foo.js" */
importScripts("foo.js", "bar.js"); /* 引入两个脚本 */
importScripts("//example.com/hello.js"); /* 你可以从其他来源导入脚本 */
```

## 可转移对象
```js
worker.postMessage(buffer, [buffer]); // 第二个参数是传递的对象列表（转移）
```
## Structured Clone Algorithm 和 JSON.parse(JSON.stringify())
| 特性               | Structured Clone Algorithm                          | JSON.parse(JSON.stringify())                    |
|--------------------|----------------------------------------------------|-------------------------------------------------|
| 支持的数据类型      | 支持多种复杂类型，如 ArrayBuffer、Map、Date 等        | 只支持 JSON 兼容的类型（Object、Array、String 等） |
| 循环引用处理        | 支持循环引用                                          | 不支持，会抛出异常                               |
| 性能               | 通常更高效，特别是处理复杂对象时                        | 比较慢，涉及序列化和反序列化                       |
| 原型链保留          | 保留原型链和类型                                        | 不保留原型链，所有对象都变成普通对象               |
| Date 对象处理       | 保留 Date 对象的类型和时间戳                           | 将 Date 转换为字符串，丢失原类型    