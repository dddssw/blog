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