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