---
outline: deep
layout: doc
---

## 变量

```js
let message;

message = 'Hello!';
```

例如，变量 message 可以被想象成一个标有 "message" 的盒子，盒子里面的值为 "Hello!"

![](https://zh.javascript.info/article/variables/variable.svg)

当值改变的时候，之前的数据就被从变量中删除了：

![](https://zh.javascript.info/article/variables/variable-change.svg)

### 变量命名
1. 变量名称必须仅包含字母、数字、符号 $ 和 _。
2. 首字符必须非数字。
3. 不能是**保留字**

使用大写字母和下划线来命名常量

```js
const COLOR_RED = "#F00";
```
:::tip :thinking:重用还是新建？
最后一点，有一些懒惰的程序员，倾向于重用现有的变量，而不是声明一个新的变量。

结果是，这个变量就像是被扔进不同东西盒子，但没有改变它的贴纸。现在里面是什么？谁知道呢。我们需要靠近一点，仔细检查才能知道。

这样的程序员节省了一点变量声明的时间，但却在调试代码的时候损失数十倍时间。

额外声明一个变量绝对是利大于弊的。

现代的 JavaScript 压缩器和浏览器都能够很好地对代码进行优化，所以不会产生性能问题。为不同的值使用不同的变量可以帮助引擎对代码进行优化。
:::

## 数据类型
js有八种数据类型(Number,Boolean,Null,Undefined,Bigint,Symbol,String,Object)

注意事项 :warning:: 
### Number
:::tip :rocket: 数学运算是安全的
在 JavaScript 中做数学运算是安全的。我们可以做任何事：除以 0，将非数字字符串视为数字，等等。

脚本永远不会因为一个致命的错误（“死亡”）而停止。最坏的情况下，我们会得到 NaN 的结果。
:::

### Bigint
在 JavaScript 中，“number” 类型无法安全地表示大于 (2<sup>53-1</sup>)（即 9007199254740991），或小于 -(2<sup>53-1</sup>) 的整数。

但是使用场景我还没有遇到过，因此不再画蛇添足

### String
:::tip :rocket: JavaScript 中没有 character 类型。
在一些语言中，单个字符有一个特殊的 “character” 类型，在 C 语言和 Java 语言中被称为 “char”。

在 JavaScript 中没有这种类型。只有一种 string 类型，一个字符串可以包含零个（为空）、一个或多个字符。
:::
### typeof
例外 :warning::  

```js
typeof null // "object"  (1)

typeof alert // "function"  (2)
```

* typeof null 的结果为 "object"。这是官方承认的 typeof 的错误，这个问题来自于 JavaScript 语言的早期阶段，并为了兼容性而保留了下来。null 绝对不是一个 object。null 有自己的类型，它是一个特殊值。typeof 的行为在这里是错误的。
* typeof alert 按理应该是返回 "object"。但是 typeof 会对函数区分对待，并返回 "function"。这也是来自于 JavaScript 语言早期的问题。从技术上讲，这种行为是不正确的，但在实际编程中却非常方便。

## 类型转换
### 字符串转换
通过执行方法, `alert(value)` 将 value 转换为字符串类型，然后显示这个值。或者显式地调用 `String(value)`
### 数字转换

在数学运算中，会自动进行 number 类型转换。(加法有点区别), 但是对于同类型的数据不会进行隐式转换

```js
'1'+'2'
```

:::tip number 类型转换规则:thinking:：
| 原始值类型 | 转换后的数字 |
|------------|--------------|
| **`undefined`** | **`NaN`**       |
| `null`      | `0`         |
| `true`      | `1`         |
| `false`     | `0`         |
| 字符串 (`string`) | 如果字符串去掉首尾的空白字符后是纯数字（如 "123"），则转为对应的数字（123）。如果去掉空白后是空字符串，则转换结果为 `0`。如果字符串包含非数字字符（如 "123abc" 或 "abc123"），则从首字符开始尽可能“读取”数字，直到遇到非数字字符。如果字符串的首字符就是非数字，转换结果为 `NaN`。 |

需要特别注意的是 `undefined`

例子：
```js
alert( Number("   123   ") ); 
alert( Number("123z") );      
alert( Number("001") );      
alert( Number(true) );        
alert( Number(false) );      
```
:::
:::details 答案:rocket:：
```js
alert( Number("   123   ") ); // 123
alert( Number("123z") );      // NaN（从字符串“读取”数字，读到 "z" 时出现错误）
alert( Number("001") );       // 1
alert( Number(true) );        // 1
alert( Number(false) );       // 0
```
:::

### 布尔转换
:::tip number 类型转换规则:thinking:：
| 原始值类型 | 转换后的布尔值 |
|------------|----------------|
| `0`, `null`, `undefined`, `NaN`, `""` (空字符串) | `false` |
| 其他值     | `true`         |

这里需要注意的是`NaN`
:::

## 运算符
### 自增,自减

只有当我们使用 ++/-- 的返回值时才能看到区别。

详细点说。我们知道，所有的运算符都有返回值。自增/自减也不例外。前置形式返回一个新的值，但后置返回原来的值（做加法/减法之前的值）。

```js
let counter = 1;
let a = ++counter; // (*)

alert(a); // 2

***

let counter = 1;
let a = counter++; // (*) 将 ++counter 改为 counter++

alert(a); // 1
```

### 双等运算符对隐式转换的特殊影响

当使用数学式或其他比较方法 < > <= >= 时：

null/undefined 会被转化为数字：null 被转化为 0，undefined 被转化为 NaN。

:::tip 
但是undefined 和 null 在相等性检查 `==` 中不会进行任何的类型转换，它们有自己独立的比较规则，所以除了它们之间互等外，不会等于任何其他的值。
:::

所以会出现下面的情况
```js
alert( null > 0 );  // (1) false
alert( null == 0 ); // (2) false
alert( null >= 0 ); // (3) true

alert( undefined > 0 ); // false (1) NaN 是一个特殊的数值型值，它与任何值进行比较都会返回 false
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
```

## 函数
在函数中声明的变量只在该函数内部可见, 函数对外部变量拥有全部的访问权限。函数也可以修改外部变量。只有在没有局部变量的情况下才会使用外部变量。

如果在函数内部声明了同名变量，那么函数会 遮蔽 外部变量

函数传参的形式参数是传参浅拷贝过去的

:::tip :rocket: 空值的 return 或没有 return 的函数返回值为 undefined
如果函数无返回值，它就会像返回 undefined 一样：
```js
function doNothing() { /* 没有代码 */ }

alert( doNothing() === undefined ); // true
```
空值的 return 和 return undefined 等效：

```js
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```
:::

:::tip :warning: 不要在 return 与返回值之间添加新行
```js
return
 (some + long + expression + or + whatever * f(a) + f(b))
```

但这不行，因为 JavaScript 默认会在 return 之后加上分号。上面这段代码和下面这段代码运行流程相同：

```js
return;
 (some + long + expression + or + whatever * f(a) + f(b))
```

如果我们想要将返回的表达式写成跨多行的形式，那么应该在 return 的同一行开始写此表达式。或者至少按照如下的方式放上左括号：

```js
return (
  some + long + expression
  + or +
  whatever * f(a) + f(b)
  )
```
:::
### 函数命名
:thinking: 一个函数 —— 一个行为

一个函数应该只包含函数名所指定的功能，而不是做更多与函数名无关的功能。

两个独立的行为通常需要两个函数，即使它们通常被一起调用（在这种情况下，我们可以创建第三个函数来调用这两个函数）。

### 函数 == 注释
函数应该简短且只有一个功能。如果这个函数功能复杂，那么把该函数拆分成几个小的函数是值得的。

:::tip :rocket:
一个单独的函数不仅更容易测试和调试 —— 它的存在本身就是一个很好的注释！

即使我们不打算重用它们，也可以创建函数。函数可以让代码结构更清晰，可读性更强。
:::