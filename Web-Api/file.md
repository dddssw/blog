---
layout: doc
outline: deep
---

## 上传文件 input

```html
<input type="file" id="input" multiple />
```

通过文件 API，我们可以访问 FileList，它包含了表示用户所选文件的 File 对象。

input 元素的 multiple 属性允许用户选择多个文件。

### 通过 change 事件访问被选择的文件

```js {3}
const uploadInput = document.getElementById("uploadInput");
uploadInput.addEventListener("change", () => {
  console.log(uploadInput.files); //获取文件对象
});
```

## 使用拖放来选择文件

```html {35}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #dropbox {
        width: 200px;
        height: 200px;
        background-color: antiquewhite;
      }
    </style>
  </head>
  <body>
    <div id="dropbox"></div>
  </body>
  <script>
    dropbox = document.getElementById("dropbox");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);

    function dragenter(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dragover(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function drop(e) {
      console.log(e.dataTransfer.files);
      e.stopPropagation();
      e.preventDefault();
    }
  </script>
</html>
```

## FileReader

FileReader 接口允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

文件对象可以从用户使用 input 元素选择文件而返回的 FileList 对象中获取，或者从拖放操作的 DataTransfer 对象中获取。

```js
const reader = new FileReader();
reader.onload = (e) => {
  img.src = e.target.result;
  console.log(e, "onload");
};
reader.onprogress = (e) => {
  console.log(e, "progress");
};
reader.readAsDataURL(file);
```

1. FileReader 接口的 readAsDataURL() 方法用于读取指定的 Blob 或 File 对象的内容。当读操作完成时，readyState 属性变为 DONE，并触发 loadend 事件。此时，result 属性包含作为 data: URL 的数据，将文件的数据表示为 base64 编码字符串。
2. load 事件在成功读取文件时触发。
3. progress 事件在 FileReader 读取数据时定期触发.可以据此生成进度条

## 使用对象 URL

当你需要在 HTML 中通过 URL 来引用一个 File 对象时，你也可以创建一个对象 URL

```js
const objectURL = window.URL.createObjectURL(fileObj);
```

这个对象 URL 是一个标识 File 对象的字符串。每次你调用 URL.createObjectURL()，都会创建一个唯一的对象 URL，即使你已经为该文件创建了一个对象 URL。每一个 URL 都必须被释放。虽然它们会在文档卸载时自动释放，但如果你的页面动态地使用它们，你应该通过调用 URL.revokeObjectURL() 明确地释放它们：

```js
URL.revokeObjectURL(objectURL);
```

```js
img.src = URL.createObjectURL(this.files[i]);
```

## 对象 URL 显示 PDF

```js
const obj_url = URL.createObjectURL(file);
const iframe = document.getElementById("viewer");
iframe.setAttribute("src", obj_url);
URL.revokeObjectURL(obj_url);
```
