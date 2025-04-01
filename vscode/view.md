---
layout: doc
outline: deep
---
视图的提供者只有两种

* treeView
* webView

## webView
首先需要一个继承于WebviewViewProvider的class

vscode通过postMessage向webview发送信息,webview里addeventlisten message

webview也是通过postmessage发送信息`vscode.postMessage({ type: 'colorSelected', value: color })`,vscode通过`onDidReceiveMessage`监听
```js
import * as vscode from 'vscode';

class ColorsViewProvider implements vscode.WebviewViewProvider {
    // calicoColors.colorsView是packagejson里注册的视图id
	public static readonly viewType = 'calicoColors.colorsView';

	private _view?: vscode.WebviewView;

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [this._extensionUri],
		};
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        //监听webview传递的消息
		webviewView.webview.onDidReceiveMessage((data) => {
			switch (data.type) {
				case 'colorSelected': {
					vscode.window.activeTextEditor?.insertSnippet(
						new vscode.SnippetString(`#${data.value}`)
					);
					break;
				}
			}
		});
	}

	public addColor() {
		if (this._view) {
            //发送消息
			this._view.webview.postMessage({ type: 'addColor' });
		}
	}

	public clearColors() {
		if (this._view) {
			this._view.webview.postMessage({ type: 'clearColors' });
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
		);

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css')
		);
		const styleVSCodeUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css')
		);
		const styleMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css')
		);

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Cat Colors</title>
			</head>
			<body>
				<ul class="color-list">
				</ul>

				<button class="add-color-button">Add Color</button>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

```
```js
// js
	const vscode = acquireVsCodeApi();
// Handle messages sent from the extension to the webview
	window.addEventListener('message', (event) => {
		const message = event.data; // The json data that the extension sent
		switch (message.type) {
			case 'addColor': {
				addColor();
				break;
			}
			case 'clearColors': {
				colors = [];
				updateColorList(colors);
				break;
			}
		}
	});
// 发送消息
    vscode.postMessage({ type: 'colorSelected', value: color });
```
然后将这个class使用`registerWebviewViewProvider`注册
```js
export function activate(context: vscode.ExtensionContext) {
	const provider = new ColorsViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider)
	);
}
```

如果需要显示在侧边栏上，需要注册 `type`

```js
"views": {
			"explorer": [
				{
					"type": "webview",
					"id": "calicoColors.colorsView",
					"name": "Calico Colors"
				}
			]
		},
```