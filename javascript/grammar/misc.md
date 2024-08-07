---
outline: deep
layout: doc
---
函数继承与对象,所以函数上也能添加属性
```js
function sayHi() {
  alert("Hi");

  // 计算调用次数
  sayHi.counter++;
}
sayHi.counter = 0; // 初始值

sayHi(); // Hi
sayHi(); // Hi

alert( `Called ${sayHi.counter} times` ); // Called 2 times
```

函数属性有时会用来替代闭包

两者最大的不同就是如果 count 的值位于外层（函数）变量中，那么外部的代码无法访问到它，只有嵌套的那些函数可以修改它。也就是透明的

## 命名函数表达式(NFE)
```js
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};
```
我们这里得到了什么吗？为它添加一个 "func" 名字的目的是什么？

首先请注意，它仍然是一个函数表达式。在 function 后面加一个名字 "func" 没有使它成为一个函数声明，因为它仍然是作为赋值表达式中的一部分被创建的。

添加这个名字当然也没有打破任何东西。

关于 func 有两个特殊的地方，这就是添加它的原因：

* 它允许函数在内部引用自己。
* 它在函数外是不可见的。

```js
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // 使用 func 再次调用函数自身
  }
};

sayHi(); // Hello, Guest

// 但这不工作：
func(); // Error, func is not defined（在函数外不可见）
```

我们为什么使用 func 呢？为什么不直接使用 sayHi 进行嵌套调用？

当然，在大多数情况下我们可以这样做：

```js
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest");
  }
};
```
上面这段代码的问题在于 sayHi 的值可能会被函数外部的代码改变。如果该函数被赋值给另外一个变量（译注：也就是原变量被修改），那么函数就会开始报错：
```js
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest"); // Error: sayHi is not a function
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Error，嵌套调用 sayHi 不再有效！
```
发生这种情况是因为该函数从它的外部词法环境获取 sayHi。没有局部的 sayHi 了，所以使用外部变量。而当调用时，外部的 sayHi 是 null。

我们给函数表达式添加的可选的名字，正是用来解决这类问题的。
## "new Function" 语法
还有一种创建函数的方法

```js
let func = new Function ([arg1, arg2, ...argN], functionBody);
```

这是一个带有两个参数的函数：
```js
let sum = new Function('a', 'b', 'return a + b');

alert( sum(1, 2) ); // 3
```
这里有一个没有参数的函数，只有函数体：
```js
let sayHi = new Function('alert("Hello")');

sayHi(); // Hello
```
new Function 允许我们将任意字符串变为函数。例如，我们可以从服务器接收一个新的函数并执行它

new Function 创建一个函数，那么该函数的 [[Environment]] 并不指向当前的词法环境，而是指向全局环境。

因此，此类函数无法访问外部（outer）变量，只能访问全局变量。
```js
function getFunc() {
  let value = "test";

  let func = new Function('alert(value)');

  return func;
}

getFunc()(); // error: value is not defined
```
将其与常规行为进行比较：
```js
function getFunc() {
  let value = "test";

  let func = function() { alert(value); };

  return func;
}

getFunc()(); // "test"，从 getFunc 的词法环境中获取的
```

:::tip :thinking: 这种特性看起来有点奇怪，不过在实际中却非常实用
在将 JavaScript 发布到生产环境之前，需要使用 压缩程序（minifier） 对其进行压缩 —— 一个特殊的程序，通过删除多余的注释和空格等压缩代码 —— 更重要的是，将局部变量命名为较短的变量。

例如，如果一个函数有 let userName，压缩程序会把它替换为 let a（如果 a 已被占用了，那就使用其他字符），剩余的局部变量也会被进行类似的替换。一般来说这样的替换是安全的，毕竟这些变量是函数内的局部变量，函数外的任何东西都无法访问它。在函数内部，压缩程序会替换所有使用了这些变量的代码。压缩程序很聪明，它会分析代码的结构，而不是呆板地查找然后替换，因此它不会“破坏”你的程序。

但是在这种情况下，如果使 new Function 可以访问自身函数以外的变量，它也很有可能无法找到重命名的 userName，这是因为新函数的创建发生在代码压缩以后，变量名已经被替换了。

即使我们可以在 new Function 中访问外部词法环境，我们也会受挫于压缩程序。

此外，这样的代码在架构上很差并且容易出错。

当我们需要向 new Function 创建出的新函数传递数据时，我们必须显式地通过参数进行传递。
:::