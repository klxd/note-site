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



[单调栈的介绍以及一些基本性质](https://blog.csdn.net/liujian20150808/article/details/50752861)