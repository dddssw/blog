---
outline: deep
layout: doc
---

1. [闭包](closure)
2. 原型  
   对象有一个特殊的隐藏属性 [[prototype]],它要么为 null,要么就是另一个对象的引用,该对象被称为原型",  
   属性 [[Prototype]] 是内部的而且是隐藏的,但是使用特殊的名字 **proto** 可以设置它,  
   当访问一个对象的属性,如果没找到就会到原型里找,原型里又有它的原型,这样一直寻找,就是一条原型链,原型链的终点是 null,
   F.prototype 指的是 F 的一个名为 "prototype" 的常规属性。这听起来与“原型”这个术语很类似，但这里我们实际上指的是具有该名字的常规属性。设置 Rabbit.prototype = animal 的字面意思是：“当创建了一个 new Rabbit 时，把它的 [[Prototype]] 赋值为 animal,被他实例化出的对象就可以使用 animal 上的方法。构造函数-prototype,对象-**proto**

   对于一个构造函数，prototype 是一个常规属性，例如 Array.prototype 他是一个包含了一组数组方法的对象，这个对象的原型(**proto**)是 Object.prototype

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
   首先 js 是单线程语言，使用事件循环的原因是为了避免代码阻塞

由调用栈，任务队列，web Api 组成

调用栈用来存储同步任务，按顺序执行函数，任务队列分为 宏任务队列（MacroTask Queue） 和 微任务队列（MicroTask Queue），webapi 是浏览器提供的异步 API（如 setTimeout、fetch），处理完成后将回调推入队列。

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

7. ## 浏览器搜索 url
   首先浏览器是一个多进程的架构，例如 browser 进程,每个页签都有一个 render 进程，最重要的主线程就在其中

当在搜索栏搜索时，browser 进程下的 ui 线程会判断搜索的是不是 url，如果不是，会交给搜索引擎进行处理，反之

如果这是一个域名的话，需要进行 dsn 解析，因为域名只是方便记忆，访问的话还是需要 ip 地址

建立 tcp 连接，如果是 https 的话，还需要通过 tls 协议来建立安全连接,然后再发送 http 请求

拿 spa 应用举例,根据 url 请求服务器,如果 url 最后带斜杠,默认返回下面的 index.html,如果没有这个资源,不同网站可能有重定向策略

浏览器处理资源

- 解析 html 生成 dom 树
- 遇到 css 生成 cssom 树
- 遇到普通 js 会阻塞 html 解析，需要下载再执行，加了 defer 或者 async 不会阻塞
- 将 dom 树和 cssom 树合成渲染树
- 在主线程计算几何布局，层次，交给合成器线程和 GPU 渲染页面
- 请求的资源都会走 http 缓存

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

7. promise 打印
   执行代码，遇到同步任务执行，如果有微任务，宏任务加入队列。执行后面可以执行的同步代码。同步代码处理完，开始处理微任务，最后是宏任务。promise 的声明语句是同步的

```js
new Promise((resolve) => {
  resolve();
  console.log("test");
  reject();
});
```

执行了 resolve、打印"test"、reject，这 3 句代码都会执行，但是 reject 不会生效

```js
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(5);
        resolve();
      }, 0);
      resolve(1);
    });
    resolve(2);
    p.then((arg) => {
      console.log(arg);
    });
  });
first().then((arg) => {
  console.log(arg);
});
console.log(4);
```

注意 Promise 内部的状态转变，他的回调才是微任务

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
```
<details> <summary>注意点</summary>
await async2()  中 async2并没有return一个promise，所以 console.log("async2") 是同步代码
</details>


::: code-group

```js [1.js]
async function async1() {
  await new Promise((resolve, reject) => {
    resolve();
  });
  console.log("async");
}
async1();
new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("promise");
});
```

```js [2.js]
async function async1() {
  await new Promise((resolve, reject) => {
    resolve(1);
  }).then((val)=>{console.log(val)});
  console.log("async");
}
async1();
new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("promise");
});
```

```js [3.js]
async function async1() {
  await async2();
  console.log("async");
}
async function async2() {
  return new Promise((resolve, reject) => {
    resolve();
  });
}
async1();
new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("promise");
});
```

```js [4.js]
async function async1() {
  await async2();
  console.log("async");
}
async function async2() {
  return 1
}
async1();
new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("promise");
});
```

```js [5.js]
async function async1() {
  await async2();
  console.log("async");
}
async function async2() {
  return new Promise((resolve, reject) => {
    resolve(1);
  }).then((val)=>{
    console.log(val)
  });
}
async1();
new Promise(function (resolve) {
  resolve();
})
  .then(function () {
    console.log("promise");
  })
  .then(function () {
    console.log("promise1");
  });
```

:::

<details> <summary>注意点</summary>
await 后面接一个promise的声明，不会加入微任务，如果他有.then这个会加入微任务里。

await 接一个async修饰函数并且return一个promise的声明，这里会占据一个微任务

return意味着外层内容是等到return结果之后才执行的，这个promise默认会执行.then从而加入微任务
</details>
