---
outline: deep
layout: doc
---

```jsx
function example() {
  let count = 0;
  function handleClick() {
    ++count;
  }
  return (
    <>
      <div>{count}</div>
      <button onClick={handleClick}>add</button>
    </>
  );
}
```

不会有任何变化

handleClick() 事件处理函数正在更新局部变量 count

- 更新局部变量 react 不会触发渲染， React 没有意识到它需要使用新数据再次渲染组件。
- 就算 react 重新渲染，再次执行这个函数，之前修改的局部变量修改已经丢失，渲染的结果都是一样的

要使用新数据更新组件，需要做两件事：

- 保留 渲染之间的数据。
- 触发 React 使用新数据渲染组件（重新渲染）。

useState Hook 提供了这两个功能：

- State 变量 用于保存渲染间的数据。
- State setter 函数 更新变量并触发 React 再次渲染组件。

## useState

```js
const [index, setIndex] = useState(0);
```

1. 组件进行第一次渲染。 因为你将 0 作为 index 的初始值传递给 useState，它将返回 [0, setIndex]。 React 记住 0 是最新的 state 值。
2. 你更新了 state。当用户点击按钮时，它会调用 setIndex(index + 1)。 index 是 0，所以它是 setIndex(1)。这告诉 React 现在记住 index 是 1 并触发下一次渲染。
3. 组件进行第二次渲染。React 仍然看到 useState(0)，但是因为 React 记住 了你将 index 设置为了 1，它将返回 [1, setIndex]。
4. 以此类推！

## 赋予一个组件多个 state 变量

useState 在调用时没有任何关于它引用的是哪个 state 变量的信息。没有传递给 useState 的“标识符”，它是如何知道要返回哪个 state 变量呢

相反，为了使语法更简洁，在同一组件的每次渲染中，Hooks 都依托于一个稳定的调用顺序

在 React 内部，为每个组件保存了一个数组，其中每一项都是一个 state 对。它维护当前 state 对的索引值，在渲染之前将其设置为 “0”。每次调用 useState 时，React 都会为你提供一个 state 对并增加索引值。

[React Hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

这个例子没有使用 React，但它让你了解 useState 在内部是如何工作的：

<iframe src="https://codesandbox.io/embed/magical-meitner-hcs52m?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="magical-meitner-hcs52m"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::tip :thinking:
Hooks ——以 use 开头的函数——只能在组件或自定义 Hook 的最顶层调用。 你不能在条件语句、循环语句或其他嵌套函数内调用 Hook。
:::

再看这个例子

<iframe src="https://codesandbox.io/embed/g7f575?view=editor+%2B+preview"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="一次性三次set"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
:::details :rocket: DEEP DIVE

设置 state 只会为下一次渲染变更 state 的值

以下是这个按钮的点击事件处理函数通知 React 要做的事情：

1. setNumber(number + 1)：number 是 0 所以 setNumber(0 + 1)。

- React 准备在下一次渲染时将 number 更改为 1。

2. setNumber(number + 1)：number 是 0 所以 setNumber(0 + 1)。

- React 准备在下一次渲染时将 number 更改为 1。

3. setNumber(number + 1)：number 是 0 所以 setNumber(0 + 1)。

- React 准备在下一次渲染时将 number 更改为 1。

尽管你调用了三次 setNumber(number + 1)，但在 这次渲染的 事件处理函数中 number 会一直是 0，所以你会三次将 state 设置成 1。
:::

再看这个

<iframe src="https://codesandbox.io/embed/x9692v?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="随时间变化的state"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::details :rocket: DEEP DIVE
state 的值在渲染过程中永远不会改变

即使其事件处理程序的代码是异步的。在该渲染 中，即使在调用之后，onClick的值number仍然保持不变。当 React 通过调用您的组件“拍摄 UI 快照”时，其值已“固定”
:::
