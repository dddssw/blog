---
outline: deep
---

WebAssembly 是一种可以在现代 Web 浏览器中运行的代码——它是一种低级汇编类语言，具有紧凑的二进制格式，运行时性能接近原生性能，并为 C/C++、C# 和 Rust 等语言提供编译目标，以便它们可以在 Web 上运行。它还可以与 JavaScript 一起运行，使两者可以协同工作。

::: tip
WebAssembly 也可以在 Web 和 JavaScript 环境之外使用
:::

WebAssembly 是一种不同于 JavaScript 的语言，但它并非旨在替代 JavaScript。相反，它旨在补充和配合 JavaScript，让 Web 开发人员能够充分利用这两种语言的优势

## 关键概念

- Module：表示已由浏览器编译为可执行机器代码的 WebAssembly 二进制文件。Module 是无状态的。Module 声明导入和导出的方式与 ES 模块类似
- Memory：一个可调整大小的 ArrayBuffer，包含由 WebAssembly 的低级内存访问指令读取和写入的字节线性数组。
- Table: 可调整大小的引用类型数组（例如，对函数的引用），否则不能以原始字节的形式存储在内存中（出于安全性和可移植性的原因）。
- Instance：一个模块与其在运行时使用的所有状态（包括内存、表和一组导入值）配对。实例就像一个 ES 模块，它已加载到具有一组特定导入的特定全局变量中。

JavaScript API 为开发人员提供了创建模块、内存、表和实例的能力。给定一个 WebAssembly 实例，JavaScript 代码可以同步调用其导出，这些导出以普通 JavaScript 函数的形式公开。WebAssembly 代码还可以通过将这些 JavaScript 函数作为导入传递给 WebAssembly 实例来同步调用任意 JavaScript 函数。

## 将rust编译为wasm
我们使用wasm-pack（一种在 Rust 中构建 JavaScript 包的工具）构建一个包。此包将仅包含 WebAssembly 和 JavaScript 代码，因此用户不需要安装 Rust

```js
cargo new --lib hello-wasm

cargo install wasm-pack

//替换成
use wasm_bindgen::prelude::*;

//从 Rust 调用 JavaScript 中的外部函数
#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

//生成 JavaScript 可以调用的 Rust 函数
#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}
```

wasm-pack使用wasm-bindgen另一个工具在 JavaScript 和 Rust 类型之间架起桥梁。它允许 JavaScript 使用字符串调用 Rust API，或使用 Rust 函数捕获 JavaScript 异常。

## 将代码编译为 WebAssembly

为了正确编译我们的代码，我们首先用 对其进行配置Cargo.toml。打开此文件，并将其内容更改为如下所示：
```js
[package]
name = "hello-wasm"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
description = "A sample project with wasm-pack"
license = "MIT/Apache-2.0"
repository = "https://github.com/yourgithubusername/hello-wasm"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```
## 开始构建
```js
wasm-pack build --target web
```
* 将您的 Rust 代码编译为 WebAssembly。
* 在该 WebAssembly 上运行wasm-bindgen，这会将您的 WebAssembly 模块包装在 JS 包装器中，从而使人们更容易与您的模块进行交互。wasm-bindgen支持 ES6 模块和 CommonJS，您可以使用它wasm-pack来生成任一类型的包！

为此，wasm-pack将：

- 如果需要，安装和/或更新wasm-bindgen
- 运行wasm-bindgen，生成一个新.wasm文件和一个.js文件
- 将生成的文件移动到新pkg目录

* 创建一个pkg目录并将该 JavaScript 文件和 WebAssembly 代码移动到其中。
* 读取您的Cargo.toml并产生等效的package.json。
* 将您的README.md（如果有）复制到包中。

## 使用
```js
 <script type="module">
      import init, { greet } from "./pkg/hello_wasm.js";
      init().then(() => {
        greet("WebAssembly");
      });
    </script>
```

[流式传输 WebAssembly 模块](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Using_the_JavaScript_API#streaming_the_webassembly_module)