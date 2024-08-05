---
outline: deep
---
就 JavaScript 而言，您通常只能在主线程上执行工作，但这只是默认操作。可以在 JavaScript 中注册和使用其他线程。允许在 JavaScript 中实现多线程的功能称为 Web Workers API。

## 启动
您可以通过实例化 Worker 类来注册 Web 工作器。这样做时，您可以指定网页工作器代码所在的位置，浏览器将加载该代码并随后为其创建新线程。生成的线程通常称为“工作器线程”。

```js
const myWebWorker = new Worker('/js/my-web-worker.js');
```
## 与主线程相互通信
数据并不是被共享而是被复制

通过 postMessage() 方法和 onmessage 事件处理函数触发 worker 的方法

```js
// my-web-worker.js
self.addEventListener("message", () => {
  // Sends a message of "Hellow, window!" from the web worker:
  self.postMessage("Hello, window!");
});
```
然后在主线程上下文中的脚本中window，您可以使用另一个message事件从 Web 工作线程接收消息：

```js
// scripts.js

// Creates the web worker:
const myWebWorker = new Worker('/js/my-web-worker.js');

// Adds an event listener on the web worker instance that listens for messages:
myWebWorker.addEventListener("message", ({ data }) => {
  // Echoes "Hello, window!" to the console from the worker.
  console.log(data);
});
```
## 引入脚本与库
Worker 线程能够访问一个全局函数 importScripts() 来引入脚本，该函数接受 0 个或者多个 URI 作为参数来引入资源；以下例子都是合法的：

```js
importScripts(); /* 什么都不引入 */
importScripts("foo.js"); /* 只引入 "foo.js" */
importScripts("foo.js", "bar.js"); /* 引入两个脚本 */
importScripts("//example.com/hello.js"); /* 你可以从其他来源导入脚本 */
```