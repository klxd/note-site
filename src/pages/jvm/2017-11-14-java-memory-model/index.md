---
title: Java Memory Model
date: "2017-11-14T22:22:22.169Z"
path:  "/java-memory-model"
tags:
   - java
   - jvm
---

## Java内存模型和硬件内存架构之间的桥接
Java内存模型与硬件内存架构之间存在差异。硬件内存架构没有区分线程栈和堆。对于硬件，所有的线程栈和堆都分布在主内存中。部分线程栈和堆可能有时候会出现在CPU缓存中和CPU内部的寄存器中。如下图所示：
[Bridging The Gap Between The Java Memory Model And The Hardware Memory Architecture](JMM_hardware.jpg)
从抽象的角度来看，JMM定义了线程和主内存之间的抽象关系：
线程之间的共享变量存储在主内存（Main Memory）中
每个线程都有一个私有的本地内存（Local Memory），本地内存是JMM的一个抽象概念，并不真实存在，它涵盖了缓存、写缓冲区、寄存器以及其他的硬件和编译器优化。本地内存中存储了该线程以读/写共享变量的拷贝副本。
从更低的层次来说，主内存就是硬件的内存，而为了获取更好的运行速度，虚拟机及硬件系统可能会让工作内存优先存储于寄存器和高速缓存中。
Java内存模型中的线程的工作内存（working memory）是cpu的寄存器和高速缓存的抽象描述。而JVM的静态内存储模型（JVM内存模型）只是一种对内存的物理划分而已，它只局限在内存，而且只局限在JVM的内存。

## 指令序列的重排序

1）编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序。

2）指令级并行的重排序。现代处理器采用了指令级并行技术（Instruction-LevelParallelism，ILP）来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序。

3）内存系统的重排序。由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是在乱序执行。


# Java Memory Model

从 JDK5 开始，java 使用新的 JSR -133 内存模型（本文除非特别说明，针对的都是 JSR- 133 内存模型）
JSR-133 提出了 happens-before 的概念，通过这个概念来阐述操作之间的内存可见性。如果一个操作执行的结果需要对另一个操作可见，那么这两个操作之间必须存在 happens-before 关系。这里提到的两个操作既可以是在一个线程之内，也可以是在不同线程之间。 与程序员密切相关的 happens-before 规则如下：

* 程序顺序规则：一个线程中的每个操作，happens-before 于该线程中的任意后续操作。
* 监视器锁规则：对一个监视器锁的解锁，happens-before 于随后对这个监视器锁的加锁。
* volatile 变量规则：对一个 volatile 域的写，happens-before 于任意后续对这个 volatile 域的读。
* 传递性：如果 A happens-before B，且 B happens-before C，那么 A happens- before C。




[深入理解 Java 内存模型（一）——基础][1]
[jsr133][2]
[Java 并发编程实战]

[1]: http://www.infoq.com/cn/articles/java-memory-model-1
[2]: https://www.cs.umd.edu/~pugh/java/memoryModel/jsr133.pdf

# Eager Initialization

```java
@ThreadSafe
public class Resource {
    private static Resource resource = new Resource();
    public static getInstance() {
        return resource;
    }
}
```

# Unsafe lazy initialization

```java
@NotThreadSafe
public class Resource {
    private static Resource resource;

    public static Resource getInstance() {
        if (resource == null) {
            resource = new Resource();
        }
        return resource;
    }
}
```

* **可能重复创建** 无法保证线程A对resource的赋值操作是在线程B的读取操作之前
* **构造完成前的提前暴露** Resource的构造函数把新实例中的各个域由默认值修改为初始值,
  由于没有同步操作, 线程B**看到**的线程A中的操作顺序, 可能与线程A执行这些操作的顺序并不相同.
  因此, 即使线程A初始化Resource实例之后再将resource设置为指向它, 线程B仍然可能看到对resource
  的写入操作在对Resource的各个域的写入操作之前发生. 因此,线程B可能看到一个**被部分构造的Resource实例**.
* 除了不可变对象之外,使用被另一个线程初始化的对象通常都是不安全的,
  除非对象的发布操作是在使用该对象的线程开始使用之前执行的.

# Safe lazy initialization

```java
@ThreadSafe
public class Resource {
    private static Resource resource;

    public synchronized static Resource getInstance() {
        if (resource == null) {
            resource = new Resource();
        }
        return resource;
    }
}
```

* 每次调用getInstance都需要加锁, 存在性能问题

# double checked lock

```java
@NotThreadSafe
public class Resource {
    private static Resource resource;

    public static Resource getInstance() {
        if (resource == null) { // first check
            synchronized(Resource.class) {
                if (resource == null) { // second check
                    resource = new Resource();
                }
            }
        }
        return resource;
    }
}
```

* 理解了**独占性**的含义,却没有理解**可见性**的含义
* resource = new Resource(); 可以分为如下三行伪代码
  1. memory = allocate()  // 1. 分配对象的内存空间
  2. ctorInstance(memory) // 2. 初始化对象
  3. instance = memory    // 3. 设置instance指向刚分配的内存地址
  由于指令重排的存在, 2和3可能会被重排序, 此时另外的线程可能看到一个还未初始化的对象
* 获取一个resource的引用时(first check), 没用使用同步, 还是可能导致**构造完成前的提前暴露**,
  线程可能看到一个仅被部分构造的Resource.
* 在Java 5.0以后, 如果把resource声明为volatile类型(禁止2和3之间的重排序), 则DCL是线程安全的, 
  然而已经没有理由再使用DCL, 使用延迟初始化占位类模式能带来同样的优势, 并且更好理解

# placeholder

```java
@ThreadSafe
public class Resource {

    private static class ResourceHolder {
        private static Resource resource = new Resource();
    }

    public static getInstance() {
        return ResourceHolder.resource;
    }
}
```
* 不需要额外的同步, 由JVM的类加载机制保证实例创建的唯一性 (使用了Class对象的初始化锁).


[极客学院 内存模型](http://wiki.jikexueyuan.com/project/java-concurrent/java-memory-model.html)
[tutorials.jenkov.com: Java Memory Model](http://tutorials.jenkov.com/java-concurrency/java-memory-model.html)