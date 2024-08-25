---
outline: deep
layout: doc
---
## 属性标志
对象属性（properties），除 `value` 外，还有三个特殊的特性（attributes），也就是所谓的“标志”：

* writable — 如果为 true，则值可以被修改，否则它是只可读的。
* enumerable — 如果为 true，则会被在循环中列出，否则不会被列出。
* configurable — 如果为 true，则此属性可以被删除，这些特性也可以被修改，否则不可以。

默认都是true

### 获取这些标志
```js
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```
```js
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* 属性描述符：
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```
### 修改标志
```js
Object.defineProperty(obj, propertyName, descriptor)
```
在这种情况下，如果没有提供标志，则会假定它是 false。

```js
let user = {};

Object.defineProperty(user, "name", {
  value: "John"
});

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
}
 */
```

### 只读
```js
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false
});

user.name = "Pete"; // Error: Cannot assign to read only property 'name'
```
现在没有人可以改变我们 user 的 name，除非它们应用自己的 defineProperty 来覆盖我们的 user 的 name。
:::tip :warning: 只在严格模式下会出现 Errors
在非严格模式下，在对不可写的属性等进行写入操作时，不会出现错误。但是操作仍然不会成功。在非严格模式下，违反标志的行为（flag-violating action）只会被默默地忽略掉。
:::
### 不可枚举
```js
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

// 默认情况下，我们的两个属性都会被列出：
for (let key in user) alert(key); // name, toString
```

如果我们不喜欢它，那么我们可以设置 enumerable:false。之后它就不会出现在 for..in 循环中了，就像内建的 toString 一样：

```js
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

Object.defineProperty(user, "toString", {
  enumerable: false
});

// 现在我们的 toString 消失了：
for (let key in user) alert(key); // name
```
不可枚举的属性也会被 Object.keys 排除：
```js
alert(Object.keys(user)); // name
```

## 不可配置
有时会预设在内建对象和属性中

配置不能被修改,并且不可配置的属性不能被删除

使属性变成不可配置是一条单行道。我们无法通过 defineProperty 再把它改回来

:::tip :rocket: 例外
唯一可行的特性更改：writable true → false
:::

## getter setter
之前的对象属性都是数据属性,还有一种对象属性-访问器属性

访问器属性由 “getter” 和 “setter” 方法表示。在对象字面量中，它们用 get 和 set 表示：
```js
let obj = {
  get propName() {
    // 当读取 obj.propName 时，getter 起作用
  },

  set propName(value) {
    // 当执行 obj.propName = value 操作时，setter 起作用
  }
};
```
## 访问器描述符
对于访问器属性，没有 value 和 writable，但是有 get 和 set 函数。

所以访问器描述符可能有：

* get —— 一个没有参数的函数，在读取属性时工作，
* set —— 带有一个参数的函数，当属性被设置时调用，
* enumerable —— 与数据属性的相同，
* configurable —— 与数据属性的相同。

:::warning 不要同一个描述符中同时提供 get 和 value
```js
// Error: Invalid property descriptor.
Object.defineProperty({}, 'prop', {
  get() {
    return 1
  },

  value: 2
});
```
:::

## 克隆对象的“标志感知”
一次定义多个属性
```js
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
```
一次获取所有属性描述符
```js
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```