---
title: leetcode sort
date: "2019-12-29T22:40:32.169Z"
path: "/leetcode-sort"
tags:
    - algorithm
---


## 各类排序算法复杂度比较

| 复杂度\排序 | Merge sort | Quick sort | Insertion sort | Selection sort | Tim sort |
| :-----    | :------    | :------    | :------        | :------        | : -----  |
|  最好时间   | NlogN      | NlogN      |  N             | N2             | N       |
|  平均时间   | NlogN      | NlogN      |  N2            | N2             | NlogN    |
|  最坏时间   | NlogN      | N2         |  N2            | N2             | NlogN     |
|  空间复杂度 | N (辅助空间) | logN(递归栈) | 1             | 1              | N(辅助空间)|




## Timsort
* Java中对象排序没有采用快速排序，是因为快速排序是不稳定的.
* JSE7以后对象排序使用的是Timsort实现(之前是Merge sort) 
* Timsort是稳定的算法，当待排序的数组中已经有排序好的数，它的时间复杂度会小于NlogN。
* 其他合并排序一样，Timesrot是稳定的排序算法，最坏时间复杂度是O（NlogN）。
* 在最坏情况下，Timsort算法需要的临时空间是n/2，在最好情况下，它只需要一个很小的临时存储空间

## Q & A
* 已知数据表 A 中每个元素距其最终位置不远 ，为了节省时间，应该采取的算法是 - 直接插入排序

[blog: Timsort原理学习](https://sikasjc.github.io/2018/07/25/timsort/)