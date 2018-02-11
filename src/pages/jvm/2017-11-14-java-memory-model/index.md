---
title: Java Memory Model
date: "2017-11-14T22:22:22.169Z"
path:  "/java-memory-model"
tags:
   - java
   - jvm
---

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
* 获取一个resource的引用时(first check), 没用使用同步, 还是可能导致**构造完成前的提前暴露**,
  线程可能看到一个仅被部分构造的Resource.
* 在Java 5.0以后, 如果把resource声明为volatile类型, 则DCL是线程安全的, 
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
* 不需要额外的同步, 由JVM的类加载机制保证实例创建的唯一性.


[极客学院 内存模型](http://wiki.jikexueyuan.com/project/java-concurrent/java-memory-model.html)
