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

## 阻塞队列定义
阻塞队列(BlockingQueue)是一个支持两个附加操作的队列。这两个附加的操作支持阻塞的插入和移除方法。
1)支持阻塞的插入方法:意思是当队列满时,队列会阻塞插入元素的线程,直到队列不满。
2)支持阻塞的移除方法:意思是在队列为空时,获取元素的线程会等待队列变为非空。

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

## 插入和移除操作的4种处理方式

| 方法\处理方式 | 抛出异常 | 返回特殊值 | 一直阻塞  | 超时退出
| :-----     | :------ | :------  | :------ | :------  |
|  插入方法    | add(e)  | offer(e)  |  put(e)    | put(e, time, unit) |
|  移除方法    | remove()| poll()    |  take()    | poll(time, unit)   |
|  检查方法    | element | peek      |   --       |        --          |

## ArrayBlockingQueue
一个由数组实现的有界阻塞队列, 构造时必须指定队列长度, 此队列按照先进先出（FIFO）的原则对元素进行排序。默认情况下不保证访问者公平的访问队列, 
可通过构造函数决定是否采用公平的策略.

内部实现使用的是可重入锁(ReentrantLock)和其中的Condition类.

## LinkedBlockingQueue
一个由链表实现的有界阻塞队列, 默认的队列的最大长度为`Integer.MAX_VALUE`.

## PriorityBlockingQueue
一个支持优先级的无界队列, 默认情况下采用自然排序**升序**排列, 也可以传入比较器来指定排序规则.

## DelayQueue
一个支持延时获取元素的无界阻塞队列。队列使用PriorityQueue来实现。
队列中的元素必须实现Delayed接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。我们可以将DelayQueue运用在以下应用场景：

1. 缓存系统的设计：可以用DelayQueue保存缓存元素的有效期，使用一个线程循环查询DelayQueue，一旦能从DelayQueue中获取元素时，表示缓存有效期到了。
2. 定时任务调度。使用DelayQueue保存当天将会执行的任务和执行时间，一旦从DelayQueue中获取到任务就开始执行，从比如TimerQueue就是使用DelayQueue实现的。

## SynchronousQueue
* 一个不存储元素的阻塞队列。每一个put操作必须等待一个take操作，否则不能继续添加元素。
* 支持公平访问队列。默认情况下线程采用非公平性策略访问队列。在构造函数中传入(boolean fair)控制
* SynchronousQueue可以看成是一个传球手，负责把生产者线程处理的数据直接传递给消费者线程。
  队列本身并不存储任何元素，非常适合于传递性场景,比如在一个线程中使用的数据，传递给另外一个线程使用，
* SynchronousQueue的吞吐量高于LinkedBlockingQueue 和 ArrayBlockingQueue.

## LinkedTransferQueue
LinkedTransferQueue是LinkedBlockingQueue、SynchronousQueue（公平模式）、ConcurrentLinkedQueue三者的集合体，
它综合了这三者的方法，并且提供了更加高效的实现方式。

原理: LinkedTransferQueue采用一种预占模式。什么意思呢？有就直接拿走，没有就占着这个位置直到拿到或者超时或者中断。
即消费者线程到队列中取元素时，如果发现队列为空，则会生成一个null节点，然后park住等待生产者。
后面如果生产者线程入队时发现有一个null元素节点，这时生产者就不会入列了，直接将元素填充到该节点上，唤醒该节点的线程，被唤醒的消费者线程取到元素结束等待.
此过程与SynchronousQueue类似.
LinkedTransferQueue多了tryTransfer和transfer方法。
* transfer方法
如果当前有消费者正在等待接收元素(消费者使用take()方法或带时间限制的poll()方法
时),transfer方法可以把生产者传入的元素立刻transfer(传输)给消费者。如果没有消费者在等
待接收元素,transfer方法会将元素存放在队列的tail节点,并等到该元素被消费者消费了才返回.
* tryTransfer方法
tryTransfer方法是用来试探生产者传入的元素是否能直接传给消费者。如果没有消费者等
待接收元素,则返回false。和transfer方法的区别是tryTransfer方法无论消费者是否接收,方法
立即返回,而transfer方法是必须等到消费者消费了才返回。

## LinkedBlockingDeque
LinkedBlockingDeque是一个由链表结构组成的双向阻塞队列。所谓双向队列指的是可以从队列的两端插入和移出元素。
双向队列因为多了一个操作队列的入口,在多线程同时入队时,也就减少了一半的竞争。
相比其他的阻塞队列,LinkedBlockingDeque多了addFirst、addLast、offerFirst、offerLast、peekFirst和peekLast等方法,
以First单词结尾的方法,表示插入、获取(peek)或移除双端队列的第一个元素。
以Last单词结尾的方法,表示插入、获取或移除双端队列的最后一个元素。
另外,插入方法add等同于addLast,移除方法remove等效于removeFirst,而take方法却等同于takeFirst


## Q & A
Q:LinkedTransferQueue与SynchronousQueue（公平模式）有什么异同呢？
  （1）在java8中两者的实现方式基本一致，都是使用的双重队列；
  （2）前者完全实现了后者，但比后者更灵活；
  （3）后者不管放元素还是取元素，如果没有可匹配的元素，所在的线程都会阻塞；
  （4）前者可以自己控制放元素是否需要阻塞线程，比如使用四个添加元素的方法就不会阻塞线程，只入队元素，使用transfer()会阻塞线程；
  （5）取元素两者基本一样，都会阻塞等待有新的元素进入被匹配到；
  
  
[死磕 java集合之ConcurrentLinkedQueue源码分析](https://cloud.tencent.com/developer/article/1458983)