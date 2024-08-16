---
outline: deep
layout: doc
---
## 属性标志
对象属性（properties），除 value 外，还有三个特殊的特性（attributes），也就是所谓的“标志”：

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