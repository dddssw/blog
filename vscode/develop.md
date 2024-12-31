---
layout: doc
outline: deep
---
## 启动，调试
1. F5会进行插件打包，本质webpack watch不断监听修改并重新打包，如果修改配置需要reload window
2. 代码里debugger即可
## 发布
`vsce publish`即可，或者`vsce package`本地打包，[地址](https://marketplace.visualstudio.com/manage/publishers/dddssw)进行查看

修改readme文件，即可在vscode插件市场里展示