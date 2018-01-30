---
title: Java Blocking Queue
date: "2017-11-12T22:22:22.169Z"
path:  "/java-blocking-queue"
tags:
   - java
   - java collection framework
---

## Queue 接口

```java
public interface Queue<E> extends Collection<E> {
    /**
     *  向队列中插入一个元素, 失败则抛出异常
     */
    boolean add(E e);

    /**
     * 向队列中插入一个元素, 失败则返回false
     */
    boolean offer(E e);

    /**
     * 移除队首, 失败(队列为空)则抛出异常
     */
    E remove();

    /**
     * 移除队首, 失败(队列为空)则返回空
     */
    E poll();

    /**
     * 查看队首, 失败(队列为空)则抛出异常
     */
    E element();

    /**
     * 查看队首, 失败(队列为空)则返回空
     */
    E peek();
}
```

## BlockingQueue 接口

```java
public interface BlockingQueue<E> extends Queue<E> {
    
    boolean add(E e);

    boolean offer(E e);

    void put(E e) throws InterruptedException;

    boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException;

    E take() throws InterruptedException;

    E poll(long timeout, TimeUnit unit)
        throws InterruptedException;

    int remainingCapacity();

    boolean remove(Object o);

    public boolean contains(Object o);

    int drainTo(Collection<? super E> c);

    int drainTo(Collection<? super E> c, int maxElements);
}
```


| 方法\处理方式 | 抛出异常 | 返回特殊值 | 一直阻塞  | 超时退出
| :-----      | :------ | :------  | :------ | :------  |
|  插入方法    | add     | offer     |  put     | put(e, time, unit) |
|  移除方法    | remove  | poll      |  take    | poll(e, time, unit) |
|  检查方法    | element | peek      |   --       |        --         |

## ArrayBlockingQueue
一个由数组实现的有界阻塞队列, 构造时必须指定队列长度, 此队列按照先进先出（FIFO）的原则对元素进行排序。默认情况下不保证访问者公平的访问队列, 
可通过构造函数决定是否采用公平的策略.

内部实现使用的是可重入锁(ReentrantLock)Z和其中的Condition类.

## LinkedBlockingQueue
一个由链表实现的有界阻塞队列, 默认的队列的最大长度为`Integer.MAX_VALUE`.

## PriorityBlockingQueue
一个支持优先级的无界队列, 默认情况下采用自然排序, 也可以传入比较器来指定排序规则.

## DelayQueue
一个支持延时获取元素的无界阻塞队列。队列使用PriorityQueue来实现。
队列中的元素必须实现Delayed接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。我们可以将DelayQueue运用在以下应用场景：

1. 缓存系统的设计：可以用DelayQueue保存缓存元素的有效期，使用一个线程循环查询DelayQueue，一旦能从DelayQueue中获取元素时，表示缓存有效期到了。
2. 定时任务调度。使用DelayQueue保存当天将会执行的任务和执行时间，一旦从DelayQueue中获取到任务就开始执行，从比如TimerQueue就是使用DelayQueue实现的。

## SynchronousQueue
一个不存储元素的阻塞队列。每一个put操作必须等待一个take操作，否则不能继续添加元素。
SynchronousQueue可以看成是一个传球手，负责把生产者线程处理的数据直接传递给消费者线程。
队列本身并不存储任何元素，非常适合于传递性场景,比如在一个线程中使用的数据，传递给另外一个线程使用，
SynchronousQueue的吞吐量高于LinkedBlockingQueue 和 ArrayBlockingQueue.