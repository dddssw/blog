---
outline: deep
layout: doc
---

## 总括
* React 组件名称必须始终以大写字母开头，而 HTML 标签必须小写。
* export default指定文件中的主要组件,export也行，不过导入时要按需导入
* 使用{}进入js
* 特殊的属性className,style(它接受一个对象)
* 在 React 中，你可以在渲染时读取三种输入：props，state 和 context。你应该始终将这些输入视为只读。
## jsx
比html更严格
* 只能返回一个根节点
* 标签必须闭合
* 使用驼峰式命名法给大部分属性命名！除了aria-* 和 data-* 属性是以带 - 符号的 HTML 格式书写的

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
## 组件
:::warning :warning:
React 组件名称必须始终以大写字母开头，而 HTML 标签必须小写 
:::
## 在 jsx 中通过大括号使用 js
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
这里需要写成一个对象的形式在放到花括号中，内联 style 属性 使用驼峰命名法编写
:::

在哪里使用花括号  
在 JSX 中只能以两种方式使用花括号：

* 作为JSX 标签内的文本`<h1>{name}'s To Do List</h1>`：可以，但`<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 不会。
* 作为紧跟在符号后面的属性=：`src={avatar}`将读取avatar变量，但`src="{avatar}"`会传递字符串"{avatar}"。
## 使用 jsx 展开语法传递 props 
```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```
## 将 jsx 作为子组件传递(插槽)
通过解构children
```js
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```
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
## 渲染列表
```jsx
const listItems = people.map(person => <li>{person}</li>);

return <ul>{listItems}</ul>;
```
组件不会把 key 当作 props 的一部分。Key 的存在只对 React 本身起到提示作用。如果你的组件需要一个 ID，那么请把它作为一个单独的 prop 传给组件： <Profile key={id} userId={id} />。
## 将 jsx 赋值给变量
```jsx{4-8}
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```
## Fragment 
Fragment 语法的简写形式 <> </> 无法接受 key 值，所以你只能要么把生成的节点用一个 `<div>` 标签包裹起来，要么使用长一点但更明确的 `<Fragment>` 写法：
```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```
这里的 Fragment 标签本身并不会出现在 DOM 上，这串代码最终会转换成 `<h1>、<p>、<h1>、<p>`…… 的列表。
## 严格模式
在严格模式下开发时，它将会调用每个组件函数两次

严格模式在生产环境下不生效，因此它不会降低应用程序的速度。如需引入严格模式，你可以用 `<React.StrictMode>` 包裹根组件

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


## onClickCapture
极少数情况下，你可能需要捕获子元素上的所有事件，即便它们阻止了传播。例如，你可能想对每次点击进行埋点记录，传播逻辑暂且不论。那么你可以通过在事件名称末尾添加 Capture 来实现这一点：
```js
<div onClickCapture={() => { /* 这会首先执行 */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```
每个事件分三个阶段传播：

1. 它向下传播，调用所有的 onClickCapture 处理函数。
2. 它执行被点击元素的 onClick 处理函数。
3. 它向上传播，调用所有的 onClick 处理函数。

捕获事件对于路由或数据分析之类的代码很有用，但你可能不会在应用程序代码中使用它们。

这就相当监听元素的捕获事件