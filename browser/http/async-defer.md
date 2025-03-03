---
layout: doc
outline: deep
---
::: raw
当浏览器加载html遇到`<script></script>`,必须立即执行该脚本，如果是外部脚本`<script src=""></script>`,等待下载完再执行

所以可以把脚本放在页面底部

但是对于长的html，只有下载了完整的html才会注意到该脚本，然后开始下载它，对于低速网络，会造成明显的延迟。

幸运的是，这里有两个特性可以为我们解决这个问题：defer 和 async。(仅用于外部脚本)
:::
## defer
脚本将在后台下载，不阻塞html解析。等待dom解析完毕，但在 `DOMContentLoaded` 事件之前执行
::: tip DOMContentLoaded
::: raw
当 HTML 文档已完全解析且所有延迟脚本（`<script defer src="…" />和<script type="module" />`）已下载并执行时，将触发此事件

:::
具有defer特性的脚本按照其相对顺序执行

## async 
也不阻塞html解析，async脚本不会等待其他脚本，async脚本可能在 `DOMContentLoaded` 之前或之后执行