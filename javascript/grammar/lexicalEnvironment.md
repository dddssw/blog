---
outline: deep
layout: doc
---
函数，块级，全局作用域都有一个被称为词法环境的内部隐藏的关联对象

::: tip :rocket: 注意
对象的{}不是一个词法环境
:::

词法环境对象由两部分组成：

1. 环境记录（Environment Record） —— 一个存储所有局部变量作为其属性（包括一些其他信息，例如 `this` 的值）的对象。
2. 对 外部词法环境 的引用，与外部代码相关联。

内部词法环境是动态的，但是外部词法环境的引用是创建时拿到的。因为this是内部词法环境的内容，所以this是可变的

`当代码要访问一个变量时 —— 首先会搜索内部词法环境，然后搜索外部环境，然后搜索更外部的环境，以此类推，直到全局词法环境`

## this指向规则
<img src="https://s2.loli.net/2025/01/06/G7uqQCjTLR9OgWk.webp" >

### 第三条
<img src="https://s2.loli.net/2025/01/06/ER32HgnVFTuAzZ5.webp" >

### 第五条
```js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!

//等于
let f = user.sayHi;
setTimeout(f, 1000); // 丢失了 user 上下文
```
