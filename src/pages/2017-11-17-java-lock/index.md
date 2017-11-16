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
try {
    lock.lock();
    ......
} finally {
    lock.unlock();  
}
```
* lock方法...
* Lock不会自动释放锁(synchronize在发生异常时自动释放),需要在`try-finally`中显式释放锁

### lockInterruptibly







[Lock接口方法分析](https://github.com/pzxwhc/MineKnowContainer/issues/16)