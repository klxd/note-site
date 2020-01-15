---
title: Java Concurrent学习笔记
date: "2018-01-31T22:22:22.169Z"
path:  "/java-concurrent"
tags:
   - concurrent
---

## CAS

CAS(compare and swap)非阻塞的无锁算法之一.
语义:我认为 V 的值是 A,如果是,那么将 V 的值更新为 B,否则不修改并告诉 V 的实际值是多少

### CAS的开销
CAS是**CPU指令级**的操作，只有**一步原子操作**
* 最好情况下的 CAS 操作消耗大概 40 纳秒，超过 60 个时钟周期。
  这里的“最好情况”是指对某一个变量执行 CAS 操作的 CPU 正好是最后一个操作该变量的CPU，所以对应的缓存线已经在 CPU 的高速缓存中了.
* 类似地，最好情况下的锁操作（一个“round trip 对”包括获取锁和随后的释放锁）消耗超过 60 纳秒，超过 100 个时钟周期。
  这里的“最好情况”意味着用于表示锁的数据结构已经在获取和释放锁的 CPU 所属的高速缓存中了。
  锁操作比 CAS 操作更加耗时，是因深入理解并行编程为锁操作的数据结构中需要**两个原子操作**。
  缓存未命中消耗大概 140 纳秒，超过 200 个时钟周期。

### CAS 缺点
1. ABA问题
如果在获取初始预期值和当前内存值这段时间间隔内，变量值由 A 变为 B 再变为 A，
那么对于 CAS 来说是不可感知的，但实际上变量已经发生了变化;
解决办法是在每次获取时加版本号，并且每次更新对版本号 +1，这样当发生 ABA
问题时通过版本号可以得知变量被改动过. JDK 1.5 以后的 AtomicStampedReference 
类就提供了此种能力，其中的 compareAndSet 方法就是 首先检查当前引用是否等于预期引用，
并且当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用和该标志的值设置为给定的更新值

2. 循环开销大
往往为了保证数据正确性该计算会以死循环的方式发起CAS，如果多次 CAS 判定失败，
则会产生大量的时间消耗和性能浪费

3. 只能保证一个共享变量的原子操作
CAS 只对单个共享变量有效，当操作涉及跨多个共享变量时 CAS 无效；
从 JDK 1.5开始提供了 AtomicReference 类来保证引用对象之间的原子性，
你可以把多个变量放在一个对象里来进行 CAS 操作

## Concurrent包的实现

concurrent 包的源代码实现，会发现一个通用化的实现模式：

1. 首先，声明共享变量为 volatile；
2. 然后，使用 CAS 的原子条件更新来实现线程之间的同步；
3. 同时，配合以 volatile 的读/写和 CAS 所具有的 volatile 读和写的内存语义来实现线程之间的通信。

AQS，非阻塞数据结构和原子变量类,这些 concurrent 包中的基础类都是使用这种模式来实现的，
而 concurrent 包中的高层类又是依赖于这些基础类来实现的。从整体来看，concurrent 包的实现示意图如下：

1. 底层: volatile变量的读/写 CAS
2. 中层: AQS 原子变量类 非阻塞数据结构
3. 高层: LOCK 同步器 阻塞队列 执行器 并发容器

## CountDownLatch Lock底层的实现是什么
基于AQS实现的同步器包括:ReentrantLock、Semaphore、ReentrantReadWriteLock、
CountDownLatch和FutureTask


## 参考
[Java CAS的理解](https://mritd.me/2017/02/06/java-cas/)
[非阻塞同步算法与CAS(Compare and Swap)无锁算法](https://www.cnblogs.com/Mainz/p/3546347.html)