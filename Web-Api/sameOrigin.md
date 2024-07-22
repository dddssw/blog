---
outline: deep
---
> [!IMPORTANT]
> BroadcastChannel 接口代理了一个命名频道，可以让指定 origin 下的任意 browsing context 来订阅它。它允许同源的不同浏览器窗口，Tab 页，frame 或者 iframe 下的不同文档之间相互通信。通过触发一个 message 事件，消息可以广播到所有监听了该频道的 BroadcastChannel 对象。

示例

新增页面
```js
// 创建频道
const bc = new BroadcastChannel("myChannel");

// 发送消息，消息内容为唯一标识
bc.postMessage("updateList");
```
列表页面

```js
// 加入频道
const bc = new BroadcastChannel("myChannel");

// 接收消息
bc.onmessage = function (e) {

// 这里我们需要判断一下是否同源
// 过滤掉其他origin传递过来的信息，这个判断很重要，不加就很多可能会被 XSS 攻击！
if (e.origin === location.origin) {

  // 其次最好也判断下发送的消息是否是两边约定好的唯一标识，这样才能进行精准操作
  if (e.data === "updateList") {
    // 刷新列表操作
    ...
    
    // 断开频道连接,防止内存泄漏
    bc.close()
  }
}
};

```