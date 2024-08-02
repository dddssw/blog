---
outline: deep
layout: doc
---

```js
let user = new Object(); // “构造函数” 的语法
let user = {};  // “字面量” 的语法

//我们可以用 delete 操作符移除属性：

delete user.age;

//我们也可以用多字词语来作为属性名，但必须给它们加上引号：

let user = {
  name: "John",
  age: 30,
  "likes birds": true  // 多词属性名必须加引号
};

```

## 方括号
对于多词属性，点操作就不能用了：

```js
// 这将提示有语法错误
user.likes birds = true
```

JavaScript 理解不了。它认为我们在处理 user.likes，然后在遇到意外的 birds 时给出了语法错误。

点符号要求 key 是有效的变量标识符。这意味着：不包含空格，不以数字开头，也不包含特殊字符（允许使用 $ 和 _）。

:::warning :warning: 点符号不能以类似的方式使用：
```
let user = {
  name: "John",
  age: 30
};

let key = "name";
alert( user.key ) // undefined
```
:::

## 属性名称限制
对象的属性名可以是保留字

:thinking: 属性名可以是任何字符串或者 symbol。`其他类型会被自动地转换为字符串`

```js
let obj = {
  0: "test" // 等同于 "0": "test"
};

// 都会输出相同的属性（数字 0 被转为字符串 "0"）
alert( obj["0"] ); // test
alert( obj[0] ); // test (相同的属性)
```

## 属性存在性判断（in）
只提一点，这个属性存的值就是undefined，此时`in`判断是true

## 遍历对象的顺序

:::tip
`整数属性`会被进行排序，其他属性则按照创建的顺序显示
:::

```js
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  // ..,
  "1": "USA"
};

for(let code in codes) {
  alert(code); // 1, 41, 44, 49
}
```
注意这里的整数属性，例如1.2，+88都是不行的

## 对象与基本数据类型的区别
1. 复制上
基本数据类型复制真的会在内存再创建一个一样的数据，而对象复制只是复制引用
2. 赋值上
赋值了对象的变量存储的不是对象本身，而是该对象“在内存中的地址” —— 换句话说就是对该对象的“引用”。
## 对象的比较
仅当两个对象为同一对象时，两者才相等。
```js
let a = {};
let b = {}; // 两个独立的对象

alert( a == b ); // false
```
## 浅拷贝
可以循环，assign,扩展运算符
## 对象中的函数
对象中的函数也被叫做方法

```js
// 方法简写看起来更好，对吧？
let user = {
  sayHi() { // 与 "sayHi: function(){...}" 一样
    alert("Hello");
  }
};
```
### 方法中的 “this”
通常，对象方法需要访问对象中存储的信息才能完成其工作。

**为了访问该对象，方法中可以使用 this 关键字。**

### “this” 不受限制
JavaScript 中的 this 可以用于任何函数，即使它不是对象的方法。

```js
function sayHi() {
  alert( this.name );
}
```

this 的值是在代码运行时计算出来的，它取决于代码上下文。

这个规则很简单：如果 obj.f() 被调用了，则 this 在 f 函数调用期间是 obj。

:::warning :rocket: 在没有对象的情况下调用：this == undefined
我们甚至可以在没有对象的情况下调用函数：

```js
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```
在这种情况下，严格模式下的 this 值为 undefined。如果我们尝试访问 this.name，将会报错。

在非严格模式的情况下，this 将会是 全局对象（浏览器中的 window，我们稍后会在 全局对象 一章中学习它）。这是一个历史行为，"use strict" 已经将其修复了。

通常这种调用是程序出错了。如果在一个函数内部有 this，那么通常意味着它是在对象上下文环境中被调用的。
:::

### 箭头函数没有自己的 “this”
举个例子，这里的 arrow() 使用的 this 来自于外部的 user.sayHi() 方法：

```js
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

::: tip :thinking: 分析
箭头函数没有this，他会继承创建他时的this(词法环境)，这里创建的时刻就是sayHi被调用的时刻，此时运行sayHi的this是user，所以箭头函数中的this也是user
:::

## 构造函数
构造函数在技术上是常规函数。不过有两个约定：

* 它们的命名以大写字母开头。
* 它们只能由 "new" 操作符来执行。

```js
function User(name) {
  this.name = name;
  this.isAdmin = false;
}

let user = new User("Jack");

