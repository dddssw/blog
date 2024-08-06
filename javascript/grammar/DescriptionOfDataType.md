---
outline: deep
layout: doc
---

:::tip :thinking: 首先思考一个问题
为什么基本数据类型也能像对象一样调用方法,例如 string 的 slice 方法
:::

其实在需要使用时会创建提供额外功能的特殊“对象包装器”，使用后即被销毁。

“对象包装器”对于每种原始类型都是不同的，它们被称为 String、Number、Boolean、Symbol 和 BigInt。因此，它们提供了不同的方法。

下面会怎么工作

```js{3}
let str = "Hello";

str.test = 5;

alert(str.test);
```

:::details answer
根据你是否开启了严格模式 use strict，会得到如下结果：

- undefined（非严格模式）
- 报错（严格模式）。

当访问 str 的属性时，一个“对象包装器”被创建了。  
在严格模式下，向其写入内容会报错。  
否则，将继续执行带有属性的操作，该对象将获得 test 属性，但是此后，“对象包装器”将消失，因此在最后一行，str 并没有该属性的踪迹。
:::

## Number

### 常用方法

舍入（rounding）是使用数字时最常用的操作之一。

这里有几个对数字进行舍入的内建函数,都是变成整数：

Math.floor  
向下舍入：3.1 变成 3，-1.1 变成 -2。

Math.ceil  
向上舍入：3.1 变成 4，-1.1 变成 -1。

Math.round  
向最近的整数舍入：3.1 变成 3，3.6 变成 4，中间值 3.5 变成 4。

Math.trunc（IE 浏览器不支持这个方法）  
移除小数点后的所有内容而没有舍入：3.1 变成 3，-1.1 变成 -1。

如果我们想将数字舍入到小数点后 n 位

函数 toFixed(n) 将数字舍入到小数点后 n 位，并以字符串形式返回结果,与 Math.round 一样四舍五入.

### 不精确的计算 0.1+0.2

就像在十进制中无法精确表示 1/3, 二进制中也会出现相同的情况

使用二进制数字系统无法 精确 存储 0.1 或 0.2，就像没有办法将三分之一存储为十进制小数一样。

IEEE-754 数字格式通过将数字舍入到最接近的可能数字来解决此问题。这些舍入规则通常不允许我们看到“极小的精度损失”，但是它确实存在。

我们可以看到：

```js
alert((0.1).toFixed(20)); // 0.10000000000000000555
```

当我们对两个数字进行求和时，它们的“精度损失”会叠加起来。

这就是为什么 0.1 + 0.2 不等于 0.3。

我们能解决这个问题吗？当然，最可靠的方法是借助方法 toFixed(n) 对结果进行舍入：

```js
let sum = 0.1 + 0.2;
alert(sum.toFixed(2)); // "0.30"
```

---

:::warning :thinking: 思考为什么会出现这种情况

```js
alert((1.35).toFixed(1)); // 1.4
alert((6.35).toFixed(1)); // 6.3
```

:::details :rocket: 原因
在内部，6.35 的小数部分是一个无限的二进制。在这种情况下，它的存储会造成精度损失。

让我们来看看：

```js
alert((6.35).toFixed(20)); // 6.34999999999999964473
```

精度损失可能会导致数字的增加和减小。在这种特殊的情况下，数字变小了一点，这就是它向下舍入的原因。

那么 1.35 会怎样呢？

```js
alert((1.35).toFixed(20)); // 1.35000000000000008882
```

在这里，精度损失使得这个数字稍微大了一些，因此其向上舍入。
:::

**如果我们希望以正确的方式进行舍入，我们应该如何解决 6.35 的舍入问题呢？**

在进行舍入前，我们应该使其更接近整数：

```js
alert((6.35 * 10).toFixed(20)); // 63.50000000000000000000
```

请注意，63.5 完全没有精度损失。这是因为小数部分 0.5 实际上是 1/2。以 2 的整数次幂为分母的小数在二进制数字系统中可以被精确地表示，现在我们可以对它进行舍入：

```js
alert(Math.round(6.35 * 10) / 10); // 6.35 -> 63.5 -> 64(rounded) -> 6.4
```

## String

查找子字符串

### str.indexOf(substr, pos)

它从给定位置 pos 开始，在 str 中查找 substr，如果没有找到，则返回 -1，否则返回匹配成功的位置。

如果我们对所有存在位置都感兴趣，可以在一个循环中使用 indexOf。每一次新的调用都发生在上一匹配位置之后：

