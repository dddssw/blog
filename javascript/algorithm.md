---
outline: deep
---

反之时间快就要用空间来换，这是互补的。解不出试着创建辅助的变量

## 递归

如果依赖子问题的结果，return dfs(node.left)||dfs(node.right)，当然这只是一个示例，来利用子问题的结果(如果节点为空的情况,如果是依赖子问题的答案,要注意返回什么)

如果不依赖子问题的结果，例如查找某个子节点符合 XX 要求，需要根据子问题 return 的结果做判断，更新全局变量，所以一般需要在一个函数里执行一个 dfs 函数

考虑：终止条件，接受参数，return 的值

当然终止条件并不是 node 为空即可，具体场景有更复杂的判断

参数的话可以考虑不仅仅一个 node，或者两个 node，或者一个 node,一个其他的什么数据

::: tip 
如果输入的问题本来就是一个大问题，只需要一个 dfs

如果是需要接受一些别的参数，而不是仅仅是大问题，需要辅助函数 dfs
:::
```js
//依赖子问题的结果
function dfs(node){
if(!node){
    return false
}
let left = dfs(node.left)
let right = dfs(node.right)

return left || right;
    }

```
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
### 二叉树的直径
空节点返回-1,因为后面要加一,代表下面的节点数
```js
var diameterOfBinaryTree = function(root) {
    let max = 0
    function dfs(node){
        if(!node){
            return -1
        }
        let left = dfs(node.left)
        let right = dfs(node.right)
        max=Math.max(max,left+right+2)
        return Math.max(left,right)+1
    }
    dfs(root)
    return max
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

dfs 也接受两个参数，当然最开始是都是 root,需要比较node1.left,node2.right  node1.right,node2.left

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

### 路径总和3

这个思路都是一样的，记录总数以及个数在 map 里，这个 map 初始数组 new Map([[0,1]])。再声明一个总和 sum


它不需要依赖子问题的答案，因为已经记录在 map 里，然后类似于回溯吧，递归完还原 map 和 sum
```js{9,10,11,14,15}
var pathSum = function (root, targetSum) {
  let m = new Map([[0, 1]]);
  let sum = 0;
  let count = 0
  function dfs(node) {
    if (!node) {
      return;
    }
    sum += node.val;
    count+=(m.get(sum-targetSum)||0)//count在sum之后处理,不是在下面之后处理
    m.set(sum, (m.get(sum) || 0) + 1);
    dfs(node.left);
    dfs(node.right);
    m.set(sum, m.get(sum) - 1);
    sum -= node.val;
  }
  dfs(root)
  return count
};
```
### 从前序，中序构造二叉树

从前序可以知道根节点，但是怎么在中序中找到这个节点，除了二分查找之外，也可以使用一个 map 保存数据及其下标

## 递归转迭代（抽象）

需要一个栈
### 二叉树的最大深度
```js
var maxDepth = function(root) {
    let max = 0
    function dfs(node,level){
        if(!node){
            return
        }
        max=Math.max(max,level)
        dfs(node.left,level+1)
        dfs(node.right,level+1)
    }
    dfs(root,1)
    return max
};
//转迭代
var maxDepth = function (root) {
    if (!root) {
        return 0
    }
    let max = 0
    let stack = [{ node: root, level: 1 }]
    while (stack.length !== 0) {
        const { node, level } = stack.pop()
        if (!node) {
            continue
        }
        max = Math.max(max, level)
        stack.push({ node: node.left, level: level + 1 })
        stack.push({ node: node.right, level: level + 1 })
    }
    return max
};
```
### 翻转二叉树
```js
var invertTree = function (root) {
    if (!root) {
        return root
    }
    function dfs(node) {
        if (!node) {
            return null
        }
        let left = dfs(node.left)
        let right = dfs(node.right)
        node.left = right
        node.right = left
        return node
    }
    dfs(root)
    return root
};
//迭代
var invertTree = function (root) {
    if (!root) return root;
    let stack = [root]
    while (stack.length !== 0) {
        const node = stack.pop()
        let temp = node.left
        node.left = node.right
        node.right = temp
        if (node.left) { stack.push(node.left) }
        if (node.right) { stack.push(node.right) }
    }
    return root
};
```

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
对于背包问题，需要注意如果有 n 个数据,要加上 0 的情况所以需要拿到 dp[n],给的参数注意下标,不要越界取错了值，例如这道题，另外也需要两层 for 循环。

并且i和j的位置不要写的相反的地方去了

### 完全平方数

```js{5}
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

