---
title: leetcode栈题
date: "2019-12-21T22:40:32.169Z"
path: "/leetcode-stack"
tags:
    - algorithm
---

## 单调栈
定义: 栈内元素单调递增或者单调递减的栈，单调栈只能在栈顶操作。

单调栈的性质：
 
1.单调栈里的元素具有单调性

2.元素加入栈前，会在栈顶端把破坏栈单调性的元素都删除

3.使用单调栈可以找到元素向左遍历第一个比他小的元素，也可以找到元素向左遍历第一个比他大的元素。

## 84. Largest Rectangle in Histogram
题意: 给出一个高度数组,计算出其直方图上最大的矩形面积
解法: 根据题意,矩形面积的高度是区间内高度的最小值,而不是首尾高度的最小值.
* 考虑每一个位置i,需要找到左边比它小的第一个元素,右边比它小的第一个元素,
* 维护一个单调栈,从左往右遍历数组,对于高度`height[i]`,从栈中弹出比它大的所有元素`curIdx`,
   1. 此时i即位置curIdx右边第一个比它小的元素位置,而栈中的下一个元素则是左边比它小的第一个元素的位置.
   2. 若弹出过程中栈为空,则表示curIdx左边没有比它小的元素,此时矩形宽度为i;
* 注意最后需要将栈清空,此时栈中的元素在原数组中右边没有比它小的元素,可以在最后mock加入一个0来处理这种情况.
```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int ans = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = i == heights.length ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peekLast()] > h) {
                int curHeight = heights[stack.pollLast()];
                int curWidth = stack.isEmpty() ? i : (i - stack.peekLast() - 1);
                ans = Math.max(ans, curWidth * curHeight);
            }
            stack.offerLast(i);
        }
        return ans;
    }
}
```



[单调栈的介绍以及一些基本性质](https://blog.csdn.net/liujian20150808/article/details/50752861)