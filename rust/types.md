---
outline: deep
---
与 JavaScript 或 Python 等动态类型语言相比，Rust 需要你提前做出更多规划。你必须明确
写出各个函数参数和返回值的类型、结构体字段以及一些其他结构体

但是rust支持类型推断,和泛型能帮我们减轻这方面的压力


# 类型推断可能不会进行(所有权类型，借用类型)
```rust
println!("{}", (-4).abs());//报错
```
令人不解：明明所有的有符号整型都有一个 abs 方法，那么问题出在哪里呢？出于技术原因，Rust 在调用类型本身的方法之前必须确切地知道一个值属于哪种整型。只有在解析完所有方法调用后类型仍然不明确的时候，才会默认为 i32，但这里并没有其他方法可供解析，因此 Rust 提供不了帮助。解决方案是加上后缀或使用特定类型的函数来明确写出希望的类型

另外,方法调用的优先级高于一元前缀运算符，因此在将方法应用于负值时要小心
# 数据类型
固定尺寸的数据类型是可以直接放栈上的，创建和回收都比在堆上动态分配的动态数组性能要好
## 整数类型

- **i8**: 8 位宽有符号整数
- **i16**: 16 位宽有符号整数
- **i32**: 32 位宽有符号整数
- **i64**: 64 位宽有符号整数
- **i128**: 128 位宽有符号整数
- **u8**: 8 位宽无符号整数
- **u16**: 16 位宽无符号整数
- **u32**: 32 位宽无符号整数
- **u64**: 64 位宽无符号整数
- **u128**: 128 位宽无符号整数
- **isize**: 与机器字大小（32 位或 64 位）一样大的符号整数
- **usize**: 与机器字大小（32 位或 64 位）一样大的无符号整数


Rust 中的整型字面量可以带上一个后缀来指示它们的类型：42u8 是 u8 类型，1729isize是 isize 类型

前缀 0x、0o 和 0b 分别表示十六进制字面量、八进制字面量和二进制字面量

为了让长数值更易读，可以在数字之间任意插入下划线。例如，可以将 u32 的最大值写为4_294_967_295。下划线的具体位置无关紧要，因此也可以将十六进制数或二进制数按 4 位数字而非 3 位数字进行分组（如 0xffff_ffff），或分隔开数字的类型后缀（如127_u8）

::: tip
尽管数值类型和 char 类型是不同的，但 Rust 确实为 u8 值提供了字节字面量。与字符字面量类似，b'X' 表示以字符 X 的 ASCII 码作为 u8 值。例如，由于 A 的 ASCII 码是 65，因此字面量 b'A' 和 65u8 完全等效。只有 ASCII 字符才能出现在字节字面量中
:::
## 浮点类型

- **f32**: 单精度 IEEE 浮点数
- **f64**: 双精度 IEEE 浮点数

## 布尔类型

- **bool**: 布尔值

rust非常严苛,他不会进行隐式转换.像 if 和 while 这样的控制结构要求它们的条件必须是 bool 表达式，短路逻辑运算符 && 和 || 也是如此。你必须写成 if x !=
0 { ... }，而不能只写成 if x { ... }

as 运算符可以将 bool 值转换为整型,但是无法反向转换
## 字符类型

- **char**: Unicode 字符，32 位宽（4 字节）

## 元组类型

- **(char, u8, i32)**: 元组，允许混合类型
- **()**: 单元类型（空元组）,函数没有返回,默认就是返回它()


元组的每个元素可以有不同的类型，而数组的元素必须都是相同的类型。另一方面，元组只允许用常量作为索引，比如 t.4。不能通过写成 t.i 或 t[i] 的形式来获取第 i 个元素。


字面量 ("lonely hearts",) 就是一个包含单个字符串的元组，它的类型是 (&str,).值后面的逗号是必需的，以用于区分单值元组和简单的括号表达式
## 结构体类型

