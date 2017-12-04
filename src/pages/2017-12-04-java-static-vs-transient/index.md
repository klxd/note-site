---
title: Java中的序列化时的static字段的处理
date: "2017-11-29T22:22:22.169Z"
path:  "/java-static-vs-transient"
tags:
   - java
   - serialization
---

## 起因
今天工作时遇到一个Java序列化对象中带有static字段的问题,
一时无法确定Java默认的序列化机制会怎么处理静态域,
Google的时候发现[以下文章](http://javabeginnerstutorial.com/core-java-tutorial/transient-vs-static-variable-java/)
此文将static和transient两个关键字做对比,初看时觉得不错,
但是仔细看时发现文章得出的结论和我的印象中的Java序列化有大出入,
于是自己动手写代码验证一下.


## static域会不会被序列化
改文章中的第二部分通过一段代码得出以下*结论*:
> 1. Static variables value can be stored 
> while serializing if the same is provided while initialization.
> 2.If variable is defined as Static and Transient both, 
>　than static modifier will govern the behavior of variable and not Transient.

该文作者认为: 
1. 如果序列化时静态域的值等于初始化时候的值，那么静态域就会被序列化
2. 如果一个域同时拥有static和transient关键字,那么这个域也会被序列化
其实以上这个两个结论都是不对的

[实例代码](TestSerialization.java)
代码运行方法:
1. 调用serialization方法,生成出employee.dat文件
2. 修改`staticField`和`staticTransientField`的初始值
3. 调用deserialization方法

可以看出所有static字段其实并没有被序列化,都会等于`代码`中的值,
其实*类变量*(静态域)的赋值是在类的初始化过程中发生的,
序列化的是目标是*对象*而不是类,所以静态变量不会被序列化.

## 如何实现static域的序列化
Java默认的serialization机制不会序列化static的域,但是Java允许程序员自定义
序列化的对象,以下两种方法都可以实现序列化static域(或者transient域)
1. 重写writeObject()方法和readObject()方法[代码实例](TestCustomSerialization.java)
2. 实现Externalizable接口
