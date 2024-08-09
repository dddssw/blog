---
outline: deep
layout: doc
---

```jsx
function example(){
    let count = 0
    function handleClick(){
        ++count
    }
    return (<>
        <div>{count}</div>
        <button onClick={handleClick}>add</button>
        </>
    )
}
```

不会有任何变化

handleClick() 事件处理函数正在更新局部变量 count

* 更新局部变量react不会触发渲染， React 没有意识到它需要使用新数据再次渲染组件。
* 就算react重新渲染，再次执行这个函数，之前修改的局部变量修改已经丢失，渲染的结果都是一样的

要使用新数据更新组件，需要做两件事：

* 保留 渲染之间的数据。
* 触发 React 使用新数据渲染组件（重新渲染）。

useState Hook 提供了这两个功能：

* State 变量 用于保存渲染间的数据。
* State setter 函数 更新变量并触发 React 再次渲染组件。
## useState 
```js
const [index, setIndex] = useState(0);
```

1. 组件进行第一次渲染。 因为你将 0 作为 index 的初始值传递给 useState，它将返回 [0, setIndex]。 React 记住 0 是最新的 state 值。
2. 你更新了 state。当用户点击按钮时，它会调用 setIndex(index + 1)。 index 是 0，所以它是 setIndex(1)。这告诉 React 现在记住 index 是 1 并触发下一次渲染。
3. 组件进行第二次渲染。React 仍然看到 useState(0)，但是因为 React 记住 了你将 index 设置为了 1，它将返回 [1, setIndex]。
4. 以此类推！

<iframe src="https://codesandbox.io/embed/magical-meitner-hcs52m?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="magical-meitner-hcs52m"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::tip :thinking:
Hooks ——以 use 开头的函数——只能在组件或自定义 Hook 的最顶层调用。 你不能在条件语句、循环语句或其他嵌套函数内调用 Hook。
:::