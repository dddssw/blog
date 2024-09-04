---
layout: doc
outline: deep
---

## vscode内置
```js
import { 
    ExtensionContext, languages, commands, Disposable, workspace, window 
    } from 'vscode';
```
* ExtensionContext：用于提供插件的上下文
* languages: 
1. 注册语言服务:例如 CodeLens、代码补全、悬停提示等
2. 注册语言特性:如代码导航、文档符号、语法高亮等
* commands：用于注册和处理 VS Code 命令
* Disposable：用于管理和释放资源。实现了 dispose 方法来清理资源
* workspace：提供对工作区的访问，例如读取和更新配置
* window：用于与 VS Code 窗口交互，例如显示信息消息框