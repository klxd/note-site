---
title: Java Thread Local
date: "2017-11-20T22:22:22.169Z"
path:  "/java-thread-local"
tags:
   - java
---

# Java Thread Local

## 线程封闭
当访问共享的可变数据时,通常需要使用同步.一种避免使用同步的方式就是不共享数据,如果仅在单线程内访问数据,
就不需要同步,这种数据被称为**线程封闭**(Thread Confinement)

## ThreadLocal类
维持线程封闭性的一种规范方法是使用ThreadLocal,这个类能使线程中的某个值与保存值的对象关联起来.
