---
layout: doc
outline: deep
---

用户可使用鼠标选择可拖拽（draggable）元素，将元素拖拽到可放置（droppable）元素，并释放鼠标按钮以放置这些元素。拖拽操作期间，会有一个可拖拽元素的半透明快照跟随着鼠标指针。
<table>
  <thead>
    <tr>
      <th>事件</th>
      <th>On 型事件处理程序</th>
      <th>触发时刻</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>drag</code></td>
      <td><code>ondrag</code></td>
      <td>当拖拽元素或选中的文本时触发。</td>
    </tr>
    <tr>
      <td><code>dragend</code></td>
      <td><code>ondragend</code></td>
      <td>当拖拽操作结束时触发 (比如松开鼠标按键或敲“Esc”键). (见结束拖拽)</td>
    </tr>
    <tr>
      <td><code>dragenter</code></td>
      <td><code>ondragenter</code></td>
      <td>当拖拽元素或选中的文本到一个可释放目标时触发（见指定释放目标）。</td>
    </tr>
    <tr>
      <td><code>dragleave</code></td>
      <td><code>ondragleave</code></td>
      <td>当拖拽元素或选中的文本离开一个可释放目标时触发。</td>
    </tr>
    <tr>
      <td><code>dragover</code></td>
      <td><code>ondragover</code></td>
      <td>当元素或选中的文本被拖到一个可释放目标上时触发（每 100 毫秒触发一次）。</td>
    </tr>
    <tr>
      <td><code>dragstart</code></td>
      <td><code>ondragstart</code></td>
      <td>当用户开始拖拽一个元素或选中的文本时触发（见开始拖拽操作）。</td>
    </tr>
    <tr>
      <td><code>drop</code></td>
      <td><code>ondrop</code></td>
      <td>当元素或选中的文本在可释放目标上被释放时触发（见执行释放）。</td>
    </tr>
  </tbody>
</table>

## 拖拽操作
在 HTML 中，除了图像、链接和选择的文本默认的可拖拽行为之外，其他元素在默认情况下是不可拖拽的。

要使其他的 HTML 元素可拖拽，必须做三件事：

将想要拖拽的元素的 draggable 属性设置成 "true"。
为 dragstart 事件添加一个监听程序。
在上一步定义的监听程序中 设置拖拽数据。

### 开始拖拽
在 dragstart 事件中，你可以指定拖拽数据、反馈图像和拖拽效果，所有这些都将在下面描述。不过，我们只需要设置拖拽数据，因为在大多数情况下默认的图像和拖拽效果都是适用的
### 指定放置目标
网页或应用程序的大多数区域都不是放置数据的有效位置。因此，这些事件的默认处理是不允许放置。

如果你想要允许放置，你必须取消 dragenter 和 dragover 事件来阻止默认的处理。调用事件的 preventDefault() 方法来实现这一点。
### 完成拖拽
一旦拖拽完成，dragend 事件会在拖拽源头（即触发 dragstart 的元素）上发生。无论拖拽是成功还是被取消，这个事件都会被触发。然而，你可以使用 dropEffect 属性来决定执行什么放置操作。

## DataTransfer
DataTransfer 对象用于保存拖动并放下（drag and drop）过程中的数据。它可以保存一项或多项数据，这些数据项可以是一种或者多种数据类型。
### 实例属性
1. **DataTransfer.files**属性在拖动操作中表示文件列表。如果操作不包含文件，则此列表为空。

此功能可用于将文件从用户桌面拖动到浏览器。

2. DataTransfer的items 属性只读，是拖动操作中 数据传输项的列表。该列表包含了操作中每一项目的对应项，如果操作没有项目，则列表为空。

3. DataTransfer.setData() 方法用来设置拖放操作的drag data到指定的数据和类型。

如果给定类型的数据不存在，则将其添加到拖动数据存储的末尾，使得 types 列表中的最后一个项目将是新类型。

如果给定类型的数据已经存在，现有数据将被替换为相同的位置。也就是说，替换相同类型的数据时 types列表的顺序不会更改。

4. DataTransfer.getData() 方法接受指定类型的拖放（以DOMString的形式）数据。如果拖放行为没有操作任何数据，会返回一个空字符串。

数据类型有：text/plain，text/uri-list

示例 
```html
<html>
  <head>
    <script>
      function drop(e) {
        console.log(e.dataTransfer.items)
      }
    </script>
    <style>
      .block {
        width: 200px;
        height: 200px;
        background-color: aliceblue;
      }
    </style>
  </head>
  <body>
    <p
      draggable="true"
      ondragstart="event.dataTransfer.setData('text/plain', 'This text may be dragged')"
    >
      This text be dragged.
    </p>
    <div class="block" ondrop="drop(event)" ondragover="event.preventDefault()"></div>
  </body>
</html>
```