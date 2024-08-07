---
outline: deep
layout: doc
---
## rest

我们可以在函数定义中声明一个数组来收集参数。语法是这样的：...变量名，这将会声明一个数组并指定其名称，其中存有剩余的参数。这三个点的语义就是“收集剩余的参数并存进指定数组中”。

```js
function sumAll(...args) { // 数组名为 args
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```

:::warning :warning:
Rest 参数必须放到参数列表的末尾

Rest 参数会收集剩余的所有参数，因此下面这种用法没有意义，并且会导致错误：
```js
function f(arg1, ...rest, arg2) { // arg2 在 ...rest 后面？！
  // error
}
```
:::

在过去，JavaScript 中不支持 rest 参数语法，而使用 arguments 是获取函数所有参数的唯一方法。

但缺点是，尽管 arguments 是一个类数组，也是可迭代对象，但它终究不是数组。它不支持数组方法，因此我们不能调用 arguments.map(...) 等方法。

此外，它始终包含所有参数，我们不能像使用 rest 参数那样只截取参数的一部分。

:::tip :rocket:
箭头函数没有 "arguments"
如果我们在箭头函数中访问 arguments，访问到的 arguments 并不属于箭头函数，而是属于箭头函数外部的“普通”函数。

举个例子：

```js
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```
我们已经知道，箭头函数没有自身的 this。现在我们知道了它们也没有特殊的 arguments 对象。
:::

## spread
**复制array/object**

```js
let arrCopy = [...arr]; // 将数组 spread 到参数列表中
                        // 然后将结果放到一个新数组
```

这种方式比使用 let arrCopy = Object.assign([], arr) 复制数组，或使用 let objCopy = Object.assign({}, obj) 复制对象来说更为简便。因此，只要情况允许，我们倾向于使用它。

***

当在函数调用中使用 ...arr 时，它会把可迭代对象 arr “展开”到参数列表中。
```js
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5（spread 语法把数组转换为参数列表）
```
```js
let str = "Hello";

// Array.from 将可迭代对象转换为数组
alert( Array.from(str) ); // H,e,l,l,o
```

运行结果与 [...str] 相同。

不过 Array.from(obj) 和 [...obj] 存在一个细微的差别：

* Array.from 适用于类数组对象也适用于可迭代对象。
* Spread 语法只适用于可迭代对象。

因此，对于将一些“东西”转换为数组的任务，Array.from 往往更通用。

## **总结**

当我们在代码中看到 "..." 时，它要么是 rest 参数，要么是 spread 语法。

有一个简单的方法可以区分它们：

* 若 ... 出现在函数参数列表的最后，那么它就是 rest 参数，它会把参数列表中剩余的参数收集到一个数组中。
* 若 ... 出现在函数调用或类似的表达式中，那它就是 spread 语法，它会把一个数组展开为列表。