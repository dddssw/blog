# 为什么学习 Rust

我们已经进入 JavaScript 的第三阶段，越来越多的 JavaScript 工具将使用编译型语言进行编写。

得益于 Rust WebAssembly 工作组的不懈努力，Rust 编译为 WebAssembly 已成为可能。

## 编译型与解释型语言

### 编译型语言
编译型语言需要使用编译器，不同平台需要生成不同的机器语言。例如，Rust、C、C++ 等。

### 解释型语言
解释型语言通过解释器（如 V8）来生成机器语言，因此没有跨平台的问题。例如，JavaScript。

---

## Cargo：Rust 的构建系统和包管理器

- **创建项目**：  
  使用 `cargo new` 创建一个新项目。

- **构建项目**：  
  使用 `cargo build` 来构建一个项目。

- **构建并运行项目**：  
  使用 `cargo run` 一步构建并运行一个项目。

- **检查代码错误**：  
  使用 `cargo check` 构建项目而无需生成二进制文件，以便检查代码中的错误。

- **构建结果的存储**：  
  Cargo 不会将构建结果保存在与代码相同的目录中，而是将其存储在 `target/debug` 目录中。

- **发布优化**：  
  当项目准备好发布时，可以使用 `cargo build --release` 来进行优化构建。

---

## Rust 函数返回值

在 Rust 中，如果一个函数体以没有尾随分号的表达式结尾，那么该表达式会成为函数的返回值。实际上，花括号包起来的任意代码块都可以用作表达式。

学习 Rust 可以从以下几个步骤开始，逐步深入掌握其核心概念和实际应用：

---

