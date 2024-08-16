---
outline: deep
layout: doc
---
## 简介
JavaScript 不仅可以在浏览器中执行，也可以在服务端执行，甚至可以在任意搭载了 JavaScript 引擎 的设备中执行。

比如chrome的js引擎是 **V8**,渲染引擎是 **Blink**

:::tip 引擎是如何工作的？
引擎很复杂，但是基本原理很简单。

1. 引擎（如果是浏览器，则引擎被嵌入在其中）读取（“解析”）脚本。
2. 然后，引擎将脚本转化（“编译”）为机器语言。
3. 然后，机器代码快速地执行。
引擎会对流程中的每个阶段都进行优化。它甚至可以在编译的脚本运行时监视它，分析流经该脚本的数据，并根据获得的信息进一步优化机器代码。
:::

JavaScript 的能力很大程度上取决于它运行的环境。例如，Node.js 支持允许 JavaScript 读取/写入任意文件，执行网络请求等的函数。

浏览器中的 JavaScript 可以做与网页操作、用户交互和 Web 服务器相关的所有事情。

***

浏览器中的 JavaScript 不能操作硬盘上任何文件， 不同源的Tab一般不能相互通信， 为了解决“同源策略”问题，两个标签页必须**都**包含一些处理这个问题的特定的 JavaScript 代码，并均允许数据交换

## 上层语言

这些语言在浏览器中执行之前，都会被 编译（转化）成 JavaScript

1. TypeScript 专注于添加“严格的数据类型”以简化开发，以更好地支持复杂系统的开发。由微软开发。
2. Flow 也添加了数据类型，但是以一种不同的方式。由 Facebook 开发。
3. Dart 是一门独立的语言。它拥有自己的引擎，该引擎可以在非浏览器环境中运行（例如手机应用），它也可以被编译成 JavaScript。由 Google 开发。
4. Brython 是一个 Python 到 JavaScript 的转译器，让我们可以在不使用 JavaScript 的情况下，以纯 Python 编写应用程序。
5. Kotlin 是一个现代、简洁且安全的编程语言，编写出的应用程序可以在浏览器和 Node 环境中运行。

## 内联/外联脚本

代码在script标签内编写/代码通过src链接来

这两种写法不能共存

## strict mode

长久以来，JavaScript 不断向前发展且并未带来任何兼容性问题。新的特性被加入，旧的功能也没有改变。

这么做有利于兼容旧代码，但缺点是 JavaScript 创造者的任何错误或不完善的决定也将永远被保留在 JavaScript 语言中。

这种情况一直持续到 2009 年 ECMAScript 5 (ES5) 的出现。ES5 规范增加了新的语言特性并且修改了一些已经存在的特性。为了保证旧的功能能够使用，大部分的修改是默认不生效的。你需要一个特殊的指令 —— "use strict" 来明确地激活这些特性。

浏览器控制台默认是**不**开启strict mode

```js
'use strict'; <Shift+Enter 换行>
//  ...你的代码
<按下 Enter 以运行>
```
请确保 "use strict" 出现在脚本的最顶部，否则严格模式可能无法启用。