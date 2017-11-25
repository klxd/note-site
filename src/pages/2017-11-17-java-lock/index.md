---
title: Java Lock
date: "2017-11-17T22:22:22.169Z"
path:  "/java-lock"
tags:
   - java
---

## synchronized对比Lock

* lock获取锁的过程比较可控,粒度更细,synchronize获得锁的过程由jvm控制
* synchronize会自动释放锁,lock释放锁需要显式调用

## synchronized关键字
* Java为防止资源冲突提供的内置支持

### synchronized方法
```java
public class SynchronizedObject {
    // 必须将共享资源设置为私有(不能被外部直接访问),否则synchronize方法将失去意义
    private Resource resource;
    // 所有的synchronize方法共享同一个锁,锁定的其实是这个对象本身
    synchronized void f() {/*访问resource*/}
    synchronized void g() {/*访问resource*/}
}
```
- 共享资源一般是以对象形式存在的内存的片段
- 要控制对共享资源的访问,一般是把它包装进一个对象,然后把所有要访问这个资源的方法标记为`synchronized`
- 如果某个线程正在调用一个标记为`synchronized`的方法,那么在此线程从该方法返回之前,
  所有要调用这个类中**任何**标记为`synchronized`方法的线程都会被阻塞
- 同一个线程可以多次获得对象的锁(`synchronized`实现的锁是可重入的)
   - 如f方法内部可以继续调用g方法,JVM会负责追踪对象被加锁的次数
   - 只有首先获得了锁的线程才能继续重入这个锁,每次获得锁时,计数会递增
   - 当计数为零的时候,锁才被释放
   
   
## 临界区(同步控制块)
```java
synchronized (syncObject) {
    // 对于一个syncObject,同一时间只有一个线程能进入这段代码
}
```

- 相比与synchronized方法(对整个方法进行同步控制),
  同步控制块可以使多个任务访问对象的时间性能得到显著提高
- 临界区也可以用Lock对象来显式创建

## Lock接口
```java
package java.util.concurrent.locks;
public interface Lock {
    void lock();
    void lockInterruptibly() throws InterruptedException;
    boolean tryLock();
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    void unlock();
    Condition newCondition();
}
```
- 此接口的实现基本都是通过聚合一个队列同步器(AbstractQueuedSynchronizer)来完成线程的访问控制的

### lock和unlock方法
```java
// 获取锁
lock.lock();
try {
    
    ......
} finally {
    // 释放锁
    lock.unlock();  
}
```
- lock方法相当于显式创建临界区
- 不要将锁的获取过程写在try块中,因为如果在获取锁的过程中发生了异常,会导致锁的无故释放
- Lock不会自动释放锁(synchronize在发生异常时自动释放),需要在`try-finally`中显式释放锁

### lockInterruptibly方法
```java
void lockInterruptibly() throws InterruptedException;
```
- 可中断地获取锁,和lock()方法不同之处在于该方法会响应中断,即在锁的获取中可以中断当前线程
- 当通过这个方法去获取锁时，如果线程正在等待获取锁，则这个线程能够响应中断，即中断线程的等待状态。
  例如当两个线程同时通过lock.lockInterruptibly()想获取某个锁时，假若此时线程A获取到了锁，
  而线程B只有在等待，那 么对线程B调用threadB.interrupt()方法能够中断线程B的等待过程。

### tryLock方法
```java
boolean tryLock();
```
- 尝试非阻塞的获取锁,调用该方法之后立刻返回,如果能够获取则返回true,否则返回false

```java
boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
```
- 超时地获取锁,当前线程在一下三种情况下返回
   1. 当前线程在超时时间内获得了锁
   2. 当前线程在超时时间内被中断
   3. 超时时间结束,返回false

## ReentrantLock
```java
public class ReentrantLock implements Lock, java.io.Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // 关键方法,非公平地试着获取锁
        final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            // 当前锁是空闲的
            if (c == 0) {
                if (compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            // 如果是获取了锁的线程再次请求,将同步状态值增加,返回true,实现可重入
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
    }
    static final class NonfairSync extends Sync {...}
    static final class FairSync extends Sync {
        // 关键方法,公平地获取锁
        protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                // 判断同步队列中是否线程比当前线程更早地请求获取锁,
                // 如果有则返回false,即要等待前驱线程获取并释放锁之后才能获取锁
                if (!hasQueuedPredecessors() &&
                    compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
    }
    // -- 默认提供不公平的锁
    public ReentrantLock() {
        sync = new NonfairSync();
    }
    // -- 通过构造函数决定锁是不是公平的
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
}
```
- 可重入的锁,对于已经获取到锁的线程,能够再次调用lock方法获取锁而不被阻塞
- 公平性问题: 若在绝对时间上,先对锁进行获取的请求一定先被满足,那么这个锁是公平的,否则不是
- 不同公平性的区别: 非公平性锁会使得其他锁饥饿,但是减少了线程的切换,保证了更大的吞吐量


## ReadWriteLock接口
```java
public interface ReadWriteLock {
    // 获得读锁
    Lock readLock();
    // 获得写锁
    Lock writeLock();
}
```

- 不是Lock接口的实现
- 不是排他锁(互斥锁),即允许同一时刻有多个读线程在访问
- 当有一个写线程在访问时,所有的读线程和其他写线程均被阻塞
- 通过分离读锁和写锁,使得并发性相比一般的排他锁有很大提升


## ReentrantReadWriteLock类
```java
public class ReentrantReadWriteLock
        implements ReadWriteLock, java.io.Serializable {
}
```




[Lock接口方法分析](https://github.com/pzxwhc/MineKnowContainer/issues/16)


## volatile

当且仅当满足一下**所有**条件时,才应该使用volatile变量
- 对变量的写入操作不依赖当前变量,或者能确保只有单个线程更新变量的值
- 该变量不会与其他状态变量一起纳入不变性条件中
- 在访问变量时不需要加锁


Q:
- volatile 修饰符的有过什么实践
- volatile 变量是什么？volatile 变量和 atomic 变量有什么不同
- volatile 类型变量提供什么保证？能使得一个非原子操作变成原子操作吗
- 能创建 volatile 数组吗？