```js
let str = "As sly as a fox, as strong as an ox";

let target = "as"; // 这是我们要查找的目标

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert(`Found at ${foundPos}`);
  pos = foundPos + 1; // 继续从下一个位置查找
}
```

:::tip :rocket:
str.lastIndexOf(substr, pos)
还有一个类似的方法 str.lastIndexOf(substr, position)，它从字符串的末尾开始搜索到开头。

它会以相反的顺序列出这些事件。
:::

:::warning :rocket: 按位（bitwise）NOT 技巧
只有当 n == -1 时，~n 才为零

```js
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert( 'Found it!' ); // 正常运行
}

只要记住：if (~str.indexOf(...)) 读作 “if found”。
```

:::

### includes，startsWith，endsWith

更现代的方法 str.includes(substr, pos) 根据 str 中是否包含 substr 来返回 true/false。

第二个可选参数是开始搜索的起始位置

如果我们需要检测匹配，但不需要它的位置，那么这是正确的选择：

### 获取子字符串

| 方法                    | 选择方式                                    | 负值参数处理                            |
| ----------------------- | ------------------------------------------- | --------------------------------------- |
| `slice(start, end)`     | 从 `start` 到 `end`（不包含 `end`）         | 允许                                    |
| `substring(start, end)` | 从 `start` 到 `end`（不包含 `end`）         | 负值被视为 0                            |
| `substr(start, length)` | 从 `start` 开始获取长度为 `length` 的字符串 | 允许 `start` 为负数，表示从末尾开始计算 |

### 代理对

所有常用的字符都是一个 2 字节的代码.但 2 字节只允许 65536 个组合，这对于表示每个可能的符号是不够的。所以稀有的符号被称为“代理对”的一对 2 字节的符号编码。

这些符号的长度是 2：

```js
alert("𝒳".length); // 2，大写数学符号 X
alert("😂".length); // 2，笑哭表情
alert("𩷶".length); // 2，罕见的中国象形文字
```

```js
alert("𝒳"[0]); // 奇怪的符号……
alert("𝒳"[1]); // ……代理对的一块
```

请注意，代理对的各部分没有任何意义。因此，上述示例中的 alert 显示的实际上是垃圾信息。

## 数组

使用 “at” 获取最后一个元素

arr.at(i)：

- 如果 i >= 0，则与 arr[i] 完全相同。
- 对于 i 为负数的情况，它则从数组的尾部向前数。

### 内部

数组是一种特殊的对象。使用方括号来访问属性 arr[0] 实际上是来自于对象的语法。它其实与 obj[key] 相同，其中 arr 是对象，而数字用作键（key）。

:::tip :rocrkt:
清空数组最简单的方法就是：arr.length = 0;。
:::

### toString

数组有自己的 toString 方法的实现，会返回以逗号隔开的元素列表。

例如：

```js
let arr = [1, 2, 3];

alert(arr); // 1,2,3
alert(String(arr) === "1,2,3"); // true
```

此外，我们试试运行一下这个：

```js
alert([] + 1); // "1"
alert([1] + 1); // "11"
alert([1, 2] + 1); // "1,21"
```

数组没有 Symbol.toPrimitive，也没有 valueOf，它们只能执行 toString 进行转换，所以这里 [] 就变成了一个空字符串，[1] 变成了 "1"，[1,2] 变成了 "1,2"。

:::tip :thinking: 对象转化成原始值

```js
alert(0 == []); // true

alert("0" == []); // false
```

:::

## 数组方法
### splice
```js
arr.splice(start[, deleteCount, elem1, ..., elemN])
```
**它从索引 start 开始修改 arr：删除 deleteCount 个元素并在当前位置插入 elem1, ..., elemN。最后返回被删除的元素所组成的数组。**
```js
let arr = ["I", "study", "JavaScript"];

// 从索引 2 开始
// 删除 0 个元素
// 然后插入 "complex" 和 "language"
arr.splice(2, 0, "complex", "language");

alert( arr ); // "I", "study", "complex", "language", "JavaScript"
```
:::tip :rocket: 允许负向索引
在这里和其他数组方法中，负向索引都是被允许的。它们从数组末尾计算位置，如下所示：
```js
let arr = [1, 2, 5];

// 从索引 -1（尾端前一位）
// 删除 0 个元素，
// 然后插入 3 和 4
arr.splice(-1, 0, 3, 4);

alert( arr ); // 1,2,3,4,5
```
:::
### slice
```js
arr.slice([start], [end])
```
**它会返回一个新数组**，将所有从索引 start 到 end（不包括 end）的数组项复制到一个新的数组。start 和 end 都可以是负数，在这种情况下，从末尾计算索引。

