---
outline: deep
---

不要紧张，不要紧张，不要紧张

反之时间快就要用空间来换，这是互补的。解不出试着创建辅助的变量

## 递归

如果依赖子问题的结果，return dfs(node.left)||dfs(node.right)，当然这只是一个示例，来利用子问题的结果

如果不依赖子问题的结果，例如查找某个子节点符合 XX 要求，需要根据子问题 return 的结果做判断，更新全局变量，所以一般需要在一个函数里执行一个 dfs 函数

考虑：终止条件，接受参数，return 的值

当然终止条件并不是 node 为空即可，具体场景有更复杂的判断

参数的话可以考虑不仅仅一个 node，或者两个 node，或者一个 node,一个其他的什么数据

::: tip 悟了
如果输入的问题本来就是一个大问题，只需要一个 dfs

如果是需要接受一些别的参数，而不是仅仅是大问题，需要辅助函数 dfs
:::

### 二叉树

层序遍历（需要一个队列，一个方向出栈，另一个方向入栈）,要对空树做一个额外的判断

```js
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  const stack = [root];
  const res = [];
  while (stack.length) {
    let len = stack.length;
    let levelRes = [];
    for (let i = 0; i < len; i++) {
      const cur = stack.shift();
      levelRes.push(cur.val);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    res.push(levelRes);
  }
  return res;
};
```

### 将有序数组转成二叉搜索树

二叉搜索树的中序遍历就是有序数组

显然，子问题的结果依赖上个子问题的结果。所以 dfs return 的值很关键

dfs 接受两个参数分别代表起始和终点

```js
var sortedArrayToBST = function (nums) {
  function dfs(left, right) {
    if (left > right) {
      return null;
    }
    let index = Math.floor((left + right) / 2);
    let node = new TreeNode(nums[index]);
    node.left = dfs(left, index - 1);
    node.right = dfs(index + 1, right);
    return node;
  }
  return dfs(0, nums.length - 1);
};
```

### 对称二叉树

dfs 也接受两个参数，当然最开始是都是 root

### 最近的祖先节点

感觉很经典

```js
var lowestCommonAncestor = function (root, p, q) {
  let res;
  function dfs(node) {
    if (!node || res) {
      return false;
    }
    const left = dfs(node.left); //先拿到子问题的答案再说
    const right = dfs(node.right); //先拿到子问题的答案再说
    //根据子问题答案来确定当前这个节点是否符合要求，不符合就考虑它的return
    if (left && right) {
      res = node;
    }
    if ((node === p || node === q) && (left || right)) {
      res = node;
    }
    return node === p || node === q || left || right;
  }
  dfs(root);
  return res;
};
```

### 路径总和|||

这个思路都是一样的，记录总数以及个数在 map 里，这个 map 初始数组 new Map([[0,1]])。再声明一个总和 sum

它不需要依赖子问题的答案，因为已经记录在 map 里，然后类似于回溯吧，递归完还原 map 和 sum

### 从前序，中序构造二叉树

从前序可以知道根节点，但是怎么在中序中找到这个节点，除了二分查找之外，也可以使用一个 map 保存数据及其下标

### 递归转迭代（抽象）

需要一个栈，以及一个变量来记住当前遍历的节点.......

## 回溯

类似与穷举，但是可以通过剪枝来提高效率

```js
function foo(nums){
  let res = []
  let path = []
  function dfs(){
    //退出条件
    if(){
      res.push([...path])
      return
    }
    for(){//循环
      if(){//剪枝
        path.push(X)
        dfs()
        path.pop()//退出需要还原数据
      }
    }
  }
  dfs()
  return res
}
```

### 全排列

没有选与不选，反之路径的长度跟 nums.length 一样

这不是子序列

```js
var permute = function (nums) {
  let visited = [];
  let path = [];
  let res = [];
  function dfs() {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (!visited.includes(nums[i])) {
        visited.push(nums[i]);
        path.push(nums[i]);
        dfs();
        path.pop();
      }
    }
  }
  dfs();
  return res;
};

//时：n!*n（n是复制的时候产生的）
//空：n
```

