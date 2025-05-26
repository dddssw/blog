---
outline: deep
layout: doc
---

1. [闭包](closure)
2. 原型  
   对象有一个特殊的隐藏属性 prototype,它要么为 null,要么就是另一个对象的引用,该对象被称为原型",  
   属性 [[Prototype]] 是内部的而且是隐藏的,但是使用特殊的名字 **proto** 可以设置它,  
   当访问一个对象的属性,如果没找到就会到原型里找,原型里又有它的原型,这样一直寻找,就是一条原型链,原型链的终点是 null,
3. 迭代器
   for...of 只能遍历可迭代对象，如果遍历对象,  
   需要实现一个 Symbol.iterator 方法,  
   当 for...of 启动时会调用这个方法，这个方法必须返回一个迭代器，一个有 next 方法的对象,  
   当循环希望获得下一个值，会调用这个 next 方法,  
   next 返回的结果格式必须是 {done: boolean, value: any}，当 done 为 true，代表循环结束

   ```js
   let a = {
     start: 1, // 起始值
     end: 4, // 结束值
     // 实现 Symbol.iterator 方法使得对象可迭代
     [Symbol.iterator]() {
       let current = this.start; // 当前值从 start 开始
       return {
         next: () => {
           if (current <= this.end) {
             // 如果当前值在范围内，返回 {done: false, value: current++}
             return { done: false, value: current++ };
           } else {
             // 否则返回 {done: true}，表示结束
             return { done: true };
           }
         },
       };
     },
   };

   // 使用 for...of 遍历对象
   for (let value of a) {
     console.log(value); // 输出: 1, 2, 3, 4
   }
   ```
4. ## 事件循环
首先js是单线程语言，使用事件循环的原因是为了避免代码阻塞

由调用栈，任务队列，web Api组成

调用栈用来存储同步任务，按顺序执行函数，任务队列分为 宏任务队列（MacroTask Queue） 和 微任务队列（MicroTask Queue），webapi是浏览器提供的异步 API（如 setTimeout、fetch），处理完成后将回调推入队列。

第一步是同步任务直接进入调用栈执行，遇到异步任务交给 Web APIs 处理。第二步当调用栈为空时，事件循环优先清空微任务队列中的所有任务，第三步是从宏任务队列中取出一个任务（如 setTimeout、DOM 事件）执行，然后回到步骤 1。
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
7. ## 浏览器搜索url
首先浏览器是一个多进程的架构，例如browser进程,每个页签都有一个render进程，最重要的主线程就在其中

当在搜索栏搜索时，browser进程下的ui线程会判断搜索的是不是url，如果不是，会交给搜索引擎进行处理，反之

如果这是一个域名的话，需要进行dsn解析，因为域名只是方便记忆，访问的话还是需要ip地址

建立tcp连接，如果是https的话，还需要通过tls协议来建立安全连接,然后再发送http请求

拿spa应用举例,根据url请求服务器,如果url最后带斜杠,默认返回下面的index.html,如果没有这个资源,不同网站可能有重定向策略


浏览器处理资源
* 解析html生成dom树
* 遇到css生成cssom树
* 遇到普通js会阻塞html解析，需要下载再执行，加了defer或者async不会阻塞
* 将dom树和cssom树合成渲染树
* 在主线程计算几何布局，层次，交给合成器线程和GPU渲染页面
* 请求的资源都会走http缓存

6. this 打印结果

```js
var a = 1;
var b = {
  a: 2,
  echo: () => {
    console.log(this.a);
  },
};
b.echo();

//

function a() {
  let b = {
    fn: () => {
      console.log(this.data);
    },
  };
  return b;
}

let c = {
  data: 1,
  a,
};

let d = {
  data: 2,
  a,
};

c.a().fn();
d.a().fn();
```
