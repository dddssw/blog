---
outline: deep
---
#  XMLHttpRequest API
> [!IMPORTANT]
> XMLHttpRequest API 使 Web 应用程序能够向 Web 服务器发出 HTTP 请求，并使用 JavaScript 以编程方式接收响应。这反过来又使网站能够使用来自服务器的数据更新页面的一部分，而不必导航到整个新页面。这种做法有时也称为 Ajax。

## 使用 XMLHttpRequest

要发送 HTTP 请求：
1. 创建XMLHttpRequest对象
2. 打开 URL
3. 发送请求

事务完成后，该XMLHttpRequest对象将包含有用的信息，例如响应主体和结果的HTTP 状态。
```js{5,7,8}
function reqListener() {
  console.log(this.responseText);
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", "http://www.example.org/example.txt");//这里还有第三个参数，默认是异步请求
req.send();
console.log(req)
```