alert(user.name); // Jack
alert(user.isAdmin); // false
```

当一个函数被使用 new 操作符执行时，它按照以下步骤：

1. 一个新的空对象被创建并分配给 this。
2. 函数体执行。通常它会修改 this，为其添加新的属性。
3. 返回 this 的值。

换句话说，new User(...) 做的就是类似的事情：

```js{2,8}
function User(name) {
  // this = {};（隐式创建）

  // 添加属性到 this
  this.name = name;
  this.isAdmin = false;

  // return this;（隐式返回）
}
```
### 构造函数的 return（扩展）
通常，构造器没有 return 语句。它们的任务是将所有必要的东西写入 this，并自动转换为结果。

但是，如果这有一个 return 语句，那么规则就简单了：

* 如果 return 返回的是一个对象，则返回这个对象，而不是 this。每次new返回的对象都不一样
* 如果 return 返回的是一个原始类型，则忽略。
## 垃圾回收
对于开发者来说，JavaScript 的内存管理是自动的、无形的。我们创建的原始值、对象、函数……这一切都会占用内存。

当我们不再需要某个东西时会发生什么？JavaScript 引擎如何发现它并清理它？
### 可达性
“可达”值是那些以某种方式可访问或可用的值。它们被存储在内存中。

1. 这里列出固有的可达值的基本集合，这些值明显不能被释放。

比方说：

* 当前执行的函数，它的局部变量和参数。
* 当前嵌套调用链上的其他函数、它们的局部变量和参数。
* 全局变量。
* （还有一些其他的，内部实现）
这些值被称作 根（roots）。

2. 如果一个值可以从根通过引用或者引用链进行访问，则认为该值是可达的。

比方说，如果全局变量中有一个对象，并且该对象有一个属性引用了另一个对象，则 该 对象被认为是可达的。而且它引用的内容也是可达的。下面是详细的例子。

在 JavaScript 引擎中有一个被称作 `垃圾回收器` 的东西在后台执行。它监控着所有对象的状态，并删除掉那些已经不可达的。
### 内部算法
垃圾回收的基本算法被称为 “mark-and-sweep”

定期执行以下“垃圾回收”步骤：

1. 垃圾收集器找到所有的根，并“标记”（记住）它们。
2. 然后它遍历并“标记”来自它们的所有引用。
3. 然后它遍历标记的对象并标记 它们的 引用。所有被遍历到的对象都会被记住，以免将来再次遍历到同一个对象。
4. ……如此操作，直到所有可达的（从根部）引用都被访问到。
5. 没有被标记的对象都会被删除。

例如，使我们的对象有如下的结构：

![](https://zh.javascript.info/article/garbage-collection/garbage-collection-1.svg)

我们可以清楚地看到右侧有一个“无法到达的岛屿”。现在我们来看看“标记和清除”垃圾收集器如何处理它。

第一步标记所有的根：

![](https://zh.javascript.info/article/garbage-collection/garbage-collection-2.svg)

然后，我们跟随它们的引用标记它们所引用的对象：

![](https://zh.javascript.info/article/garbage-collection/garbage-collection-3.svg)

……如果还有引用的话，继续标记：

![](https://zh.javascript.info/article/garbage-collection/garbage-collection-4.svg)

现在，无法通过这个过程访问到的对象被认为是不可达的，并且会被删除。

![](https://zh.javascript.info/article/garbage-collection/garbage-collection-5.svg)

一些优化建议：

* 分代收集（Generational collection）—— 对象被分成两组：“新的”和“旧的”。在典型的代码中，许多对象的生命周期都很短：它们出现、完成它们的工作并很快死去，因此在这种情况下跟踪新对象并将其从内存中清除是有意义的。那些长期存活的对象会变得“老旧”，并且被检查的频次也会降低。
* 增量收集（Incremental collection）—— 如果有许多对象，并且我们试图一次遍历并标记整个对象集，则可能需要一些时间，并在执行过程中带来明显的延迟。因此，引擎将现有的整个对象集拆分为多个部分，然后将这些部分逐一清除。这样就会有很多小型的垃圾收集，而不是一个大型的。这需要它们之间有额外的标记来追踪变化，但是这样会带来许多微小的延迟而不是一个大的延迟。
* 闲时收集（Idle-time collection）—— 垃圾收集器只会在 CPU 空闲时尝试运行，以减少可能对代码执行的影响。

## 可选链 "?."
如果可选链 ?. 前面的值为 undefined 或者 null，它会停止运算并返回 undefined。

变体.() .[]：

```js
let key = "firstName";

let user1 = {
  firstName: "John"
};

