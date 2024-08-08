---
outline: deep
layout: doc
---
闭包是指使用一个特殊的属性 [[Environment]] 来记录函数自身的创建时的环境的函数。它具体指向了函数创建时的词法环境

在 JavaScript 中，所有函数都是天生闭包的（只有一个例外，"new Function"）
## 词法环境
在 JavaScript 中，每个运行的函数，代码块 {...} 以及整个脚本，都有一个被称为 **词法环境（Lexical Environment）** 的内部（隐藏）的关联对象。

词法环境对象由两部分组成：

* **环境记录（Environment Record）** —— 一个存储所有局部变量作为其属性（包括一些其他信息，例如 this 的值）的对象。
* 对 **外部词法环境** 的引用，与外部代码相关联。

当代码要访问一个变量时 —— 首先会搜索内部词法环境，然后搜索外部环境，然后搜索更外部的环境，以此类推，直到全局词法环境。

:::tip :rocket:
所有的函数在“诞生”时都会记住创建它们的词法环境。从技术上讲，这里没有什么魔法：所有函数都有名为 [[Environment]] 的隐藏属性，该属性保存了对创建该函数的词法环境的引用。

函数记住它创建于何处的方式，与函数被在哪儿调用无关
:::


:::warning :warning: 变量与函数初始化上有区别
![](https://zh.javascript.info/article/closure/closure-variable-phrase.svg)

当脚本开始运行，词法环境预先填充了所有声明的变量。

最初，它们处于“未初始化（Uninitialized）”状态。这是一种特殊的内部状态，这意味着引擎知道变量，但是在用 let 声明前，不能引用它。几乎就像变量不存在一样。

然后 let phrase 定义出现了。它尚未被赋值，因此它的值为 undefined。从这一刻起，我们就可以使用变量了。

phrase 被赋予了一个值。

phrase 的值被修改。

一个函数其实也是一个值，就像变量一样。

**不同之处在于函数声明的初始化会被立即完成。**

当创建了一个词法环境（Lexical Environment）时，函数声明会立即变为即用型函数（不像 let 那样直到声明处才可用）。

![alt text](https://zh.javascript.info/article/closure/closure-function-declaration.svg)

正常来说，这种行为仅适用于函数声明，而不适用于我们将函数分配给变量的函数表达式，例如 let say = function(name)...。

```js
console.log(a)
let a = 123  //这会发生什么
```
:::

:::details 答案
Error: Cannot access 'a' before initialization

而不是 ReferenceError: a is not defined 

如果这里是var就是undefined了

从程序执行进入代码块（或函数）的那一刻起，变量就开始进入“未初始化”状态。它一直保持未初始化状态，直至程序执行到相应的 let 语句。

换句话说，一个变量从技术的角度来讲是存在的，但是在 let 之前还不能使用。

变量暂时无法使用的区域（从代码块的开始到 let）有时被称为“死区”。
:::
## 内存泄漏
通常，函数调用完成后，会将词法环境和其中的所有变量从内存中删除。因为现在没有任何对它们的引用了。与 JavaScript 中的任何其他对象一样，词法环境仅在可达时才会被保留在内存中。

但是，如果有一个嵌套的函数在函数结束后仍可达，则它将具有引用词法环境的 [[Environment]] 属性。

在下面这个例子中，即使在（外部）函数执行完成后，它的词法环境仍然可达。因此，此词法环境仍然有效。

例如：
```js
function f() {
  let value = 123;

  return function() {
    alert(value);
  }
}

let g = f(); // g.[[Environment]] 存储了对相应 f() 调用的词法环境的引用
```
请注意，如果多次调用 f()，并且返回的函数被保存，那么所有相应的词法环境对象也会保留在内存中。下面代码中有三个这样的函数：
```js
function f() {
  let value = Math.random();

  return function() { alert(value); };
}

// 数组中的 3 个函数，每个都与来自对应的 f() 的词法环境相关联
let arr = [f(), f(), f()];
```
当词法环境对象变得不可达时，它就会死去（就像其他任何对象一样）。换句话说，它仅在至少有一个嵌套函数引用它时才存在。这会导致内存泄漏

## 习题
函数会选择最新的内容吗？

函数 sayHi 使用外部变量。当函数运行时，将使用哪个值？

```js
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); // 会显示什么："John" 还是 "Pete"？
```
:::details 答案
答案：Pete。

函数将从内到外依次在对应的词法环境中寻找目标变量，它使用最新的值。

旧变量值不会保存在任何地方。当一个函数想要一个变量时，它会从自己的词法环境或外部词法环境中获取当前值。
:::

Counter 是独立的吗？

在这儿我们用相同的 makeCounter 函数创建了两个计数器（counters）：counter 和 counter2。

它们是独立的吗？第二个 counter 会显示什么？0,1 或 2,3 还是其他？
```js
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
let counter2 = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1

alert( counter2() ); // ?
alert( counter2() ); // ?
```

:::details 答案
答案是：0，1。

函数 counter 和 counter2 是通过 makeCounter 的不同调用创建的。

因此，它们具有独立的外部词法环境，每一个都有自己的 count。
:::

```js
"use strict";

let phrase = "Hello";

if (true) {
  let user = "John";

  function sayHi() {
    alert(`${phrase}, ${user}`);
  }
}

sayHi();//alert什么
```
:::details 答案
ReferenceError: sayHi is not defined

如果不是严格模式不会报错
:::

闭包 sum

编写一个像 sum(a)(b) = a+b 这样工作的 sum 函数。

是的，就是这种通过双括号的方式（并不是错误）。

举个例子：

sum(1)(2) = 3  
sum(5)(-1) = 4

:::details 答案
为了使第二个括号有效，第一个（括号）必须返回一个函数。

就像这样：
```js
function sum(a) {

  return function(b) {
    return a + b; // 从外部词法环境获得 "a"
  };

}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1) ); // 4
```
:::