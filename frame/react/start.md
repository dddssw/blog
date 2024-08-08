---
outline: deep
layout: doc
---
## react组件
就是一个返回jsx的函数，在jsx中可以写类似html的东西
jsx 看起来很像 htmlL，但它更严格一些，并且可以显示动态信息。要求所有标签明确的闭合
```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```
:::warning :warning:
React 组件名称必须始终以大写字母开头，而 HTML 标签必须小写 
:::

:::tip DEEP DIVE
:::details 为什么只能返回一个根节点
jsx看起来像html，但是最后还是被转化成普通js对象，函数不能返回多个对象没有数组包裹。
:::

:::tip :rocket: 为什么使用className 而不是 class
jsx会转换为 js, jsx 编写的属性会成为 js 对象的键

例如，在一个自定义的React函数式组件中，可以通过解构赋值或直接访问props对象来读取属性值，并将它们存储到组件内部的变量中
```js
//假设props是
// {
//     'first-name'：'judy'
// }
const MyComponent = (props) => {
  const { 'first-name' } = props;

  return (
    <div>
    </div>
  );
};
```
这样是不行的
:::
## 展示数据
jsx里面可以放入html，如果需要重新跳回js，可以使用大括号包裹
```js{3}
return (
  <h1>
    {user.name}
  </h1>
);
```
修改属性需要用大括号替代引号
```js{3}
return (
  <img
    src={user.imageUrl}
  />
);
```
:::tip :rocket: 特殊的style
```jsx
   style={{
          width: user.imageSize,
          height: user.imageSize
        }}
```
这里需要写成一个对象的形式在放到花括号中
:::

在哪里使用花括号  
在 JSX 中只能以两种方式使用花括号：

* 作为JSX 标签内的文本`<h1>{name}'s To Do List</h1>`：可以，但`<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 不会。
* 作为紧跟在符号后面的属性=：`src={avatar}`将读取avatar变量，但`src="{avatar}"`会传递字符串"{avatar}"。
## 条件渲染
```jsx
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```
当你不需要分支时else，你也可以使用更短的逻辑&&语法：
```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```
## 响应事件
onClick={handleClick}末尾没有括号
## 简单示例
子组件共享数据
```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}

```
:::warning :warning: 警告
组件可以渲染其他组件，但绝不能嵌套它们的定义：
```js

export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```
上面的代码片段非常慢，而且容易导致错误。相反，应该在顶层定义每个组件：
```js
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```
当子组件需要来自父组件的一些数据时，通过 props 传递它，而不是嵌套定义。
:::