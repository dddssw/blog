---
outline: deep
---
## 固定容器高度，滚动内容高度固定

初始需要计算总高度，和可以展示的元素个数

滚动过程需要计算起点和可以展示元素个数

:::tip
注意开始节点要减去上缓冲区个数

可见节点不能超过剩余的元素
:::
```js
<template>
    <div :style="{ height: viewportHeight + 'px', overflow: 'auto' }" @scroll="handleScroll">
        <div :style="{ height: totalHeight + 'px', overflow: 'hidden' }">
            <div :style="{ transform: `translateY(${offsetY}px)` }">
                <div v-for="(i, index) in showList" :key="index" :style="{ height: rowHeight + 'px' }" class="item">
                    {{ i }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

const { rowHeight, itemCount, viewportHeight, list, pad } = defineProps<{ rowHeight: number, itemCount: number, viewportHeight: number, list: any[], pad: number }>()
const totalHeight = ref(0)
const startIndex = ref(0)
const visibleNodesCount = ref(0)

const showList = computed(() => list.slice(startIndex.value, startIndex.value + visibleNodesCount.value))
const offsetY = computed(() => rowHeight * startIndex.value)
const handleScroll = (event: Event) => {
    const div = event.target as HTMLElement;
    const scrollTop = div.scrollTop;  // 获取当前滚动条的位置
    startIndex.value = Math.max(0,Math.floor(scrollTop / rowHeight)-pad)
    visibleNodesCount.value = Math.min(itemCount - startIndex.value, Math.floor(viewportHeight / rowHeight) + 2 * pad)
};
onMounted(() => {
    totalHeight.value = itemCount * rowHeight
    visibleNodesCount.value = Math.min(itemCount - startIndex.value,Math.floor(viewportHeight / rowHeight) + 2 * pad)
})
</script>

<style scoped lang="scss">
.item {
    border-bottom: 1px solid red;
}
</style>

```
## 固定容器高度，滚动内容高度不固定

首先不会计算未渲染元素的高度，所以需要传入对应的高度

### 需要传入的数据

```vue
<VirtueList :list :itemCount="100" :viewport-height="500" :pad="2"></VirtueList>
```

```js
const list = new Array(100).fill(null).map((item, index) => ({
  name: "Item " + (index + 1),
  height: 40 + (index % 20) * 10,
}));
```

1. list 就是传入的数组，其中包含 height
2. itemCount 总的项数
3. viewport-height 最外面容器的高度
4. pad 缓冲区的大小

### VirtueList 结构

```vue
<template>
  <div
    :style="{ height: viewportHeight + 'px', overflow: 'auto' }"
    @scroll="handleScroll"
  >
    <div :style="{ height: totalHeight + 'px', overflow: 'hidden' }">
      <div :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="(i, index) in showList"
          :key="index"
          :style="{ height: i.height + 'px' }"
          class="item"
        >
          {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>
```

最外面 div 就是设定高度的窗口，内部一层的 div 需要计算出总高度，再内部一层的 div 通过 translateY XX 移动到合适的位置，他是相当于包裹它的 div 移动

::: tip
获取总高度的原因是我们的滚动条大小应该跟显示全部元素一样
:::

监听 scroll 可以获取起始的节点，和应该显示多少个节点，这里的节点包括缓冲区的数量

首先构建一个高度的数组，之后借助它找到开始节点位置

```js
const height = ref<number[]>([])

onMounted(() => {
  for (let i = 0; i < list.length; i++) {
        if (i === 0) {
            height.value[i] = 0
        } else {
            height.value[i] = height.value[i - 1] + list[i - 1].height
        }
    }
})
```

总高度也就是最后一个元素加上它的高度

```js
const totalHeight = ref(0);
totalHeight.value =
  height.value[height.value.length - 1] + list[list.length - 1].height;
```

显然页面刚显示开始节点 index 为 0，需要计算可见的元素的个数

```js
const visibleNodesCount = ref(0);

let index = height.value.findIndex((i) => i >= viewportHeight);
if (~index) {
  visibleNodesCount.value = index + 1 + 2 * pad;
} else {
  //元素总高度不够窗口高度
  visibleNodesCount.value = itemCount;
}
```

