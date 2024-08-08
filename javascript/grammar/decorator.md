---
outline: deep
layout: doc
---
**装饰器（decorator）** 一个特殊的函数，它接受另一个函数并改变它的行为。

例如

```js
function slow(x) {
  // 这里可能会有重负载的 CPU 密集型工作
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) {    // 如果缓存中有对应的结果
      return cache.get(x); // 从缓存中读取结果
    }

    let result = func(x);  // 否则就调用 func

    cache.set(x, result);  // 然后将结果缓存（记住）下来
    return result;
  };
}

slow = cachingDecorator(slow);

alert( slow(1) ); // slow(1) 被缓存下来了，并返回结果
alert( "Again: " + slow(1) ); // 返回缓存中的 slow(1) 的结果

alert( slow(2) ); // slow(2) 被缓存下来了，并返回结果
alert( "Again: " + slow(2) ); // 返回缓存中的 slow(2) 的结果
```

cachingDecorator(func) 的结果是一个“包装器”：function(x) 将 func(x) 的调用“包装”到缓存逻辑中：

![](https://zh.javascript.info/article/call-apply-decorators/decorator-makecaching-wrapper.svg)

从外部代码来看，包装的 slow 函数执行的仍然是与之前相同的操作。它只是在其行为上添加了缓存功能。

总而言之，使用分离的 cachingDecorator 而不是改变 slow 本身的代码有几个好处：

* cachingDecorator 是可重用的。我们可以将它应用于另一个函数。
* 缓存逻辑是独立的，它没有增加 slow 本身的复杂性（如果有的话）。
* 如果需要，我们可以组合多个装饰器（其他装饰器将遵循同样的逻辑）。

## call
```js
func.call(context, arg1, arg2, ...)
```
例子
```js{21}
// 我们将对 worker.slow 的结果进行缓存
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // 可怕的 CPU 过载任务
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

// 和之前例子中的代码相同
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x); // (**)
    cache.set(x, result);
    return result;
  };
}

alert( worker.slow(1) ); // 原始方法有效

worker.slow = cachingDecorator(worker.slow); // 现在对其进行缓存

alert( worker.slow(2) ); // Error: Cannot read property 'someMethod' of undefined
```

原因是包装器将原始函数调用为 (**) 行中的 func(x)。并且，当这样调用时，函数将得到 this = undefined。

只需要修改这一行

```js
 let result = func.call(this, x); // 现在 "this" 被正确地传递了
```
1. 在经过装饰之后，worker.slow 现在是包装器 function (x) { ... }。
2. 因此，当 worker.slow(2) 执行时，包装器将 2 作为参数，并且 this=worker（它是点符号 . 之前的对象）。
3. 在包装器内部，假设结果尚未缓存，func.call(this, x) 将当前的 this（=worker）和当前的参数（=2）传递给原始方法。

## apply
我们可以使用 func.apply(this, arguments) 代替 func.call(this, ...arguments)。

内建方法 func.apply 的语法是：
```js
func.apply(context, args)
```
它运行 func 设置 this=context，并使用类数组对象 args 作为参数列表（arguments）。

call 和 apply 之间唯一的语法区别是，call 期望一个参数列表，而 apply 期望一个包含这些参数的类数组对象。因此，这两个调用几乎是等效的：
```js
func.call(context, ...args);
func.apply(context, args);
```

将所有参数连同上下文一起传递给另一个函数被称为“**呼叫转移**（call forwarding）”。

这是它的最简形式：

```js
let wrapper = function() {
  return func.apply(this, arguments);
};
```
## bind
基本的语法是：
```js
// 稍后将会有更复杂的语法
let boundFunc = func.bind(context);
```
将使用这个函数boundFunc

示例
```js
let user = {
  firstName: "John"
};

function func() {
  alert(this.firstName);
}

let funcUser = func.bind(user);
funcUser(); // John
```
丢失this

```js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!
```
正如我们所看到的，输出没有像 this.firstName 那样显示 “John”，而显示了 undefined！

这是因为 setTimeout 获取到了函数 user.sayHi，但它和对象分离开了。最后一行可以被重写为：
```js
let f = user.sayHi;
setTimeout(f, 1000); // 丢失了 user 上下文
```
可以使用箭头函数
```js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```
看起来不错，但是我们的代码结构中出现了一个小漏洞。

如果在 setTimeout 触发之前（有一秒的延迟！）user 的值改变了怎么办？那么，突然间，它将调用错误的对象！可以使用call来解决这个问题

练习
```js
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
```
:::details :thinking: 答案
john

绑定函数的上下文是硬绑定（hard-fixed）的。没有办法再修改它。
:::