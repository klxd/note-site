---
title: Java Collection Framework
date: "2017-09-12T22:22:22.169Z"
path:  "/java-collection-framework"
tags:
   - java
   - collection framework
---

# Java Collection Framework

## interface Queue
```java
public interface Queue<E> extends Collection<E> {
    /** 向队尾插入元素,失败则抛出异常 */
    boolean add(E e);

    /** 向队尾插入元素,失败返回false */
    boolean offer(E e);

    /** 获取并删除队首元素,失败则抛出异常 */
    E remove();

    /** 获取并删除队首元素,失败则返回null */
    E poll();

    /** 获取但不删除队首元素,失败则抛出异常 */
    E element();

    /** 获取但不删除队首元素,失败则返回null */
    E peek();
}
```

## interface 