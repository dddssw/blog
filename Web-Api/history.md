---
layout: doc
outline: deep
---

历史记录 API 中定义的主要接口是 History 接口，它定义了两套截然不同的方法：

在会话历史记录中导航到页面的方法：
1. History.back()  与用户单击浏览器的 Back 按钮的行为相同。等价于 history.go(-1)。调用此方法回到会话历史的第一页之前没有效果并且不会引发异常。
2. History.forward() 与用户单击浏览器的 Forward 按钮的行为相同。等价于 history.go(1)。调用此方法超越浏览器历史记录中最新的页面没有效果并且不会引发异常。
3. History.go()

修改会话历史记录的方法：

1. History.pushState()
2. History.replaceState()

pushState() 方法会向会话历史记录添加新条目，而 replaceState() 方法则会更新当前页面的会话历史记录条目。

这两种方法都接收一个 state 参数，该参数可包含任何可序列化对象。当浏览器导航到该历史条目时，浏览器(导航到页面的方法)会触发 popstate 事件，其中包含与该条目相关的state。

state非常重要，就是根据它还原对应的页面

## SPA

如果只需要更新页面的一部分，每次加载整个页面的效率会很低。
跨页面导航时很难保持应用程序状态

问题在于，它破坏了浏览器“后退”和“前进”按钮的预期行为。

这正是 pushState()、replaceState() 和 popstate 事件所要解决的问题。它们使我们能够合成历史条目，并在当前会话历史条目更改为这些条目之一（例如，由于用户按下了“后退”或“前进”按钮）时收到通知。

```html
// 处理前进/回退按钮
window.addEventListener("popstate", (event) => {
  // 如果提供了一个状态（state），我们“模拟”一个页面并更新当前页面
  if (event.state) {
    // 模拟前一个页面加载
    displayContent(event.state);
  }
});
```

:::tip
备注：调用history.pushState()或者history.replaceState()不会触发popstate事件。popstate事件仅在浏览某些器行为下触发，比如点击后退按钮（或者在 JavaScript 中调用history.back()方法）。即，在同一个文档的两个历史记录条目之间导航会触发该事件。
:::

## History
### 属性
length 只读
返回一个整数（Integer），该整数表示会话历史中元素的数目，包括当前加载的页。例如，在一个新的选项卡加载的一个页面中，这个属性返回 1。

scrollRestoration
允许 Web 应用程序在历史导航上显式地设置<mark>默认滚动恢复</mark>行为。此属性可以是自动的（auto）或者手动的（manual）。

state 只读
返回一个表示历史堆栈顶部的状态的任意（any）值。这是一种不必等待 popstate 事件而查看状态的方式。