## 滑动窗口
### 无重复字符的最长子串
给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。s 可以为空

需要一个map记住之前访问元素的下标，按条件更新左边的指针

获取map里的下标，如果大于或等于左边的指针则更新，返回是这样的要加1(i- j + 1)
```js
var lengthOfLongestSubstring = function (s) {
    let j = 0;
    let max = 0;
    let m = new Map();
    for (let i = 0; i < s.length; i++) {
        if (m.has(s[i]) && m.get(s[i]) >= j) {
            j = m.get(s[i]) + 1
        }
        m.set(s[i], i)
        max = Math.max(max, i - j + 1);
    }
    return max
};
//o(n)
//o(n)
```
### 找到字符串中所有字母异位词
定长的滑动窗口


```js
var findAnagrams = function (s, p) {
    if (s.length < p.length) {
        return []
    }

    let res = []
    let c = new Array(26).fill(0)
    let r = new Array(26).fill(0)
    for (let i = 0; i < p.length; i++) {
        c[s[i].charCodeAt() - 'a'.charCodeAt()] += 1
        r[p[i].charCodeAt() - 'a'.charCodeAt()] += 1
    }
    if (isSame()) {
        res.push(0)
    }
    for (let i = p.length; i < s.length; i++) {
        c[s[i].charCodeAt() - 'a'.charCodeAt()] += 1
        c[s[i - p.length].charCodeAt() - 'a'.charCodeAt()] -= 1
        if (isSame()) {
            res.push(i - p.length + 1)
        }
    }
    return res
    function isSame() {
        for (let i = 0; i < c.length; i++) {
            if (c[i] !== r[i]) {
                return false
            }
        }
        return true
    }
};
//n(s.length+p.length)
//n(1)不考虑返回值
```

### 和为 K 的子数组
给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。子数组是数组中元素的连续非空序列。

一次循环。需要一个map,和sum记录总和
```js
var subarraySum = function (nums, k) {
  let sum = 0
  let m =new Map([[0,1]])
  let c= 0
  for(let val of nums){
    sum+=val
    if(m.get(sum-k)){
        c+=m.get(sum-k)
    }
    if(m.get(sum)){
        m.set(sum,m.get(sum)+1)
    }else{
        m.set(sum, 1);
    }
  }
  return c
};
```
## 普通数组
### 最大子数组和
使用动态规划,以`nums[i]`结尾的dp

nums至少有一个元素
```js
var maxSubArray = function (nums) {
    let dp = [nums[0]]
    let max = nums[0]
    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
        max = Math.max(max, dp[i])
    }
    return max
};
```

### 合并区间
先排序
```js
var merge = function(intervals) {
    intervals.sort((a,b)=>a[0]-b[0])
    let res = [intervals[0]]
    for(let i=1;i<intervals.length;i++){
        let cur = res[res.length-1]
        if(intervals[i][0]>cur[1]){
            res.push(intervals[i])
            continue
        }
        else{
            cur[1]=Math.max(cur[1],intervals[i][1])
        }
    }
    return res
};
// O(n log n) + O(n) = O(n log n)
// O(n)
```
### 轮转数组
要先取余
```js
var rotate = function (nums, k) {
    let a = k % nums.length
    function reverse(i, j) {
        while (i < j) {
            [nums[i], nums[j]] = [nums[j], nums[i]]
            i++
            j--
        }

    }
    reverse(0, nums.length - 1)
    reverse(0, a - 1)
    reverse(a, nums.length - 1)
};
```
### 除自身以外数组的乘积
声明两个数组,分别代表左,右的和.
```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
    let left = [1]
    let right = []
    right[nums.length - 1] = 1
    for (let i = 1; i < nums.length; i++) {
        left[i] = left[i - 1] * nums[i - 1]
    }
    for (let i = nums.length - 2; i >= 0; i--) {
        right[i] = right[i + 1] * nums[i + 1]
    }
    let res = []
    for (let i = 0; i < nums.length; i++) {
        res[i] = left[i] * right[i]
    }
    return res
};
```
## 矩阵
### 矩阵置零
先遍历一遍,收集需要置零的行列

