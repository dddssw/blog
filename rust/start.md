---
outline: deep
---
为什么学习rust

我们已经进入javaScript第三阶段，越来越多的js工具将使用编译型语言进行编写

并且得益于Rust WebAssembly工作组的不懈努力，使得rust编译为WebAssembly成为可能

## 编译型/解释型语言
编译型：需要使用编译器，不同平台需要生成不同的机器语言
解释性: 例如js，通过js解释器（v8）来生成机器语言，没有跨平台的问题

Cargo 是 Rust 的构建系统和包管理器

* 我们可以使用创建一个项目cargo new。
* 我们可以使用 来构建一个项目cargo build。
* 我们可以使用 一步构建并运行一个项目cargo run。
* 我们可以构建一个项目，而无需生成二进制文件来检查错误 cargo check。
* Cargo 不会将构建结果保存在与代码相同的目录中，而是将其存储在target/debug目录中。

当您的项目最终准备好发布时，您可以使用cargo build --release优化来编译它