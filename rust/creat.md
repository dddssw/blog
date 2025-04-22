---
outline: deep
---

```rust
use crate::garden::vegetables::Asparagus;//表示当前的crate。也就是当前项目。通常在项目的主文件（如 main.rs 或 lib.rs）中，crate 代表当前的crate

pub mod garden;//告诉编译器包含它在 src/garden.rs
```

as可以重命名
```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}
```

重新导出
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}

```

减少冗余
```rust
use std::cmp::Ordering;
use std::io;

use std::{cmp::Ordering, io};

use std::io;
use std::io::Write;

use std::io::{self, Write};
```

*代表全部导入
```rust
use std::collections::*;
```

Rust 会在与模块同名的文件中查找该模块的代码