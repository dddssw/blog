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