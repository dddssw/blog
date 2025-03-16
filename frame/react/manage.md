---
outline: deep
layout: doc
---

组件不会保留状态，React 通过组件在渲染树中的位置将它保存的每个状态与正确的组件关联起来。

组件销毁时会清空状态

相同位置的相同组件 state 会被保留

<iframe src="https://codesandbox.io/embed/46c93c?view=editor+%2B+preview"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

可以通过 key 让他进行更新

## useReducer

https://juejin.cn/post/7351584333612892214

## useContext

使用默认值的情况

<iframe src="https://codesandbox.io/embed/wptsft?view=editor+%2B+preview"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

设置值并提供给子组件

把它们用 context provider 包裹起来 以提供 LevelContext 给它们

<iframe src="https://codesandbox.io/embed/v6qzfv?view=editor+%2B+preview"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

::: tip
这告诉 React：如果在 `<Section>` 组件中的任何子组件请求 LevelContext，给他们这个 level。”组件会使用 UI 树中在它上层最近的那个 `<LevelContext>` 传递过来的值
:::

由于 context 让你可以从上层的组件读取信息，每个 Section 都会从上层的 Section 读取 level，并自动向下层传递 level + 1。有点像继承

   <iframe src="https://codesandbox.io/embed/qgjcl4?view=editor+%2B+preview&module=%2Fsrc%2Findex.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## useRef
与 state 一样，ref 在重新渲染之间由 React 保留。但是，设置 state 会重新渲染组件，而更改 ref 不会！你可以通过 ref.current 属性访问该 ref 的当前值。

这是一个例子保存定时器的引用，如果没使用useRef而是普通的let声明，下次渲染会丢失
<iframe src="https://codesandbox.io/embed/vym52n?view=editor+%2B+preview"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

   state 就像 每次渲染的快照，并且 不会同步更新。但是当你改变 ref 的 current 值时，它会立即改变

vue提供里nextTick,react则是flushSync 

循环如何获取dom
<iframe src="https://codesandbox.io/embed/9kpv76?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## useEffect
React 组件中的两种逻辑类型：

渲染代码（在 描述 UI 中有介绍）位于组件的顶层。你在这里处理 props 和 state，对它们进行转换，并返回希望在页面上显示的 JSX。渲染代码必须是纯粹的——就像数学公式一样，它只应该“计算”结果，而不做其他任何事情。

事件处理程序（在 添加交互性 中有介绍）是组件内部的嵌套函数，它们不光进行计算, 还会执行一些操作。事件处理程序可能会更新输入字段、提交 HTTP POST 请求来购买产品，或者将用户导航到另一个页面。事件处理程序包含由特定用户操作（例如按钮点击或输入）引起的“副作用”（它们改变了程序的状态）。

useEffect 会“延迟”一段代码的运行，直到渲染结果反映在页面上。

默认情况下，Effect 会在 每次 渲染后运行。正因如此，以下代码会陷入死循环：

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

如果不想每次都执行，后面可以加一个依赖数组，空数组就只会执行一次(mounted)。依赖项改变才会执行

清理函数,useEffect的回调了return的函数，React 会在每次 Effect 重新运行之前调用清理函数，并在组件卸载（被移除）时最后一次调用清理函数（umounted）。
```js
 useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

每个 Effect 都会“捕获”它对应渲染时的 text 值。
<iframe src="https://codesandbox.io/embed/mhyq53?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react.dev"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   一直输入，发现定时器里打印的是创建时的数据

## createPortal 
类似teleport
## 受控组件
表单组件

这些浏览器内置组件接收用户的输入：

* `<input>`
* `<select>`
* `<textarea>`

将value作为prop 传递给这些组件会将其变为受控组件。