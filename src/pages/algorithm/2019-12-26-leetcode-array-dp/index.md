---
title: leetcode array dp
date: "2019-12-26T22:40:32.169Z"
path: "/leetcode-array-dp"
tags:
    - algorithm
---


## 123. Best Time to Buy and Sell Stock III
题意: 给出代表股票价格的数组,只能买入和卖出各两次, 求最大获利
思路: 时间O(n), 空间O(1)
第一次最大获利为`money1 = (price[i] - buy1)`,
第二次最大获利为`money2 = (price[i] - buy2) + money1`, 


## 188. Best Time to Buy and Sell Stock IV
题意: 给出代表股票价格的数组, 最多只能买卖k次, 求最大获利


## 689. Maximum Sum of 3 Non-Overlapping Subarrays