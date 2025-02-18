---
layout: doc
outline: deep
---

## XSS(跨站脚本攻击)
通过注入恶意脚本到网页中，例如在评论区插入恶意代码，其他用户浏览时会自动执行该脚本

危害

* 窃取cookie
* 篡改页面内容

防御

* httponly
* 对用户输入的特殊字符进行转义
* Content Security Policy (CSP)：限制页面只能加载指定来源的脚本
## CSRF(跨站请求伪造)
用户登录可信网站A（如银行），获得会话Cookie。

用户访问恶意网站B，B中伪造一个针对网站A的请求（如转账）。

用户的浏览器自动携带Cookie发送请求，网站A误认为是用户主动操作。

* 短信/人脸二次验证
* 在请求头上携带token
* 设置cookie的samesite,限制跨域携带