再遍历一遍置零
```js
var setZeroes = function (matrix) {
    let row = new Set()
    let col = new Set()
    let m = matrix.length
    let n = matrix[0].length
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                row.add(i)
                col.add(j)
            }
        }
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (row.has(i) || col.has(j)) {
                matrix[i][j] = 0
            }
        }
    }
};
//O(m * n)
//O(m + n)
```

## 栈
### 有效的括号
需要一个栈,两个数组分别存放`({[`,`]})`.循环数组,不断的刷新栈

栈里只会存放左方向的符号
```js
var isValid = function (s) {
  let stack = [];
  let left = ["[", "{", "("];
  let right = ["]", "}", ")"];
  for (let val of s) {
    if (right.includes(val)) {
      if (stack.length === 0) {
        return false;
      }
      const data = stack.pop();
      let a = right.findIndex((item) => item === val);
      let b = left.findIndex((item) => item === data);
      if(a!==b){
        return false
      }
    }else{
      stack.push(val)
    }
  }
  if(stack.length!==0){
    return false
  }else{
  return true
  }
};
```
### 字符串解码
需要一个栈,还有curStr,curNum. 栈push的时候把他们当成数组都推进去

循环字符串,判断4种情况进行出入栈
```js
var decodeString = function (s) {
  let stack = []
  let curStr = ''
  let curNum = 0
  for(let a of s){
    if('0'<=a&&a<='9'){
      curNum=curNum*10+(+a)
    }else if(a==='['){
      stack.push([curStr,curNum])
      curStr = "";
      curNum = 0;
    }else if(a ===']'){
      const [preStr,preNum] = stack.pop()
      curStr =preStr + curStr.repeat(preNum)
    }else{
      curStr += a;
    }
  }
  return curStr;
};
```
### 每日温度
需要一个栈,比较栈顶元素与遍历到的这个元素做比较,如果小于就弹出

并且要循环比较,直到栈顶元素大于这个当前遍历的元素,然后cur入栈

只需要保存下标既可,温度可以根据下标来寻找
```js
var dailyTemperatures = function(temperatures) {
    let res = new Array(temperatures.length).fill(0)
    let stack = []
    for(let i = 0;i<temperatures.length;i++){
      let cur = temperatures[i]
      while(stack.length&&temperatures[stack[stack.length-1]]<cur){
        const index = stack.pop()
        res[index] = i-index
      }
      stack.push(i)
    }
    return res
};
```
### 只出现一次的数
```js
var findDuplicate = function (nums) {
    let i = 0
    let j = 0
    while(true){
        i=nums[i]
        j=nums[nums[j]]
        if(i===j){
            break
        }
    }
    i = 0
    while(true){
        i = nums[i]
        j = nums[j]
        if(i===j){
            return i
        }
    }
};
// o(n)
// o(1)
```

## 二分查找
### [搜索插入位置](https://leetcode.cn/problems/search-insert-position/description/?envType=study-plan-v2&envId=top-100-liked)
```js
var searchInsert = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    if (target < nums[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return left;
};
```
### [搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/description/)
每次二分后，子数组 [left, mid] 或 [mid, right] ​​至少有一个是有序的
```js
var search = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {//子数组长度为 1
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    if (nums[left] <= nums[mid]) {//不加=会以为右边是有序的
      if (target >= nums[left] && target <= nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (target >= nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
};
```
## 快速排序
