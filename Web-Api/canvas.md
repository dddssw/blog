---
layout: doc
outline: deep
---

## 获取 canvas 上下文

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
```
接着利用ctx可以开始绘制
## canvas坐标系

通常来说网格中的一个单元相当于 canvas 元素中的一像素。栅格的起点为左上角（坐标为（0,0））
![alt text](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes/canvas_default_grid.png)

## 绘制矩形
fillRect(x, y, width, height)
绘制一个填充的矩形

strokeRect(x, y, width, height)
绘制一个矩形的边框

clearRect(x, y, width, height)
清除指定矩形区域，让清除部分完全透明。

上面提供的方法之中每一个都包含了相同的参数。x 与 y 指定了在 canvas 画布上所绘制的矩形的左上角（相对于原点）的坐标。width 和 height 设置矩形的尺寸。

## 绘制路径

### 绘制直线 lineTo()
lineTo(x, y)
绘制一条从当前位置到指定 x 以及 y 位置的直线。

该方法有两个参数：x 以及 y，代表坐标系中直线结束的点。开始点和之前的绘制路径有关，之前路径的结束点就是接下来的开始点，以此类推。开始点也可以通过moveTo()函数改变。

### 圆弧 arc()
arc(x, y, radius, startAngle, endAngle, anticlockwise)
画一个以（x,y）为圆心的以 radius 为半径的圆弧（圆），从 startAngle 开始到 endAngle 结束，按照 anticlockwise 给定的方向（默认为顺时针）来生成。

::: info
备注： arc() 函数中表示角的单位是弧度，不是角度。角度与弧度的 js 表达式：

弧度=(Math.PI/180)*角度。
:::
### 绘制文本
canvas 提供了两种方法来渲染文本：

fillText(text, x, y [, maxWidth])
在指定的 (x,y) 位置填充指定的文本，绘制的最大宽度是可选的。

strokeText(text, x, y [, maxWidth])
在指定的 (x,y) 位置绘制文本边框，绘制的最大宽度是可选的。

### 绘制图片

一旦获得了源图对象，我们就可以使用 drawImage 方法将它渲染到 canvas 里。
```js
function draw() {
  var ctx = document.getElementById("canvas").getContext("2d");
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
  img.src = "backdrop.png";
}
```