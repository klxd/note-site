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
时间O(n * m), 空间O(m)
思路: 一维dp求该位置往上1的数量,然后利用单调栈求出当前高度数组所能组成的最大矩形面积
```java
class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0) {
            return 0;
        }
        int n = matrix.length, m = matrix[0].length;
        int dp[] = new int[m], ans = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                dp[j] = matrix[i][j] == '0' ? 0 : (dp[j] + 1);
            }
            ans = Math.max(ans, solve(dp));
        }
        return ans;
    }
    
    private int solve(int heights[]) {
        Deque<Integer> stack = new LinkedList<>();
        int ans = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = i == heights.length ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peekLast()] > h) {
                int curH = heights[stack.pollLast()];
                int curW = stack.isEmpty() ? i : (i - stack.peekLast() - 1);
                ans = Math.max(ans, curH * curW);
            }
            stack.offerLast(i);
        }
        return ans;
    }
}
```

## 74. Search a 2D Matrix
给出一个每行依次递增的矩阵,从中搜索元素
O(log(n * m)), 当成有序数组处理,二分搜索
```java
class Solution {
    public boolean searchMatrix(int[][] mat, int target) {
        if (mat.length == 0) {
            return false;
        }
        int n = mat.length, m = mat[0].length;
        int left = 0, right = n * m - 1;
        while (left <= right) {
            int mid = left + ((right - left) >> 1);
            int x = mid / m, y = mid % m;
            if (mat[x][y] > target) {
                right = mid - 1;
            } else if (mat[x][y] < target) {
                left = mid + 1;
            } else {
                return true;
            }
        }
        return false;
    }
}
```


# 行列递增矩阵
[二分+反复实验算法](https://leetcode.com/problems/find-k-th-smallest-pair-distance/discuss/109082/Approach-the-problem-using-the-%22trial-and-error%22-algorithm)

## 240. Search a 2D Matrix II
给出一个行列分别递增的矩阵,从中搜索元素
O(n+m), 从右上开始搜索,每次排除一行或者一列
```java
class Solution {
    public boolean searchMatrix(int[][] mat, int target) {
        if (mat.length == 0) {
            return false;
        }
        int x = 0, y = mat[0].length - 1;
        while (x < mat.length && y >= 0) {
            if (mat[x][y] > target) {
                y--;
            } else if (mat[x][y] < target) {
                x++;
            } else {
                return true;
            }
        }
        return false;
    }
}
```

## 378. Kth Smallest Element in a Sorted Matrix
给出一个行列分别递增的`n*n`矩阵, 找出其中第k小的数字

解法一: 时间O(max(n, k) * log(n)), 空间O(n)
  使用优先队列, 将矩阵转化为多个有序数组, 初始化时将数组首位最小的数字放进队列,
  然后每次取出最小的数组, 将其指针指向下一个数字, 重复k次即可
```java
class Solution {
    public int kthSmallest(int[][] mat, int k) {
        PriorityQueue<int[]> q = new PriorityQueue<>(
            (a, b) -> mat[a[0]][a[1]] - mat[b[0]][b[1]]);
        for (int i = 0; i < mat.length; i++) {
            q.offer(new int[]{i, 0});
        }
        while (--k > 0) {
            int[] min = q.poll();
            if (++min[1] < mat[0].length) {
                q.offer(min);
            }
        }
        return mat[q.peek()[0]][q.peek()[1]];
    }
}
```

解法二: 二分查找, 最小值low为左上角元素, 最大值high为右下角元素, 每次从右上开始遍历,
计算出比mid小的元素的个数cnt, 根据cnt来改变low和high的值
时间复杂度O(n * log(MAX - MIN)), 空间O(1)
```java
class Solution {
    public int kthSmallest(int[][] mat, int k) {
        int n = mat.length, low = mat[0][0], high = mat[n - 1][n - 1];
        while (low < high) {
            int mid = low + ((high - low) >> 1);
            int i = 0, j = n - 1, cnt = 0;
            while (i < n && j >= 0) {
                if (mat[i][j] > mid) {
                    j--;
                } else {
                    i++;
                    cnt += (j + 1);
                }
            }
            // cnt为小于等于mid的元素数量
            // 注意, 当cnt等于k的时候, 并不能直接判定mid就是答案, 因为mid不一定在矩阵中
            if (cnt < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
}
```

解法三: 二分查找的过程中其实寻找了不少不在矩阵中的元素, 利用行列顺序矩阵的性质, 可以改进搜索空间,
从右上角往下搜索, 对于每一个元素, 计算出*小于*和*小于等于*它的所有元素, 根据此值与k比较, 判断后续操作
```java
class Solution {
    public int kthSmallest(int[][] mat, int k) {
        int n = mat.length, row = 0, col = n - 1;
        while (true) {
            int cntLt = 0, cntLe = 0, colLt = n - 1, colLe = n - 1;
            for (int i = 0; i < n; i++) {
                while (colLt >= 0 && mat[i][colLt] >= mat[row][col]) colLt--;
                while (colLe >= 0 && mat[i][colLe] > mat[row][col]) colLe--;
                cntLt += colLt + 1;
                cntLe += colLe + 1;
            }
            if (cntLe < k) {
                // 小于等于的元素数量小于k, 需要找一个更大的元素
                row++;
            } else if (cntLt >= k) {
                // 小于的元素数量大于等于k, 需要找一个更小的元素
                col--;
            } else {
                // 小于此元素的数量小于k, 且小于等于此元素的数量大于等于k, 此元素为答案
                return mat[row][col];
            }
        }
    }
}
```


## 373. Find K Pairs with Smallest Sums
给出两个有序数组(可能包含重复值), 定义`pair[u, v]`, 其中u来自第一个矩阵, v来自第二个矩阵,
输出和(sum)最小的k组pair

解法: 同行列递增矩阵, 将其转化为多个有序链表, 进行归并排序
```java
class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        if (nums1.length == 0 || nums2.length == 0) {
            return Collections.emptyList();
        }
        PriorityQueue<int[]> q = new PriorityQueue<>(
            (a, b) -> nums1[a[0]] + nums2[a[1]] - nums1[b[0]] - nums2[b[1]]);
        for (int i = 0; i < nums1.length; i++) {
            q.offer(new int[]{i, 0});
        }
        List<List<Integer>> ans = new ArrayList<>();
        while (ans.size() < k && !q.isEmpty()) {
            int[] min = q.poll();
            ans.add(Arrays.asList(nums1[min[0]], nums2[min[1]]));
            if (++min[1] < nums2.length) {
                q.offer(min);
            }
        }
        return ans;
    }
}
```
