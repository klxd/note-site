---
title: leetcode list
date: "2019-12-28T22:40:32.169Z"
path: "/leetcode-list"
tags:
    - algorithm
---


## 142. Linked List Cycle II
题意：（剑指offer #23） 链表中环的入口节点
解法：使用快慢指针确认是否有环，再让其重新循环一次得到环的长度，
重置慢指针为链表头，快指针为环的长度，两个指针以同样的速度前进，当他们相遇的时候，
快指针已经绕环走了一圈，此时相遇点就是环的入口