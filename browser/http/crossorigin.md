---
layout: doc
outline: deep
---
## 什么是跨域
浏览器有一个同源策略，要求协议，域名，端口号都相同，当请求url与当前页面url违背了同源策略，即为跨域
## 如何解决跨域
### cors
浏览器将cors请求分为简单请求和非简单请求

[简单请求/非简单请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#examples_of_access_control_scenarios)
#### 简单请求
浏览器直接发送请求，会在请求头加上一个`origin`（本次请求来自哪个源（协议 + 域名 + 端口））

如果指定的源，不在许可范围。浏览器会抛出一个cors错误

反之会响应头会加上`Access-Control-Allow-Origin`,如果是一个*，表示接受任意域名的请求。

#### 非简单请求
先发送一个预检请求，"预检"请求用的请求方法是OPTIONS

关键字段是Origin，还包括两个特殊字段`Access-Control-Request-Method`,`Access-Control-Request-Headers(额外发送的请求头字段)`

预检请求失败会抛出cors错误，如果请求成功，返回

* Access-Control-Allow-Methods

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

* Access-Control-Allow-Headers

如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

* Access-Control-Max-Age

该字段可选，用来指定本次预检请求的有效期，单位为秒

一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个Origin头信息字段。服务器的回应，也都会有一个Access-Control-Allow-Origin头信息字段。

### 使用代理服务器
同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就没有跨域一说。

1. 接受客户端请求 。
2. 将请求转发给服务器。
3. 拿到服务器响应数据。
4. 将响应转发给客户端。

仍然需要返回`Access-Control-Allow-Origin`。
尽管代理服务器代替了客户端直接与外部API交互，但代理服务器仍然是一个“外部”请求的最终响应者。浏览器会检查从代理服务器返回的响应，确保其符合CORS的要求。