它和字符串的 str.slice 方法有点像，就是把子字符串替换成子数组。
```js
let arr = ["t", "e", "s", "t"];

alert( arr.slice(1, 3) ); // e,s（复制从位置 1 到位置 3 的元素）

alert( arr.slice(-2) ); // s,t（复制从位置 -2 到尾端的元素）
```
我们也可以不带参数地调用它：arr.slice() 会创建一个 arr 的副本。其通常用于获取副本，以进行不影响原始数组的进一步转换。
### concat
**创建一个新数组**，其中包含来自于其他数组和其他项的值

它接受任意数量的参数 —— 数组或值都可以。

:::tip :rocket: 但对于类数组的处理
```js
let arr = [1, 2];

let arrayLike = {
  0: "something",
  length: 1
};

alert( arr.concat(arrayLike) ); // 1,2,[object Object]
```
***
……但是，如果类数组对象具有 Symbol.isConcatSpreadable 属性，那么它就会被 concat 当作一个数组来处理：此对象中的元素将被添加：

```js
let arr = [1, 2];

let arrayLike = {
  0: "something",
  1: "else",
  [Symbol.isConcatSpreadable]: true,
  length: 2
};

alert( arr.concat(arrayLike) ); // 1,2,something,else
```
:::
## Iterable object（可迭代对象）

可迭代（Iterable） 对象是数组的泛化。这个概念是说任何对象都可以被定制为可在 for..of 循环中使用的对象。

### Symbol.iterator

对于普通对象不是可迭代的.但只需要实现 Symbol.iterator 就是可迭代

```js
let range = {
  from: 1,
  to: 5,
};

// 我们希望 for..of 这样运行：
// for(let num of range) ... num=1,2,3,4,5
```

为了让 range 对象可迭代（也就让 for..of 可以运行）我们需要为对象添加一个名为 Symbol.iterator 的方法（一个专门用于使对象可迭代的内建 symbol）。

1. 当 for..of 循环启动时，它会调用这个方法（如果没找到，就会报错）。这个方法必须返回一个 迭代器（iterator） —— 一个有 next 方法的对象。
2. 从此开始，for..of 仅适用于这个被返回的对象。
3. 当 for..of 循环希望取得下一个数值，它就调用这个对象的 next() 方法。
4. next() 方法返回的结果的格式必须是 {done: Boolean, value: any}，当 done=true 时，表示循环结束，否则 value 是下一个值。

:::details :thinking: 尝试一下

```js
let range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let start = this.from;
    let last = this.to;
    return {
      next() {
        if (start < last) {
          return { done: false, value: start++ };
        } else {
          return { done: true };
        }
      },
    };
  },
};

// 我们希望 for..of 这样运行：
for (let num of range) {
  console.log(num);
}
```
:::

### 字符串是可迭代的
对于代理对（surrogate pairs），它也能正常工作！
```js
let str = '𝒳😂';
for (let char of str) {
    alert( char ); // 𝒳，然后是 😂
}
```

### 可迭代（iterable）和类数组（array-like）
* Iterable 如上所述，是实现了 Symbol.iterator 方法的对象。
* Array-like 是有索引和 length 属性的对象，所以它们看起来很像数组

一个可迭代对象也许不是类数组对象。反之亦然，类数组对象可能不可迭代。

可以两者兼有的,例如，字符串即是可迭代的（for..of 对它们有效），又是类数组的（它们有数值索引和 length 属性）。

:::tip :thinking: 思考
可迭代对象和类数组对象通常都 不是数组，它们没有 push 和 pop 等方法。如果我们有一个这样的对象，并想像数组那样操作它，那就非常不方便。例如，我们想使用数组方法操作 range，应该如何实现呢？
:::

###　Array.from
有一个全局方法 Array.from 可以接受一个可迭代或类数组的值，并从中获取一个“真正的”数组。然后我们就可以对其调用数组方法了。

Array.from 方法接受对象，检查它是一个可迭代对象或类数组对象，然后创建一个新数组，并将该对象的所有元素复制到这个新数组。

与 str.split 方法不同，它依赖于字符串的可迭代特性。因此，就像 for..of 一样，可以正确地处理代理对（surrogate pair）。（译注：代理对也就是 UTF-16 扩展字符。）

## Map
:::tip :thinking: Map 是怎么比较键的？
Map 使用 SameValueZero 算法来比较键是否相等。它和严格等于 === 差不多，但区别是 NaN 被看成是等于 NaN。所以 NaN 也可以被用作键。

