---
title: Java基础
date: "2017-09-11T22:22:22.169Z"
path:  "/java-base"
tags:
   - java
---

## 位移运算符
* `<<`: 左移, 自动补0
* `>>`: 右移, 根据符号位自动补1或0 `(-1 >> 1) == -1`
* `>>>`: 无符号右移, 自动补0, `(-1 >>> 1) == Integer.MAX_VALUE`

## Math.round
* +0.5后向下取整
```java
System.out.println(Math.round(2.49)); // 2
System.out.println(Math.round(-2.49)); // -2

System.out.println(Math.round(2.5)); // 3
System.out.println(Math.round(-2.5)); // -2

System.out.println(Math.round(2.6)); // 3
System.out.println(Math.round(-2.6)); // -3
```