let user2 = null;

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined
```

## Symbol
```js
let id = Symbol();
```

创建时，我们可以给 symbol 一个描述（也称为 symbol 名），这在代码调试时非常有用：

```js
// id 是描述为 "id" 的 symbol
let id = Symbol("id");
// symbol.description
```
### 给对象设置symbol类型的键

```js
// ...
let id = Symbol("id");

user[id] = "Their id value"; //这里一定要用方括号，因为点号会被当做string类型的键
```
### 对象字面量中的 symbol

如果我们要在对象字面量 {...} 中使用 symbol，则需要使用方括号把它括起来。

```js{5}
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};
```
:::tip :rocket:
symbol会在for in 中跳过
:::

:::tip :thinking: Vue源码中symbol的使用
```js
export const FRAGMENT = Symbol(__DEV__ ? `Fragment` : ``)
export const TELEPORT = Symbol(__DEV__ ? `Teleport` : ``)
export const SUSPENSE = Symbol(__DEV__ ? `Suspense` : ``)
export const KEEP_ALIVE = Symbol(__DEV__ ? `KeepAlive` : ``)
export const BASE_TRANSITION = Symbol(__DEV__ ? `BaseTransition` : ``)
export const OPEN_BLOCK = Symbol(__DEV__ ? `openBlock` : ``)
```

这里的description只会在dev环境才会有，它的作用就是便于调试。

我们并不关心这个变量的值是什么，只需要它全局唯一，这里使用 symbol 类型再合适不过。
:::

### 系统 symbol
JavaScript 内部有很多“系统” symbol，我们可以使用它们来微调对象的各个方面。

它们都被列在了 众所周知的 symbol 表的规范中：

* Symbol.hasInstance
* Symbol.isConcatSpreadable
* Symbol.iterator
* Symbol.toPrimitive
* ……等等。

例如，Symbol.toPrimitive 允许我们将对象描述为原始值转换。我们很快就会看到它的使用。

## 对象 —— 原始值转换
所有的对象在布尔上下文（context）中均为 true
```js
if([]){
    //进入执行
}
```
### hint
"string"
对象到字符串的转换，当我们对期望一个字符串的对象执行操作时，如 “alert”：

```js
// 输出
alert(obj);

// 将对象作为属性键
anotherObj[obj] = 123;
```
"number"
对象到数字的转换，例如当我们进行数学运算时：

```js
// 显式转换
let num = Number(obj);

// 数学运算（除了二元加法）
let n = +obj; // 一元加法
let delta = date1 - date2;

// 小于/大于的比较
let greater = user1 > user2;
```

"default"
在少数情况下发生，当运算符“不确定”期望值的类型时。

例如，二元加法 + 可用于字符串（连接），也可以用于数字（相加）。因此，当二元加法得到对象类型的参数时，它将依据 "default" hint 来对其进行转换。

此外，如果对象被用于与字符串、数字或 symbol 进行 == 比较，这时到底应该进行哪种转换也不是很明确，因此使用 "default" hint。

```js
// 二元加法使用默认 hint
let total = obj1 + obj2;

// obj == number 使用默认 hint
if (user == 1) { ... };
```

像 < 和 > 这样的小于/大于比较运算符，也可以同时用于字符串和数字。不过，它们使用 “number” hint，而不是 “default”。这是历史原因。

为了进行转换，JavaScript 尝试查找并调用三个对象方法：

1. 调用 `obj[Symbol.toPrimitive](hint)` —— 带有 symbol 键 Symbol.toPrimitive（系统 symbol）的方法，如果这个方法存在的话，
2. 否则，如果 hint 是 "string" —— 尝试调用 obj.toString() 或 obj.valueOf()，无论哪个存在。
3. 否则，如果 hint 是 "number" 或 "default" —— 尝试调用 obj.valueOf() 或 obj.toString()，无论哪个存在。

:::tip :rocket: Symbol.toPrimitive
```js
obj[Symbol.toPrimitive] = function(hint) {
  // 这里是将此对象转换为原始值的代码
  // 它必须返回一个原始值
  // hint = "string"、"number" 或 "default" 中的一个
} 
```
***
```js
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 转换演示：
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```
:::

:::tip :rocket: toString/valueOf
这些方法必须返回一个原始值。如果 toString 或 valueOf 返回了一个对象，那么返回值会被忽略（和这里没有方法的时候相同）。

默认情况下，普通对象具有 toString 和 valueOf 方法：

* toString 方法返回一个字符串 "[object Object]"。
* valueOf 方法返回对象自身。

```js
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
```

重写

```js
let user = {
  name: "John",
  money: 1000,

  // 对于 hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // 对于 hint="number" 或 "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```
:::