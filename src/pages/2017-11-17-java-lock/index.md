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
### lock和unlock方法
```java
lock.lock();
try {
    
    ......
} finally {
    lock.unlock();  
}
```
- lock方法相当于显式创建临界区
- Lock不会自动释放锁(synchronize在发生异常时自动释放),需要在`try-finally`中显式释放锁
- `return`语句必须在try的子句中出现,确保unlock不过过早的发生

### lockInterruptibly







[Lock接口方法分析](https://github.com/pzxwhc/MineKnowContainer/issues/16)