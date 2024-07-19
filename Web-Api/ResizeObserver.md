---
outline: deep
---

# Resize Observer API

> [!IMPORTANT]
> Resize Observer API 提供了一种高性能的机制，通过该机制，代码可以`监视元素的大小更改`，并且每次大小更改时都会向观察者传递通知。(元素查询不同于媒体查询)

语法
```javascript
new ResizeObserver(callback)
```

callback
每当观测的元素调整大小时，调用该函数。该函数接收两个参数：

entries
一个 ResizeObserverEntry 对象数组，可以用于获取每个元素改变后的新尺寸。
包括
```javascript
ResizeObserverEntry.borderBoxSize 只读
一个对象，当运行回调时，该对象包含着正在观察元素的新边框盒的大小。

ResizeObserverEntry.contentBoxSize 只读
一个对象，当运行回调时，该对象包含着正在观察元素的新内容盒的大小。

ResizeObserverEntry.devicePixelContentBoxSize 只读
一个对象，当运行回调时，该对象包含着正在观察元素的新内容盒的大小（以设备像素为单位）。

ResizeObserverEntry.contentRect 只读
一个对象，当运行回调时，该对象包含着正在观察元素新大小的 DOMRectReadOnly 对象。请注意，这比以上两个属性有着更好的支持，但是它是 Resize Observer API 早期实现遗留下来的，出于对浏览器的兼容性原因，仍然被保留在规范中，并且在未来的版本中可能被弃用。

ResizeObserverEntry.target 只读
对正在观察 Element 或 SVGElement 的引用。
```

observer
对 ResizeObserver 自身的引用，因此需要它的时候，你要从回调函数的内部访问。例如，这可用于在达到特定的情况时，自动取消对观察者的监听，但如果你不需要它，可以省略它。

回调通常遵循以下模式：

```javascript
function callback(entries, observer) {
  for (const entry of entries) {
    // Do something to each entry
    // and possibly something to the observer itself
  }
}
```

将创建并返回一个新的 ResizeObserver 对象。

可以调用
```javascript
ResizeObserver.disconnect()
取消特定观察者目标上所有对 Element 的监听。

ResizeObserver.observe()
开始对指定 Element 的监听。

ResizeObserver.unobserve()
结束对指定 Element 的监听。
```