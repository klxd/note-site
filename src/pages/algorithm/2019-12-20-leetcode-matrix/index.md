---
title: leetcode矩阵题
date: "2019-12-20T22:40:32.169Z"
path: "/leetcode-matrix"
tags:
    - algorithm
---

## 221. Maximal Square
给出01矩阵,求只含1的最大**正方形**的面积
解法一:
使用dp[][]矩阵记录以位置i,j为右下角的最大方形的长度,
若位置`mat[i][j] == 1`, 根据三个方形的重叠面积,则有
`dp[i][j]=Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1`
也可以根据两个方形的重叠面积和左上角位置的值,则有
```java
int min = Math.min(g[i - 1][j], g[i][j - 1]);　
g[i][j] = min == 0 ?　grid[i][j] : (min + (g[i - min][j - min] > 0 ? 1 : 0));
```
```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix.length <= 0) {
            return 0;
        }
        int n = matrix.length, m = matrix[0].length, ans = 0;
        int g[][] = new int[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                g[i][j] = matrix[i][j] == '0' ? 0 : 1;
                if (i > 0 && j > 0 && g[i][j] > 0) {
                    int min = Math.min(g[i - 1][j], g[i][j - 1]);
                    g[i][j] = Math.min(g[i - 1][j - 1], min) + 1;
                }
                ans = Math.max(ans, g[i][j]);
            }
        }
        return ans * ans;
    }
}
```

解法二:
解法一中空间可继续优化至O(n)

## 85. Maximal Rectangle
给出01矩阵,求只含1的最大**矩形**的面积