- **struct S { x: f32, y: f32 }**: 具名字段型结构体
- **struct T(i32, char);**: 元组型结构体 struct Color(i32, i32, i32) 元组结构体有类型名，但是无字段名，也就是说字段是匿名的。在有些情况下这很有用，因为想名字是一件很头痛的事情
- **struct E;**: 单元型结构体，无字段

Rust 有个关键字 impl 可以用来给结构体或其他类型实现方法，也就是关联在某个类型上的函数。

```rust
struct Rectangle {
width: u32,
height: u32,
}
impl Rectangle { // 就像这样去实现
fn area(self) -> u32 { // area就是方法，被放在impl实现体中
self.width * self.height
}
}

```
self 的完整写法是 self: Self，而 Self 是 Rust 里一个特殊的类型名，它表示正在被实现（impl）的那个类型

Rust 中所有权形式和借用形式总是成对出现，在 impl 的时候也是如此。方法的签名中也会对应三种参数形式
```rust
impl Rectangle {
fn area1(self) -> u32 {
self.width * self.height
}
fn area2(&self) -> u32 {
self.width * self.height
}
fn area3(&mut self) -> u32 {
self.width * self.height
}
}
```
关联缓存（静态方法）

关联函数使用类型配合路径符 :: 来调用
```rust
impl Rectangle {
fn numbers(rows: u32, cols: u32) -> u32 {
rows * cols
}
}

Rectangle::numbers(10, 10);
```
方法调用的时候，直接在实例上使用 . 操作符调用，然后第一个参数是实例自身，会默认传进去，因此不需要单独写出来。

没有构造函数，所有需要自己写一个类似功能的函数
```rust
impl Rectangle {
pub fn new(width: u32, height: u32) -> Self {
Rectangle {
width,
height,
}
}
}

let rect1 = Rectangle::new(30, 50);
```

在对结构体做实例化的时候，Rust 又给我们提供了一个便利的设施，Default
```rust
#[derive(Debug, Default)] // 这里加了一个Default派生宏
struct Rectangle {
width: u32,
height: u32,
}
fn main() {
let rect1: Rectangle = Default::default(); // 使用方式1
let rect2 = Rectangle::default(); // 使用方式2
println!("{:?}", rect1);
println!("{:?}", rect2);
}
// 打印出如下：
Rectangle { width: 0, height: 0 }
Rectangle { width: 0, height: 0 }
```

可以看到，打出来的实例字段值都 0，是因为 u32 类型默认值就是 0。对于通用类型，比如u32 这种类型来说，取 0 是最适合的值了
## 枚举类型

- **enum Attend { OnTime, Late(u32)}**: 枚举，或代数数据类型

枚举下的条目被叫做变体，变体可以挂载各种不同的类型

### 枚举的实例化
枚举的实例化实际是枚举变体的实例化

```rust
enum WebEvent {
PageLoad,
PageUnload,
KeyPress(char),
Paste(String),
Click { x: i64, y: i64 },
}

let a = WebEvent::PageLoad;
let b = WebEvent::PageUnload;
let c = WebEvent::KeyPress('c');
let d = WebEvent::Paste(String::from("batman"));
let e = WebEvent::Click { x: 320, y: 240 };
```

可以看到，不带负载的变体实例化和带负载的变体实例化不一样。带负载的变体实例化要根据不同变体附带的类型做特定的实例化。

## 类c枚举
```rust
// 给枚举变体一个起始数字值
enum Number {
Zero = 0,
One,
Two,
}
// 给枚举每个变体赋予不同的值
enum Color {
Red = 0xff0000,
Green = 0x00ff00,
Blue = 0x0000ff,
}
fn main() {
// 使用 as 进行类型的转化
println!("zero is {}", Number::Zero as i32);
println!("one is {}", Number::One as i32);
println!("roses are #{:06x}", Color::Red as i32);
println!("violets are #{:06x}", Color::Blue as i32);
}
// 输出
zero is 0
one is 1
roses are #ff0000
violets are #0000ff
```
枚举同样能够被 impl,但是不能对枚举的变体直接 impl