这个算法不能被改变或者自定义。
:::
### Map 迭代
* map.keys() —— 遍历并返回一个包含所有键的`可迭代对象`，
* map.values() —— 遍历并返回一个包含所有值的`可迭代对象`，
* map.entries() —— 遍历并返回一个包含所有实体 [key, value] 的可迭代对象，for..of 在默认情况下使用的就是这个。

除此之外，Map 有内建的 forEach 方法

### 从对象创建 Map 
当创建一个 Map 后，我们可以传入一个带有键值对的数组（或其它可迭代对象）来进行初始化，如下所示：

```js
// 键值对 [key, value] 数组
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);

alert( map.get('1') ); // str1
```
如果我们想从一个已有的普通对象（plain object）来创建一个 Map，那么我们可以使用内建方法 Object.entries(obj)，该方法返回对象的键/值对数组，该数组格式完全按照 Map 所需的格式。

所以可以像下面这样从一个对象创建一个 Map：

```js
let obj = {
  name: "John",
  age: 30
};

let map = new Map(Object.entries(obj));

alert( map.get('name') ); // John
```
这里，Object.entries 返回键/值对数组：[ ["name","John"], ["age", 30] ]。这就是 Map 所需要的格式。
### 从 Map 创建对象
我们刚刚已经学习了如何使用 Object.entries(obj) 从普通对象（plain object）创建 Map。

Object.fromEntries 方法的作用是相反的：给定一个具有 [key, value] 键值对的数组，它会根据给定数组创建一个对象：

```js
let prices = Object.fromEntries([
  ['banana', 1],
  ['orange', 2],
  ['meat', 4]
]);

// 现在 prices = { banana: 1, orange: 2, meat: 4 }

alert(prices.orange); // 2
```
我们可以使用 Object.fromEntries 从 Map 得到一个普通对象（plain object）。

例如，我们在 Map 中存储了一些数据，但是我们需要把这些数据传给需要普通对象（plain object）的第三方代码。

我们来开始：
```js
let map = new Map();
map.set('banana', 1);
map.set('orange', 2);
map.set('meat', 4);

let obj = Object.fromEntries(map.entries()); // 创建一个普通对象（plain object）(*)

// 完成了！
// obj = { banana: 1, orange: 2, meat: 4 }

alert(obj.orange); // 2
```
调用 map.entries() 将返回一个可迭代的键/值对，这刚好是 Object.fromEntries 所需要的格式。

我们可以把带 (*) 这一行写得更短：

```js
let obj = Object.fromEntries(map); // 省掉 .entries()
```

上面的代码作用也是一样的，因为 Object.fromEntries 期望得到一个可迭代对象作为参数，而不一定是数组。并且 map 的标准迭代会返回跟 map.entries() 一样的键/值对。因此，我们可以获得一个普通对象（plain object），其键/值对与 map 相同。

## Set
### Set 迭代
我们可以使用 for..of 或 forEach 来遍历 Set：

Map 中用于迭代的方法在 Set 中也同样支持：

* set.keys() —— 遍历并返回一个包含所有值的可迭代对象，
* set.values() —— 与 set.keys() 作用相同，这是为了兼容 Map，
* set.entries() —— 遍历并返回一个包含所有的实体 [value, value] 的可迭代对象，它的存在也是为了兼容 Map

## weakMap weakSet
之前提到JavaScript 引擎在值“可达”和可能被使用时会将其保持在内存中。

当对象、数组之类的数据结构在内存中时，它们的子元素，如对象的属性、数组的元素都被认为是可达的。

例如，如果把一个对象放入到数组中，那么只要这个数组存在，那么这个对象也就存在，即使没有其他对该对象的引用。

就像这样:
```js
let john = { name: "John" };

let array = [ john ];

john = null; // 覆盖引用

// 前面由 john 所引用的那个对象被存储在了 array 中
// 所以它不会被垃圾回收机制回收
// 我们可以通过 array[0] 获取到它
```
:::tip :rocket:
WeakMap 的键必须是对象，不能是原始值

类似的，如果我们使用对象作为常规 Map 的键，那么当 Map 存在时，该对象也将存在。它会占用内存，并且不会被（垃圾回收机制）回收。
```js
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // 覆盖引用

// john 被存储在了 map 中，
// 我们可以使用 map.keys() 来获取它
```
:::


如果我们在 weakMap 中使用一个对象作为键，并且没有其他对这个对象的引用 —— 该对象将会被从内存（和map）中自动清除。

WeakMap 不支持迭代以及 keys()，values() 和 entries() 方法。所以没有办法获取 WeakMap 的所有键或值。

:::tip :rocket:
vue中使用它作为建立data与副作用的映射
:::