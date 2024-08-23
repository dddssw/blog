---
layout: doc
outline: deep
---
## 与浏览器类比
都是js运行时环境，node基于V8引擎（c++），但是node不具有webapi,例如dom,bom.但是提供了一些特有的api

node支持CommonJs,ES模块系统(since Node.js v12),浏览器正在进行ES模块系统的实施

## 获取文件信息
1. fs.stat
```js
const fs = require('node:fs');
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err);
  }
  // we have access to the file stats in `stats`
});
```
2. fs.statSync

阻塞线程直到文件统计信息准备就绪
```js
const fs = require('node:fs');
try {
  const stats = fs.statSync('/Users/joe/test.txt');
} catch (err) {
  console.error(err);
}
```
3. fs.stat 

引入库不同node:fs/promises，基于promise
```js
const fs = require('node:fs/promises');
async function example() {
  try {
    const stats = await fs.stat('/Users/joe/test.txt');
    stats.isFile(); // true
    stats.isDirectory(); // false
    stats.isSymbolicLink(); // false
    stats.size; // 1024000 //= 1MB
  } catch (err) {
    console.log(err);
  }
}
example();
```
## 文件路径
### 从路径获取信息
给定一条路径，可以使用以下方法从中提取信息：

* dirname：获取文件的父文件夹
* basename：获取文件名部分
* extname：获取文件扩展名
```js
const path = require('node:path');
const notes = '/users/joe/notes.txt';
path.dirname(notes); // /users/joe
path.basename(notes); // notes.txt
path.extname(notes); // .txt
```
可以通过指定第二个参数来获取不带扩展名的文件名basename
```js
path.basename(notes, path.extname(notes)); // notes
```
### 使用路径
1. path.join

拼接路径
```js
const name = 'joe';
path.join('/', 'users', name, 'notes.txt'); // '/users/joe/notes.txt'
```
2. path.resolve

计算相对路径的绝对路径  
[参考](https://juejin.cn/post/7319418651070119999#heading-1)

3. path.normalize
当它包含相对说明符（如或..或双斜杠）时，它将尝试计算实际路径
```js
path.normalize('/users/joe/..//test.txt'); // '/users/test.txt'
```
## 读取文件

向其传递文件路径、编码和将使用文件数据（和错误）调用的回调函数
1. fs.readFile
```js
const fs = require('node:fs');
fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```
2. fs.readFileSync
同步版本
3. promise形式
```js
const fs = require('node:fs/promises');
async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
example();
```

这三个fs.readFile()，fs.readFileSync()并fsPromises.readFile()在返回数据之前读取内存中文件的全部内容。

这意味着大文件将对您的内存消耗和程序执行速度产生重大影响。

在这种情况下，更好的选择是使用流读取文件内容。

## 写入
与读取类似，api是`writeFile`

如果不想全部覆盖可以使用`appendFile`

## 处理文件夹
### 检查文件夹是否存在
fs.access
### 创建文件夹
fs.mkdir
### 读取文件夹信息
fs.readdir

读取文件夹的内容，包括文件和子文件夹，并返回它们的相对路径

读取完整路径
```js
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```
### 重命名文件夹
fs.rename

## 终端
## 从命令行执行node脚本
最常见的是node 文件名执行，这样明确告诉终端使用node运行该文件

也可以这样
```js
#!/usr/bin/env node
```
## 读取环境变量
process.env
## 输出内容到终端
chalk progress
## 接受来自命令行的输入
inquirer