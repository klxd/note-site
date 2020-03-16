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

## boolean大小
* jvm规范没有规定boolean所占用的内存空间，大部分计算机在分配内存时最小内存单元是字节（8bit）
* 没有Java虚拟机指令专门用于对boolean值的操作。相反，Java编程语言中对boolean值进行操作的表达式被编译为使用Java虚拟机int数据类型的值。
  等于是说JVM里占用字节和int完全一样，int是4个字节，于是boolean也是4字节
* **boolean数组**在Oracle的JVM中，编码为byte数组，每个boolean元素占用8位=1字节

## 数组转List

Integer数组可以利用Arrays.asList转list
```java
Integer[] sourceArray = { 0, 1, 2, 3, 4, 5 };
List<Integer> targetList = Arrays.asList(sourceArray);
```

int数组无法直接利用Arrays.asList
```java
int[] row = new int[10];
List<int[]> list1 = Arrays.asList(row); // 直接使用其实是转成List<int[]>
List<Integer> list2 = Arrays.stream(row).boxed().collect(Collectors.toList());
```