### 子集

从数组里选，[1,2]与[2,1]算一个

```js
var subsets = function (nums) {
  let res = [];
  let path = [];
  function dfs(j) {
    //j用来从那个下标开始循环，因为之前的不能用
    res.push([...path]);
    for (let i = j; i < nums.length; i++) {
      path.push(nums[i]);
      dfs(i + 1); //这里是i+1而不是j+1，因为取当前实际遍历的后面子数组
      path.pop();
    }
  }
  dfs(0);
  return res;
};

//时：2^n*n
//空：n
```

### 括号生成

```js
var generateParenthesis = function (n) {
  let path = [];
  let res = [];
  let left = 0; //辅助变量
  let right = 0; //辅助变量
  function dfs() {
    if (left < right || left > n || right > n) {
      //先判断这个
      return;
    }
    if (path.length === 2 * n) {
      res.push(path.join(""));
      return;
    }

    path.push("(");
    left++;
    dfs();
    left--;
    path.pop();

    path.push(")");
    right++;
    dfs();
    right--;
    path.pop();
  }
  dfs();
  return res;
};
```

### 单词搜索

先找到头，然后进行回溯。这里的 for 是循环四个方向

```js
var exist = function (board, word) {
  let len = word.length;
  let m = board.length;
  let n = board[0].length;
  let res = false;
  let hasVis = [];
  let area = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  function dfs(i, j, index) {
    if (index === len) {
      res = true;
      return;
    }
    hasVis.push("" + i + j);
    for (let val of area) {
      let x = val[0] + i;
      let y = val[1] + j;
      if (
        x >= 0 &&
        y >= 0 &&
        x < m &&
        y < n &&
        !hasVis.includes("" + x + y) &&
        board[x][y] === word[index]
      ) {
        dfs(x, y, index + 1);
      }
    }
    hasVis.pop();
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === word[0]) {
        //这里res为true就可以退出了
        dfs(i, j, 1);
      }
    }
  }
  return res;
};
```

对应 hasVis 可以使用 let a = new Array(board.length).fill(null).map(() => []);进行代替

如果使用了，i，j 设置 1，退出时再设置为 0

### 分割回文串

它的递归有点像子序列，但是 for 循环循环什么呢？其实是递归接受的参数及其到字符串长度的这段，如果参数与字符串长度相同就可以退出了，已经有结果了

```js
var partition = function (s) {
  let res = [];
  let path = [];
  function isR(i, j) {
    while (i < j) {
      if (s[i] !== s[j]) {
        return false;
      }
      i++;
      j--;
    }
    return true;
  }
  function dfs(j) {
    if (j === s.length) {
      res.push(path);
    }
    for (let i = j; i < s.length; i++) {
      if (isR(j, i)) {
        path.push(s.slice(j, i + 1));
        dfs(i + 1);
        path.pop();
      }
    }
  }
  dfs(0);
  return res;
};
```

### 组合总和

从一个数组可以取出 n 个和是 target，数组元素可以重复使用,都是正数

首先对数组进行排序

```js
var combinationSum = function (candidates, target) {
  candidates.sort((a, b) => a - b);
  let res = [];
  let path = [];
  let sum = 0;
  function dfs() {
    if (sum === target) {
      res.push([...path]);
    }
    if (sum > target) {
      return;
    }
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i] >= (path.at(-1) || 0)) {
        //因为都是正数可以直接这么写
        sum += candidates[i];
        path.push(candidates[i]);
        dfs();
        sum -= candidates[i];
        path.pop();
      }
    }
  }
  dfs();
  return res;
};
```

## 动态规划

dp[i]到底代表什么

- 前 i 个(下标)的结果，或是以第 i 个结束的结果
- 设置初始值
- 推导状态转移方程

需要注意如果有 n 个数据,要加上 0 的情况所以需要拿到 dp[n],给的参数注意下标,不要越界取错了值，例如这道题，另外也需要两层 for 循环

### 完全平方数

