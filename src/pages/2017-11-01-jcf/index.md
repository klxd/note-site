---
title: Java Collection Framework
date: "2017-09-12T22:22:22.169Z"
path:  "/java-collection-framework"
tags:
   - java
   - java collection framework
---

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


## Q
- 怎么打印数组？ 怎样打印数组中的重复元素
- Array 和 ArrayList有什么区别？
- 什么时候应该使用Array而不是ArrayList
- 数组和链表数据结构描述，各自的时间复杂度
- 数组有没有length()这个方法? String有没有length()这个方法
- 队列和栈是什么，列出它们的区别
- BlockingQueue是什么
- 简述ConcurrentLinkedQueue和LinkedBlockingQueue的用处和不同之处
