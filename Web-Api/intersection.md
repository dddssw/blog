---
layout: doc
outline: deep
---
主要用来判断元素是否可见
## 创建交叉口观察器
```js
let options = {
  root: document.querySelector("#scrollArea"),
  rootMargin: "0px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(callback, options);
```

## 交叉口观察器选项
options传入构造函数的对象可IntersectionObserver()让您控制调用观察者回调的情况。它具有以下字段：

root  
用作检查目标可见性的视口的元素。必须是目标的祖先。如果未指定或 ，则默认为浏览器视口null。

rootMargin  
根元素周围的边距。可以具有类似于 CSSmargin属性的值，例如"10px 20px 30px 40px"（上、右、下、左）。值可以是百分比。这组值用于在计算交点之前增大或缩小根元素边界框的每一侧。默认为全零。

threshold  
单个数字或数字数组，表示目标可见性百分比达到多少时应执行观察者的回调。如果您只想检测可见性何时超过 50%，则可以使用值 0.5。如果您希望每次可见性超过另外 25% 时都运行回调，则应指定数组 [0, 0.25, 0.5, 0.75, 1]。默认值为 0（意味着只要有一个像素可见，就会运行回调）。值 1.0 表示直到每个像素都可见时才认为阈值已通过。

:::tip
Intersection Observer API 考虑的所有区域都是矩形；形状不规则的元素被视为占据包含元素所有部分的最小矩形。同样，如果元素的可见部分不是矩形，则元素的相交矩形被视为包含元素所有可见部分的最小矩形。
:::