处理滚动的位置 handleScroll，利用之前生成的高度数组，结合二分查找找到开始节点

```js
//二分
function search(list: any, target: number, left: number, right: number) {
  if (left > right) {
    return left;
  }
  let mid = Math.floor((left + right) / 2);
  console.log(target, list.value[mid]);
  if (target < list.value[mid]) {
    return search(list, target, left, mid - 1);
  } else if (target > list.value[mid]) {
    return search(list, target, mid + 1, right);
  } else {
    return mid;
  }
}
```

```js
const handleScroll = (event: Event) => {
    const div = event.target as HTMLElement;
    const scrollTop = div.scrollTop;  // 获取当前滚动条的位置
    const index = search(height, scrollTop, 0, list.length - 1)
    startIndex.value = index
    //这个变量为了判断从开始节点之后的节点加起来的高度有没有窗口高
    let count = 0
    for (let i = startIndex.value + 1; i < height.value.length; i++) {
        if ((height.value[i] - height.value[startIndex.value]) > viewportHeight) {
            count = i-startIndex.value
            break
        }
    }
    //没有就展示剩下的节点即可
    if (count === 0) {
        visibleNodesCount.value = itemCount - startIndex.value
    } else {
        //加上缓冲区的数量
        visibleNodesCount.value = count + 2 * pad
    }
};
```
因此需要展示的数据
```js
const showList = computed(() => list.slice(startIndex.value, startIndex.value + visibleNodesCount.value))
```
translateY移动的距离
```js
const offsetY = computed(() => height.value[startIndex.value])
```

### 完整代码

```js
<template>
    <div :style="{ height: viewportHeight + 'px', overflow: 'auto' }" @scroll="handleScroll">
        <div :style="{ height: totalHeight + 'px', overflow: 'hidden' }">
            <div :style="{ transform: `translateY(${offsetY}px)` }">
                <div v-for="(i, index) in showList" :key="index" :style="{ height: i.height + 'px' }" class="item">
                    {{ i }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

const { rowHeight, itemCount, viewportHeight, list, pad } = defineProps<{ rowHeight: number, itemCount: number, viewportHeight: number, list: any[], pad: number }>()
const totalHeight = ref(0)
const startIndex = ref(0)
const visibleNodesCount = ref(0)
const height = ref<number[]>([])

const showList = computed(() => list.slice((startIndex.value), startIndex.value + visibleNodesCount.value))
const offsetY = computed(() => height.value[startIndex.value])
const handleScroll = (event: Event) => {
    const div = event.target as HTMLElement;
    const scrollTop = div.scrollTop;  // 获取当前滚动条的位置
    const index = search(height, scrollTop, 0, list.length - 1)
    startIndex.value = Math.max(0,index-pad)
    let count = 0
    for (let i = startIndex.value + 1; i < height.value.length; i++) {
        if ((height.value[i] - height.value[startIndex.value]) > viewportHeight) {
            count = i - startIndex.value
            break
        }
    }
    if (count === 0) {
        visibleNodesCount.value = itemCount - startIndex.value
    } else {
        visibleNodesCount.value = count + 2 * pad
    }
};
onMounted(() => {
    for (let i = 0; i < list.length; i++) {
        if (i === 0) {
            height.value[i] = 0
        } else {
            height.value[i] = height.value[i - 1] + list[i - 1].height
        }
    }
    totalHeight.value = height.value[height.value.length - 1] + list[list.length - 1].height
    let index = height.value.findIndex(i => i >= viewportHeight)
    if (~index) {
        visibleNodesCount.value = index + 1 + 2 * pad
    } else {
        visibleNodesCount.value = itemCount
    }
})
function search(list: any, target: number, left: number, right: number) {
    if (left > right) {
        return left
    }
    let mid = Math.floor((left + right) / 2)
    console.log(target, list.value[mid])
    if (target < list.value[mid]) {
        return search(list, target, left, mid - 1)
    } else if (target > list.value[mid]) {
        return search(list, target, mid + 1, right)
    } else {
        return mid
    }
}
</script>

<style scoped lang="scss">
.item {
    border-bottom: 1px solid red;
}
</style>

```
### 参考
[Build your Own Virtual Scroll ](https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib)