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
## when 子句上下文
用来控制ui是否可见，例如view,menu或命令是否生效，由context key组成或糅合操作符

也可以使用配置config，例如config.editor.tabCompletion或config.breadcrumbs.enabled。
## 条件运算符
通过运算符能更加细致的确定状态
### 相等运算符
右侧是一个普通的值，意味这不会在context key进行查找

如果右侧的值含有空格，需要使用单引号

== 与 ===效果相同
### 比较运算符
运算符左右必须使用空格分开
### “in” 和 “not in” 条件运算符
查找文件是否在受支持文件对象中，不考虑值，只是判断是否存在
```
"menus": {
  "explorer/context": [
    {
      "command": "ext.doSpecial",
      "when": "explorerResourceIsFolder && resourceFilename in ext.supportedFolders"
    }
  ]
}
```
## 这里是内置的context key
[内置](https://code.visualstudio.com/api/references/when-clause-contexts#available-context-keys)
## 添加自定义context key
```
vscode.commands.executeCommand('setContext', 'myExtension.showMyCommand', true);

vscode.commands.executeCommand('setContext', 'myExtension.numberOfCoolOpenThings', 4);

```
## 配置
```
//package.json
	"configuration": [
			{
				"title": "JSON Outline",
				"properties": {
					"jsonOutline.autorefresh": {
						"type": "boolean",
						"default": false
					}
				}
			}
		]
```
```
//获取配置
vscode.workspace.getConfiguration('jsonOutline').get('autorefresh', false);
```
## 事件监听
```
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());//切换当前活动的文本编辑器时触发
		vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));//在文本文档发生变化时触发
		vscode.workspace.onDidChangeConfiguration(() => {
			this.autoRefresh = vscode.workspace.getConfiguration('jsonOutline').get('autorefresh', false);
		});//修改配置时触发
```
## 获取编辑文件信息
```js
vscode.window.activeTextEditor.document.uri.scheme === 'file'//区分本地还是远程文件
vscode.window.activeTextEditor.document.languageId === 'json'//语言标识符
```

## 注册命令
使用 registerCommand 进行注册，并且在package.json进行注册
```js
//package.json
"contributes": {
    "commands": [
      {
        "command": "speed-up.element-plus",
        "title": "insert element-plus"
      }
	]
}
```
在命令面板搜 title:`insert element-plus`,而不是`speed-up.element-plus`


# 插件speed up （zustand 全局状态管理）
## 功能1
生成element-plus模板，需要结合脚手架
### 使用
1. 集成终端搜索`active element-plus termine`,在这个终端下进行脚手架命令，执行脚手架(snippetvue)交互(命令名：gen el)，等待代码生成
2. 文件编辑器鼠标右键有一个`插入element-plus组件模板`,点击就会在光标的位置进行插入

### 思路
1. vscode创建终端，注意是集成终端，在终端执行脚手架命令，执行完毕，在onDidEndTerminalShellExecution可以监听到，但是他们之间通信不了
2. 所以脚手架执行完之后将数据保存在一个文件，onDidEndTerminalShellExecution监听脚手架命令执行完毕再读取这个文件拿到数据
3. 拿到数据存在全局，在当前编辑文件右击多出一个 `插入element-plus组件模板` 的命令

# 脚手架snippetvue
## 功能1
`gen el`  

生成element plus组件代码模板