### **1. 基础准备**
- **安装 Rust 环境**：
  - 使用官方工具 `rustup` 安装 Rust：访问 [rustup.rs](https://rustup.rs/) 或运行命令 `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`。
  - 验证安装：运行 `rustc --version` 和 `cargo --version`。
- **选择开发工具**：
  - 推荐 IDE：VS Code（搭配 `rust-analyzer` 插件）或 JetBrains 的 RustRover。
  - 熟悉 Cargo（Rust 的包管理器和构建工具），它是 Rust 生态的核心。

---

### **2. 系统学习核心概念**
- **必读官方文档**：
  - **《The Rust Programming Language》（俗称 “The Book”）**：[官方在线版](https://doc.rust-lang.org/book/)
    - 涵盖所有基础知识：所有权（Ownership）、借用（Borrowing）、生命周期（Lifetimes）、模式匹配、错误处理等。
    - 每天坚持阅读 1-2 章，配合代码实践。
  - **《Rust by Example》**：[链接](https://doc.rust-lang.org/rust-by-example/)
    - 通过实例快速理解语法和概念。

- **重点攻克难点**：
  - **所有权系统**：理解为什么 Rust 无需垃圾回收也能保证内存安全。
  - **生命周期**：学习如何标注引用的有效范围，避免悬垂指针。
  - **Traits 和泛型**：掌握 Rust 的多态和代码复用机制。
  - **错误处理**：熟练使用 `Result` 和 `Option`，而非异常。

---

### **3. 动手实践**
- **完成 Rustlings 小练习**：
  - 安装：[GitHub - rust-lang/rustlings](https://github.com/rust-lang/rustlings)
  - 包含 100+ 个小练习，覆盖语法、类型系统、错误处理等。
- **写小型项目**：
  - 入门级：命令行工具（如计算器、Todo List）、文本处理工具。
  - 进阶：实现基础数据结构（链表、哈希表）、解析器（JSON/CSV）、简单 Web 服务器（用 `actix-web` 或 `axum`）。
- **参与开源项目**：
  - 在 GitHub 上寻找标有 `good first issue` 的 Rust 项目，贡献代码或文档。
  - 推荐项目：`ripgrep`（搜索工具）、`alacritty`（终端）、`serde`（序列化库）。

---

### **4. 深入高级主题**
- **异步编程**：
  - 学习 `async/await` 语法，使用 `tokio` 或 `async-std` 运行时。
  - 项目实践：用 `reqwest` 写异步 HTTP 客户端，或用 `warp` 构建高性能 API。
- **Unsafe Rust**：
  - 理解 `unsafe` 关键字的使用场景（如操作裸指针、调用 C 库）。
  - 阅读《The Rustonomicon》：[链接](https://doc.rust-lang.org/nomicon/)
- **宏（Macros）**：
  - 学习声明宏（`macro_rules!`）和过程宏，用于元编程。
- **嵌入式开发**：
  - 使用 `embedded-hal` 生态开发硬件项目（如 Raspberry Pi、Arduino）。

---

### **5. 利用社区资源**
- **问答与交流**：
  - 官方论坛：[users.rust-lang.org](https://users.rust-lang.org/)
  - Reddit 社区：r/rust
  - 中文社区：Rust 中文论坛（[rustcc.cn](https://rustcc.cn/)）
- **进阶书籍**：
  - 《Programming Rust》（O'Reilly）：深入语言细节。
  - 《Rust for Rustaceans》：专为已入门者设计。
  - 《Zero To Production In Rust》：学习用 Rust 构建 Web 服务。

---

### **6. 工具与生态**
- **调试工具**：
  - 使用 `dbg!` 宏快速调试，或配置 VS Code 的调试器。
  - 性能分析工具：`perf`（Linux）、`flamegraph`。
- **代码质量**：
  - 用 `clippy` 静态检查代码，用 `rustfmt` 统一代码风格。
- **包管理**：
  - 熟悉 `Cargo.toml` 配置，掌握依赖管理和发布流程。

---

### **7. 保持持续学习**
- **关注更新**：
  - Rust 每 6 周发布一个新版本，关注 [Rust Blog](https://blog.rust-lang.org/)。
- **参与活动**：
  - 参加 RustConf、本地 Meetup 或线上黑客松。
- **代码精读**：
  - 阅读标准库源码（如 `Vec`、`Option` 的实现），学习最佳实践。

---

通过结合理论学习和实践项目，你会逐步克服 Rust 的陡峭学习曲线，最终掌握这门强大且现代的语言。遇到问题时，记住 Rust 社区以友好著称，随时可以寻求帮助！ 🚀

## 编译型/解释型语言
编译型：需要使用编译器，不同平台需要生成不同的机器语言
解释性: 例如js，通过js解释器（v8）来生成机器语言，没有跨平台的问题
---

## 单元测试

Rust 提供了强大的单元测试功能。在代码中，我们可以使用 `#[test]` 属性来标记测试函数。以下是一个示例：

```rust
#[test]
fn test_gcd() {
    assert_eq!(gcd(14, 15), 1);
    assert_eq!(gcd(2 * 3 * 5 * 11 * 17,
                   3 * 7 * 11 * 13 * 19),
               3 * 11);
}


```
* #[test]：标记 test_gcd 为测试函数，在正常编译时会跳过它。
* 但是，当我们使用 cargo test 命令运行程序时，Cargo 会自动包含并运行所有标记为测试的函数。
* 测试函数可以分散在源代码树中的任何位置，紧跟着它们所测试的代码。cargo test 会自动收集并运行这些测试函数。

## 所有权
引用是非拥有指针
```rust
fn main() {
    let m1 = String::from("Hello");
    let m2 = String::from("world");
    greet(&m1, &m2); // note the ampersands
    let s = format!("{} {}", m1, m2);
}

fn greet(g1: &String, g2: &String) { // 指向栈
    println!("{} {}!", g1, g2);
}
```

取消引用

```rust
fn main() {
let mut x: Box<i32> = Box::new(1);
let a: i32 = *x;         // *x reads the heap value, so a = 1
*x += 1;                 // *x on the left-side modifies the heap value,
                         //     so x points to the value 2

let r1: &Box<i32> = &x;  // r1 points to x on the stack
let b: i32 = **r1;       // two dereferences get us to the heap value

let r2: &i32 = &*x;      // r2 points to the heap value directly,取消引用该框以获取堆上的值，然后创建对该值的引用
let c: i32 = *r2;    // so only one dereference is needed to read it
}
```
取消引用允许您访问或修改存储在引用中的数据，例如Box，它将数据保存在堆上，而引用本身存储在栈上。

* 一个所有权型变量的可变引用与不可变引用的作用域不能交叠
* 同一个所有权型变量的可变借用之间的作用域也不能交叠
* 在有借用存在的情况下，不能通过原所有权型变量对值进行更新。当借用完成后（借用的作用域结束后），物归原主，又可以使用所有权型变量对值做更新操作了

## 修复所有权错误
```rust
fn return_a_string() -> &String {
    let s = String::from("Hello world");
    &s
}
// s生命周期在函数执行后就会消亡
```