### match
```rust
fn main() {
let number = 13;
// 你可以试着修改上面的数字值，看看下面走哪个分支
println!("Tell me about {}", number);
match number {
// 匹配单个数字
1 => println!("One!"),
// 匹配几个数字
2 | 3 | 5 | 7 | 11 => println!("This is a prime"),
// 匹配一个范围，左闭右闭区间
13..=19 => println!("A teen"),
// 处理剩下的情况
_ => println!("Ain't special"),
}
}
```
### 模式匹配
模式匹配就是按对象值的结构进行匹配，并且可以取出符合模式的值。

当要匹配的分支只有两个或者在这个位置只想先处理一个分支的时候，可以直接用 if let
```rust
let shape_a = Shape::Rectangle;
match shape_a {
Shape::Rectangle => {
println!("1");
}
_ => {
println!("10");
}
};

let shape_a = Shape::Rectangle;
if let Shape::Rectangle = shape_a {
println!("1");
} else {
println!("10");

```

let 本身就支持模式匹配
```rust
let shape_a = Shape::Rectangle {width: 10, height: 20};
// 模式匹配出负载内容
let Shape::Rectangle {width, height} = shape_a else {
panic!("Can't extract rectangle.");
};
println!("width: {}, height: {}", width, height);
}
// 输出
width: 10, height: 20


fn main() {
let a = (1,2,'a');
let (b,c,d) = a;
println!("{:?}", a);
println!("{}", b);
println!("{}", c);
println!("{}", d);
}

match shape_a {
Shape::Rectangle(a_rec) => { // 解出一个结构体
println!("Rectangle {}, {}", a_rec.width, a_rec.height);
}
Shape::Triangle(x, y, z) => { // 解出一个元组
println!("Triangle {:?}, {:?}, {:?}", x, y, z);
}
Shape::Circle {origin, radius} => { // 解出一个结构体的字段
println!("Circle {:?}, {:?}", origin, radius);
}
}
// 输出
Circle (0, 0), 5
```
 Rust 中的模式匹配是一种释放原对象的所有权的方式,从struct中解构会导致所有权的移动

 当我们只需要不可修改的引用，或可修改的引用
```rust
let User {
ref mut name, // 这里加了一个ref mut
age,
student,
} = a;
```
## 指针类型

- **Box`<Attend>`**: Box：指向堆中值的拥有型指针
- **&i32, &mut i32**: 共享引用和可变引用：非拥有型指针，能够超出引用目标

## 字符串类型

- **String**: UTF-8 字符串，动态分配大小
- **&str**: 对 `str` 的引用：指向 UTF-8 文本的非拥有型指针

String不是Char的数组，不能使用下标进行访问

很多时候，我们的字符串字面量中用不到 Unicode 字符，只需要 ASCII 字符集。对于这种情况，Rust 还有一种更紧凑的表示法：字节串。用 b 开头，双引号括起来，比如 b"this is a byte string"。这时候字符串的类型已不是字符串，而是字节的数组 [u8; N]，N 为字节数。
## 数组类型

- **[f64; 4]**: 数组，固定长度，其元素类型为 `f64`
- **[u8; 256]**: 数组，固定长度，其元素类型为 `u8`


## 向量类型

- **`Vec<f64>`**: 向量，可变长度，其元素类型为 `f64`

## 切片类型

- **&[u8]**: 对切片（数组或向量某一部分）的引用，类型为 `u8`
- **&mut [u8]**: 对切片（数组或向量某一部分）的可变引用，类型为 `u8`

## 可选类型

- **Option<&str>**: 可选值：要么为 `None`（无值），要么为 `Some(v)`（有值，其值为 `v`）

## 结果类型

- **Result<u64, Error>**: 可能失败的操作结果：要么为成功值（`Ok(v)`），要么为错误值（`Err(e)`）

## 特型对象类型

- **&dyn Any**: 特型对象，指向任何实现了 `Any` 特性（trait）的类型
- **&mut dyn Read**: 特型对象，指向任何实现了 `Read` 特性（trait）的类型

# 泛型
使用时提供类型参数信息用的是::<>，而定义类型参数的时候只用到<>