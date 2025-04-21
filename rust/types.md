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

声明之后他就是一种新的数据类型，枚举下的条目被叫做变体，变体可以挂载各种不同的类型

如果声明一个ip地址，我们可能会用到结构体

```rust
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};

let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
};
```
但是直接使用枚举可以变得更简约
```rust
enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));

let loopback = IpAddr::V6(String::from("::1"));
```
使用枚举而不是结构体还有另一个优势：每个变体可以包含不同类型和数量的关联数据。版本 4 的 IP 地址始终包含四个数值部分，其值介于 0 到 255 之间。如果我们想将V4地址存储为四个u8值，但仍将V6其表示为一个String值，那么使用结构体就无法实现。枚举可以轻松处理这种情况

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

可以在变体中嵌入多种类型
```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```
* Quit根本没有与之相关的数据。
* Move具有命名字段，就像结构体一样。
* Write包括一个String。
* ChangeColor包括三个i32值。

也可以在枚举中定义方法

```rust
    impl Message {
        fn call(&self) {
            // method body would be defined here
        }
    }

    let m = Message::Write(String::from("hello"));
    m.call();
```
### 枚举Option
包含在 prelude 中；您无需显式地将其引入作用域。它的变体也包含在 prelude 中：您可以直接使用Some和None
```rust
let some_number = Some(5);//Option<i32>
let some_char = Some('e');Option<char>

let absent_number: Option<i32> = None;//编译器无法推测出类型，所以要显示声明
```
当我们拥有一个Some值时，我们知道该值存在，并且该值保存在 中Some。当我们拥有一个None值时，在某种意义上，它的含义与 null 相同：我们没有有效的值

但是这个例子编译不了
```rust
    let x: i8 = 5;
    let y: Option<i8> = Some(5);

    let sum = x + y;//因为x,y是不同类型，自然无法相加
```
i8类型我们不需要担心他是一个空值，但是对于类型是`Option<i8>`我们不得不考虑他可能是个空值，所以应该把`Option<i8>`转成i8

为了获得可能为空的值，您必须明确选择将该值的类型设为Option<T>。然后，当您使用该值时，您需要明确处理该值为空的情况。只要值的类型不是 Option<T>，您就可以安全地假设该值不为空

### match
好的有了枚举可以使用match来增强功能
```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```
match使用上很像if，但是if必须接受一个布尔值。match分支由两部分组成，一个模式和一些代码

如果匹配分支代码较短，我们通常不使用花括号。如果要在匹配分支中运行多行代码，则必须使用花括号

_ 代表默认处理下面的所以情况
```rust
 match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => (),
    }
```
匹配分支的另一个有用特性是它们可以绑定到与模式匹配的值的部分。这就是我们从枚举变量中提取值的方法。

例如匹配`Option<T>`，可以拿到里面的i
```rust
 match x {
            None => None,
            Some(i) => Some(i + 1),
        }
```

模式匹配与数据（所有权）如何交互
```rust
let opt: Option<String> = Some(String::from("Hello world"));

match opt {
    Some(_) => println!("Some!"),
    None => println!("None!"),
}

println!("{:?}", opt); // 这段代码可以编译通过，因为 _ 没有获取所有权。
//_是一个占位符，用于忽略Some内部的值。Rust 并没有移动这个值，opt在匹配后仍然是有效的，你可以在之后使用它
```
```rust
let opt: Option<String> = Some(String::from("Hello world"));

match opt {
    Some(s) => println!("Some: {}", s),
    None => println!("None!"),
}

println!("{:?}", opt); // 这段代码不能编译通过。
//Some(s)这个模式Some保留内部的String绑定到变量s上，这意味着opt内部的绑定被转移给了s。
//因此，在match语句执行之后，opt丢失了对String的发票，导致无法再次访问opt，因此编译会报错。
```
如果您不想移动数据，但想借用数据，您可以匹配Option引用&opt，而不是直接匹配opt
```rust
let opt: Option<String> = Some(String::from("Hello world"));

match &opt {  // 匹配的是 &opt（引用）
    Some(s) => println!("Some: {}", s),
    None => println!("None!"),
}

println!("{:?}", opt); // 这段代码可以编译通过，因为我们只是借用了数据。
```
### if let
```rust
if let PATTERN = EXPR {
    // 当 EXPR 匹配 PATTERN 时，执行这部分代码
}
```
if let语法允许你将if和组合let成一种更简洁的方式，以处理匹配一个模式的值，同时忽略其余值。
```rust
//如果使用match
   let config_max = Some(3u8);
    match config_max {
        Some(max) => println!("The maximum is configured to be {max}"),
        _ => (),
    }
//使用if let 
    let config_max = Some(3u8);
    if let Some(max) = config_max {//Some(max)是我们要匹配的模式。它表示我们希望解出包含的值，并将其绑定到变量max上
        println!("The maximum is configured to be {max}");
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