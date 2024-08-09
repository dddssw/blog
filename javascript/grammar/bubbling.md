---
outline: deep
layout: doc
---

## 冒泡
**当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序。**

:::tip :rocket: 几乎所有事件都会冒泡。
这句话中的关键词是“几乎”。

例如，focus 事件不会冒泡。同样，我们以后还会遇到其他例子。但这仍然是例外，而不是规则，大多数事件的确都是冒泡的。
:::
## event target
父元素上的处理程序始终可以获取事件实际发生位置的详细信息。

**引发事件的那个嵌套层级最深的元素被称为目标元素,可以通过 event.target 访问。**

注意与 this（=event.currentTarget）之间的区别：

* event.target —— 是引发事件的“目标”元素，它在冒泡过程中不会发生变化。
* this —— 是“当前”元素，其中有一个当前正在运行的处理程序。

因此，event.target 可能会等于 this
## 停止冒泡
```js
 event.stopPropagation()
```

:::tip :rocket:event.stopImmediatePropagation()
如果一个元素在一个事件上有多个处理程序，即使其中一个停止冒泡，其他处理程序仍会执行。

换句话说，event.stopPropagation() 停止向上移动，但是当前元素上的其他处理程序都会继续运行。

有一个 event.stopImmediatePropagation() 方法，可以用于停止冒泡，并阻止当前元素上的处理程序运行。使用该方法之后，其他处理程序就不会被执行。
```js
button.addEventListener('click', (event) => {
  event.stopImmediatePropagation(); // 阻止事件冒泡和当前元素上的其他事件处理程序
  alert('按钮点击事件1');
});

button.addEventListener('click', () => {
  alert('按钮点击事件2'); // 不会触发
});

document.addEventListener('click', () => {
  alert('文档点击事件'); // 不会触发
});
```
:::

## 捕获
事件处理的另一个阶段被称为“捕获（capturing）”。它很少被用在实际开发中，但有时是有用的。

DOM 事件标准描述了事件传播的 3 个阶段：

1. 捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。
2. 目标阶段（Target phase）—— 事件到达目标元素。
3. 冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。

![alt text](https://zh.javascript.info/article/bubbling-and-capturing/eventflow.svg)

也就是说：点击 `<td>`，事件首先通过祖先链向下到达元素（捕获阶段），然后到达目标（目标阶段），最后上升（冒泡阶段），*在途中调用处理程序*。

之前，我们只讨论了冒泡，因为捕获阶段很少被使用。通常我们看不到它。

使用 `on<event>` 属性或使用 HTML 特性（attribute）或使用两个参数的 addEventListener(event, handler) 添加的处理程序，对捕获一无所知，它们仅在第二阶段和第三阶段运行。

为了在捕获阶段捕获事件，我们需要将处理程序的 capture 选项设置为 true：
```js
elem.addEventListener(..., {capture: true})
// 或者，用 {capture: true} 的别名 "true"
elem.addEventListener(..., true)
```
capture 选项有两个可能的值：

* 如果为 false（默认值），则在冒泡阶段设置处理程序。
* 如果为 true，则在捕获阶段设置处理程序。

请注意，虽然形式上有 3 个阶段，但第 2 阶段（“目标阶段”：事件到达元素）没有被单独处理：捕获阶段和冒泡阶段的处理程序都在该阶段被触发。

:::warning :warning: 要移除处理程序，removeEventListener 需要同一阶段
如果我们 addEventListener(..., true)，那么我们应该在 removeEventListener(..., true) 中提到同一阶段，以正确删除处理程序。
:::

还可以通过event.eventPhase —— 获取当前阶段（capturing=1，target=2，bubbling=3）。