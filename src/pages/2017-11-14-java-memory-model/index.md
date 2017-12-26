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

# placeholder

```java
@ThreadSafe
public class Resource {

    private static class ResourceHolder {
        private static Resource resource = new Resource();
        public static Resource getResource() {
            return resource;
        }
    }

    public static getInstance() {
        return ResourceHolder.getResource();
    }
}
```

[极客学院 内存模型](http://wiki.jikexueyuan.com/project/java-concurrent/java-memory-model.html)
