---
title: leetcode math
date: "2020-01-02T22:40:32.169Z"
path: "/leetcode-math"
tags:
    - algorithm
---


## 172. Factorial Trailing Zeroes
题意: 求阶乘末尾零的个数

分析: 末尾零的个数=分解因子10的个数=分解因子5的个数(2的数量大于5),
考虑n=51, 先找出第一层有5为因子的数`5, 10, 15, ...50`, 数量为`n/5`,
此时由于有25这些有多个因子5的数, 可模拟将上面的数全部除以5, 变成`1, 2, 3 .. 10`,
变成求trailingZeroes(n / 5), 可用递归非递归两种解法.

```java
class Solution {
    public int trailingZeroes(int n) {
        int ans = 0;
        while (n > 0) {
            ans += n / 5;
            n /= 5;
        }
        return ans;
    }
}
```