```js
var numSquares = function (n) {
  let dp = [];
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    dp[i] = Infinity;
    for (let j = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }
  return dp[n];
};
```

- 0/1 背包，物品只能用一次
- 完全背包，物品可以用多次

### 最长递增子序列
```js
var lengthOfLIS = function(nums) {
    let max = 1
    let dp = new Array(nums.length).fill(1)
    for(let i =1;i<nums.length;i++){
      for(let j = i-1;j>=0;j--){
        if(nums[i]>nums[j]){
          dp[i] = Math.max(dp[i],dp[j]+1)
        }
      }
      max = Math.max(max,dp[i])
    }
    return max
};
```
### 0/1 背包

先初始化数组,长度 target+1,添加默认值,先遍历物品,后遍历背包

- 都需要两层 for 循环,一层循环物品,一层循环背包(从 0 开始)
- 二维:dp[i][j]代表从从第 0~i 个物品中选满足重量 j 的最大价值
- dp[i][j]=Math.max(dp[i-1][j],d[[i-1][j-weight[i]]+value[i]])
- 一维:dp[j]代表从容量为 j 的最大价值,为什么能用一维,可以看上当前层只依赖上一层,dp[i]=Math.max(dp[i],dp[i-weight[i]]+value[i])
- 循环背包时逆序,因为只跟上方和左上方的数据有关,这个时候不能提前更新它

因为在倒序遍历时，更新 dp[j] 只会基于 dp[j-nums[i]]（在前一次循环中已经计算过了），而不会影响 dp[j] 的计算
```js
let dp = new Array(target + 1).fill(false);
dp[0] = true;
for (let i = 0; i < nums.length; i++) {
  for (let j = target; j >= nums[i]; j--) {
    dp[j] = dp[j] || dp[j - nums[i]];
  }
}
return dp[target];
```

### 完全背包

- 初始化 bp 数组，长度是背包 value+1,设置初始值,
- let dp = new Array(amount + 1).fill(Infinity) dp[0] = 0
- 两层 for 循环，外层循环背包，i 从 1 开始，取值要注意减一，内层循环物品，满足条件，进行判断 dp[i]=dp[i]||dp[i-cur.length]
- 注意 i，j 不要用混了，length 不要拼写错误

```js
let dp = new Array(s.length + 1).fill(false);
dp[0] = true;
for (let i = 1; i <= s.length; i++) {
  for (let j = 0; j < wordDict.length; j++) {
    let cur = wordDict[j];
    if (i - cur.length >= 0 && s.slice(i - cur.length, i) === cur) {
      dp[i] = dp[i] || dp[i - cur.length];
    }
  }
}
return dp[s.length];
```
### 升级最大子数组
```js
var maxProduct = function(nums) {
    
};
```
### 分割等和子集
```js
var canPartition = function(nums) {
    let sum = nums.reduce((cur,sum)=>cur+sum,0)
    if(sum%2 === 1){
      reutnr false
    }
    let target = sum / 2
    let dp = new Array(target + 1)
    dp[0] = true
    for(let i = 0;i<nums.length;i++){
      for(let j = target;j>=nums[i];j--){
        dp[j] = dp[j] || dp[j-nums[i]]
      }
    }
    return dp[target]
};
```
## 多维动态规划

初始化时多一行多一列，方便处理空的状态(对于下面两题不需要加，因为没有0这种情况)

记得比较 l1[i],l2[i]的值，下标不要越界,循环时 i,j 不要写错了
## 不同路径
```js
var uniquePaths = function(m, n) {
  let dp = new Array(m).fill().map(()=>[])
  for(let i = 0;i<m;i++){
    for(let j = 0;j<n;j++){
      if(i===0||j===0){
        dp[i][j] = 1
      }else{
        dp[i][j] = dp[i-1][j]+dp[i][j-1]
      }
    }
  }
  return dp[m-1][n-1]
};
```
### 最小路径和
dp[0][0] = grid[0][0]
```js
var minPathSum = function(grid) {
    let m = grid.length
    let n = grid[0].length
    let dp = new Array(m).fill().map(()=>[])
    for(let i = 0;i<m;i++){
      for(let j = 0;j<n;j++){
        if(i===0&&j===0){
          dp[i][j] = grid[i][j]
        }
        else if(i===0){
          dp[i][j] = dp[i][j-1] + grid[i][j]
        }
        else if(j===0){
          dp[i][j] = dp[i-1][j] + grid[i][j]
        }
        else{
          dp[i][j] = Math.min(dp[i-1][j],dp[i][j-1]) + grid[i][j]
        }
      }
    }
    return dp[m-1][n-1]
};
```
### 最长回文子串

