---
outline: deep
---

宏是Rust中允许的一种特性，我们编写生成其他代码的代码，称为元编程（metaprogramming）。这和我们平时使用的函数不同，因为函数是在运行时执行的，而宏是在编译时扩展代码的。

## 声明式宏
`vec!`宏的简化定义
```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

{
    let mut temp_vec = Vec::new();
    temp_vec.push(1);
    temp_vec.push(2);
    temp_vec.push(3);
    temp_vec
}
```
## 过程宏
像函数：接受代码（TokenStream）作为输入，处理后生成新代码（TokenStream）