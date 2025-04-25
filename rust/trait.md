---
outline: deep
---
trait TraitA {} 就定义了一个 trait，TraitA

这个标记被用在特定的地方，也就是类型参数的后面，用来限定（bound）这个类型参数可能的类型范围。所以 trait 往往是跟类型参数结合起来使用的。比如 T: TraitA 就是使用 TraitA 对类型参数 T 进行限制。也就是对泛型进行限制

我们怎么给某种具体的类型实现 TraitA，来让那个具体的类型可以代入 T 呢？具体来说，我们要对某个类型 Atype 实现某个 trait 的话，使用语法 impl TraitA for Atype {} 就可以做到

```rust
trait TraitA {}
struct Atype;
impl TraitA for Atype {}
```
对于某个类型 T （这里指的是某种具体的类型）来说，如果它实现了这个 TraitA，我们就说这个类型满足约束.一个 trait 在一个类型上只能被实现一次

trait 对类型参数实施约束的同时，也对具体的类型提供了能力

在 trait 里可以定义关联函数,只是定义没有实现
```rust
trait Sport {
fn play(&self); // 注意这里直接以分号结尾，表示函数签名
fn play_mut(&mut self);
fn play_own(self);
fn play_some() -> Self;
}
```

在 trait 中可以使用 Rust 语言里的标准类型 Self，用来指代将要被实现这个 trait的那个类型。使用 impl 语法将一个 trait 实现到目标类型上去。
```js
struct Football;
impl Sport for Football {
fn play(&self) {} // 注意函数后面的花括号，表示实现
fn play_mut(&mut self) {}
fn play_own(self) {}
fn play_some() -> Self { Self }
}
```

当然也可以在trait定义时默认实现
```rust
trait Sport {
fn play(&self) {} // 注意这里一对花括号，就是trait的关联函数的默认实现
fn play_mut(&mut self) {}
fn play_own(self); // 注意这里是以分号结尾，就表示没有默认实现
fn play_some() -> Self;
} 

//有了 trait 关联函数的默认实现后，具体类型在实现这个 trait 的时候，就可以“偷懒”，直接利用默认实现

struct Football;
impl Sport for Football {
fn play_own(self) {}
fn play_some() -> Self { Self }
}

//也可以覆盖默认实现
```

## 关联类型
定义 trait 时声明，在把 trait 实现到类型上的时候为其指定具体的类型
```rust
pub trait Sport {
type SportType;//声明关联类型
fn play(&self, st: Self::SportType);
}
struct Football;
pub enum SportType {
Land,
Water,
}
impl Sport for Football {
type SportType = SportType; // 给这个关联类型指定具体的类型，这里故意取相同的名字，不同的名字也是可以的
fn play(&self, st: Self::SportType){} // 方法中用到了关联类型
}
fn main() {
let f = Football;
f.play(SportType::Land);//Rust 会自动将 f 作为第一个参数传递给 &self，你只需要传入第二个参数 SportType::Land
}
```

## 关联常量
关联常量可以在 trait 定义的时候指定，也可以在给具体的类型实现的时候指定
```rust
trait TraitA {
const LEN: u32 = 10;
}

struct A;
impl TraitA for A {
const LEN: u32 = 12;
}
fn main() {
println!("{:?}",A::LEN);
println!("{:?}",<A as TraitA>::LEN);//把类型 A 视为 实现了 TraitA 的类型
}
//输出
12
12
```

在 impl 的时候不指定

```rust
trait TraitA {
const LEN: u32 = 10;
}
struct A;
impl TraitA for A {}
fn main() {
println!("{:?}",A::LEN);
println!("{:?}",<A as TraitA>::LEN);
}
//输出
10
10
```
## where
当类型参数后面有多个 trait 约束的时候，会显得“头重脚轻”，比较难看，所以 Rust 提供了 Where 语法来解决这个问题。
```rust
fn doit<T: TraitA + TraitB + TraitC + TraitD + TraitE>(t: T) -> i32 {}
//改为
fn doit<T>(t: T) -> i32
where
T: TraitA + TraitB + TraitC + TraitD + TraitE
{}
```
## 约束依赖
```rust
trait TraitA: TraitB {}
```

这不是继承，这个语法的意思是如果某种类型要实现 TraitA，那么它也要同时实现 TraitB

```rust
trait Shape { fn area(&self) -> f64; }
trait Circle : Shape { fn radius(&self) -> f64; }
//相当于
trait Shape { fn area(&self) -> f64; }
trait Circle where Self: Shape { fn radius(&self) -> f64; }//用于 trait 定义时：指定实现 trait 的类型（Self）必须满足某些条件
```

约束之间是完全平等的，理解这一点非常重要

## 约束中同名方法的访问
有的时候多个约束上会定义同名方法
```rust
trait Shape {
fn play(&self) { // 定义了play()方法
println!("1");
}
}
trait Circle : Shape {
fn play(&self) { // 也定义了play()方法
println!("2");
}
}
struct A;
impl Shape for A {}
impl Circle for A {}
impl A {
fn play(&self) { // 又直接在A上实现了play()方法
println!("3");
}
}
fn main() {
let a = A;
a.play(); // 调用类型A上实现的play()方法
<A as Circle>::play(&a); // 调用trait Circle上定义的play()方法
<A as Shape>::play(&a); // 调用trait Shape上定义的play()方法
}
//输出
3
2
1
```
在 Rust 中，同名方法没有被覆盖，能精准地路由过去。

`<A as Circle>::play(&a)`; 这种语法，叫做完全限定语法，是调用类型上某一个方法的完整路径表达。如果 impl 和 impl trait 时有同名方法，用这个语法就可以明确区分出来

```rust
use std::fmt::Display;

struct Pair<T> {
x: T,
y: T,
}
impl<T> Pair<T> { // 第一次 impl
fn new(x: T, y: T) -> Self {
Self { x, y }
}
}
impl<T: Display + PartialOrd> Pair<T> { // 第二次 impl
fn cmp_display(&self) {
if self.x >= self.y {
println!("The largest member is x = {}", self.x);
} else {
println!("The largest member is y = {}", self.y);
}
}
}
```