```js
//中心扩散
var longestPalindrome = function (s) {
  let max = 0;
  let res = "";
  for (let i = 0; i < s.length; i++) {
    let { c: c1, str: str1 } = isp(i, i);
    let { c: c2, str: str2 } = isp(i, i + 1);
    if (c1 > c2 && c1 > max) {
      res = str1;
      max = c1;
    } else if (c2 > max) {
      res = str2;
      max = c2;
    }
  }
  return res;
  function isp(i, j) {
    let c = 0;
    while (i >= 0 && j < s.length) {
      if (s[i] !== s[j]) {
        return { c, str: s.slice(i + 1, j) };
      }
      if (i === j) {
        c++;
      } else {
        c += 2;
      }
      i--;
      j++;
    }
    return { c, str: s.slice(i + 1, j) };
  }
};
```

### 最长公共子序列

```js
var longestCommonSubsequence = function (text1, text2) {
  let l1 = text1.length;
  let l2 = text2.length;
  let dp = new Array(l1 + 1).fill().map(() => []);
  for (let i = 0; i <= l1; i++) {
    for (let j = 0; j <= l2; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else {
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1] + (text1[i - 1] === text2[j - 1] ? 1 : 0)
        );
      }
    }
  }
  return dp[l1][l2];
};
```

### 编辑距离

dp[i][j] 代表 word1 中前 i 个字符，变换到 word2 中前 j 个字符，最短需要操作的次数

```js
var minDistance = function (word1, word2) {
  let l1 = word1.length;
  let l2 = word2.length;
  let dp = new Array(l1 + 1).fill().map(() => []);
  for (let i = 0; i <= l1; i++) {
    for (let j = 0; j <= l2; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (word1[i - 1] === word2[j - 1] ? 0 : 1)
        );
      }
    }
  }
  return dp[l1][l2];
};
```

## 只出现一次的数

异或（^）+ reduce

```js
return nums.reduce((acc, cur) => acc ^ cur, 0);
```

## 多数元素

记录一个众数，及其次数

```js
var majorityElement = function (nums) {
  let n = nums[0];
  let c = 1;
  for (let i = 1; i < nums.length; i++) {
    if (!n) {
      n = nums[i];
      c = 1;
      continue;
    }
    if (nums[i] === n) {
      c++;
    } else {
      c--;
      if (c === 0) {
        n = "";
      }
    }
  }
  return n;
};
```

## 荷兰旗

对于 2 才需要回退原来的位置,1 的话之前已经判断过

判断 0 后更新 l
判断 2 后更新 r, i

```js
var sortColors = function (nums) {
  let l = 0;
  let r = nums.length - 1;
  for (let i = 0; i <= r; i++) {
    const val = nums[i];
    if (val === 0) {
      [nums[i], nums[l]] = [nums[l], nums[i]];
      l++;
    } else if (val === 2) {
      [nums[i], nums[r]] = [nums[r], nums[i]];
      i--;
      r--;
    }
  }
};
// O(n)
// O(1)
```

## 寻找重复数

类比环，然后找到那个成环的节点

```js
var findDuplicate = function (nums) {
  let i = 0;
  let j = 0;
  while (true) {
    i = nums[i];
    j = nums[nums[j]];
    if (i === j) {
      break;
    }
  }
  i = 0;
  while (true) {
    i = nums[i];
    j = nums[j];
    if (i === j) {
      return i;
    }
  }
};

// O(n)  = O(n) + O(n)
// O(1)
```
