---
layout: doc
outline: deep
---
> [!IMPORTANT]
> CSS 对象模型是一组允许用 JavaScript 操纵 CSS 的 API。它很像 DOM，但针对的是 CSS 而不是 HTML。它允许用户动态地读取和修改 CSS 样式。

## 当想要确认元素的宽高时有几种属性可以选择，但是我们很难确认使用哪个属性才是最适合的。
### offsetWidth 和 offsetHeight
:::tip
如果你需要知道元素总共占用了多少空间，包括可视内容、滚动条（如果有的话）、内边距和边框的宽度，你会使用 offsetWidth 和 offsetHeight 属性，大多数情况下，当元素没有什么形状上的变化时，他们与 getBoundingClientRect()的宽高一致。但是如果发生变化，offsetWidth 和 offsetHeight 将返回元素的布局宽高，而 getBoundingClientRect() 将返回实际渲染的宽高。例如：如果元素的宽 width:100px，变化 transform:scale(0.5)，此时 getBoundingClientRect() 将返回宽 50，而 offsetWidth 将返回宽 100.
:::
### clientWidth和clientHeight
:::tip
如果你需要知道展示区域内容占用了多少空间，包括内边距但是不包括边框、外边距或者滚动条，你会使用clientWidth和clientHeight属性：
:::
### scrollWidth和scrollHeight
:::tip
如果你想要知道内容区域的实际大小，而不局限于可见区域的话，你会使用 scrollWidth和scrollHeight属性。即使使用了滚动条仅有部分内容可见，这两个属性仍会返回元素的完整内容宽高
例如，一个 300x300 像素 的滚动盒子里放置了一个 600x400 像素的元素，scrollWidth 将会返回 600，scrooHeight 返回 400.
:::

## 修改样式的方法
1. 使用 setAttribute 方法
2. 通过修改元素的style属性