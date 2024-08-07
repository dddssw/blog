---
outline: deep
layout: doc
---
* “var” 声明的变量只有函数作用域和全局作用域，没有块级作用域
* “var” 允许重新声明
* 声明会被提升，但是赋值不会(函数声明也会自动提升,函数表达式不会)
* 在浏览器中，使用 var（而不是 let/const！）声明的全局函数和变量会成为全局对象的属性。
```js
function sayHi() {
  alert(phrase);

  var phrase = "Hello";
}

sayHi();
```
声明在函数刚开始执行的时候（“提升”）就被处理了，但是赋值操作始终是在它出现的地方才起作用。所以这段代码实际上是这样工作的：
```js
function sayHi() {
  var phrase; // 在函数刚开始时进行变量声明

  alert(phrase); // undefined

  phrase = "Hello"; // ……赋值 — 当程序执行到这一行时。
}

sayHi();
```

## IIFE
在之前，JavaScript 中只有 var 这一种声明变量的方式，并且这种方式声明的变量没有块级作用域，程序员们就发明了一种模仿块级作用域的方法。这种方法被称为“立即调用函数表达式”（immediately-invoked function expressions，IIFE）。
```js
(function() {

  var message = "Hello";

  alert(message); // Hello

})();
```

## 全局对象
全局对象提供可在任何地方使用的变量和函数。默认情况下，这些全局变量内建于语言或环境中。

在浏览器中，它的名字是 “window”，对 Node.js 而言，它的名字是 “global”，其它环境可能用的是别的名字。

最近，globalThis 被作为全局对象的标准名称加入到了 JavaScript 中，所有环境都应该支持该名称。所有主流浏览器都支持它。

假设我们的环境是浏览器，我们将在这儿使用 “window”。如果你的脚本可能会用来在其他环境中运行，则最好使用 globalThis。

全局对象的所有属性都可以被直接访问：
```js
alert("Hello");
// 等同于
window.alert("Hello");
```

## 使用 polyfills
我们使用全局对象来测试对现代语言功能的支持。

例如，测试是否存在内建的 Promise 对象（在版本特别旧的浏览器中不存在）：

if (!window.Promise) {
  alert("Your browser is really old!");
}