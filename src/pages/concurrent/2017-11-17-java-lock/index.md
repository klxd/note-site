---
title: Java Lock
date: "2017-11-17T22:22:22.169Z"
path:  "/java-lock"
tags:
   - java
---
## 锁的内存语义

锁释放和锁获取的内存语义：

* 线程A释放一个锁，实质上是线程A向接下来将要获取这个锁的某个线程发出了（线程A对共享变量所做修改的）消息。
* 线程B获取一个锁，实质上是线程B接收了之前某个线程发出的（在释放这个锁之前对共享变量所做修改的）消息。
* 线程A释放锁，随后线程B获取这个锁，这个过程实质上是线程A通过主内存向线程B发送消息

## synchronized 对比 Lock

* lock 获取锁的过程比较可控,粒度更细,synchronize 获得锁的过程由 jvm 控制
* synchronize 会自动释放锁,lock 释放锁需要显式调用
* 轮询锁与定时锁需要Lock中tryLock接口来支持，可中断的获取锁操作需要lockInterruptibly支持，synchronize无法做到
* 由于JDK1.6中加入了针对锁的优化措施（见后面），使得synchronized与ReentrantLock的性能基本持平。ReentrantLock只是提供了synchronized更丰富的功能，而不一定有更优的性能，所以在synchronized能实现需求的情况下，优先考虑使用synchronized来进行同步。


## synchronized 锁优化
偏向锁、轻量级锁、重量级锁
Synchronized是通过对象内部的一个叫做监视器锁（monitor, 指令monitorenter和monitorexit）来实现的，监视器锁本质又是依赖于底层的操作系统的Mutex Lock（互斥锁）来实现的。
而操作系统实现线程之间的切换需要从用户态转换到核心态，这个成本非常高，状态之间的转换需要相对比较长的时间，
这就是为什么Synchronized效率低的原因。因此，这种依赖于操作系统Mutex Lock所实现的锁我们称之为“重量级锁”。

Java SE 1.6为了减少获得锁和释放锁带来的性能消耗，引入了“偏向锁”和“轻量级锁”：锁一共有4种状态，
级别从低到高依次是：无锁状态、偏向锁状态、轻量级锁状态和重量级锁状态。锁可以升级但不能降级。
偏向所锁，轻量级锁都是乐观锁，重量级锁是悲观锁。

* 一个对象刚开始实例化的时候，没有任何线程来访问它的时候。它是可偏向的，意味着，它现在认为只可能有一个线程来访问它，所以当第一个线程来访问它的时候，它会偏向这个线程，此时，对象持有偏向锁。偏向第一个线程，这个线程在修改对象头成为偏向锁的时候使用CAS操作，并将对象头中的ThreadID改成自己的ID，之后再次访问这个对象时，只需要对比ID，不需要再使用CAS在进行操作。

* 一旦有第二个线程访问这个对象，因为**偏向锁不会主动释放**，所以第二个线程可以看到对象时偏向状态，这时表明在这个对象上已经存在竞争了。检查原来持有该对象锁的线程是否依然存活，
  1. 如果挂了，则可以将对象变为无锁状态，然后重新偏向新的线程。
  2. 如果原来的线程依然存活，则马上执行那个线程的操作栈，检查该对象的使用情况，
    2.1 如果仍然需要持有偏向锁，则偏向锁升级为轻量级锁，（偏向锁就是这个时候升级为轻量级锁的），此时轻量级锁由原持有偏向锁的线程持有，继续执行其同步代码，而正在竞争的线程会进入**自旋等待**获得该轻量级锁；
    2.2 如果不存在使用了，则可以将对象回复成无锁状态，然后重新偏向(不用升级)。

* 轻量级锁认为竞争存在，但是竞争的程度很轻，一般两个线程对于同一个锁的操作都会错开，或者说稍微等待一下（自旋），另一个线程就会释放锁。 但是当自旋超过一定的次数，或者一个线程在持有锁，一个在自旋，又有第三个来访时，轻量级锁膨胀为重量级锁，重量级锁使除了拥有锁的线程以外的线程都阻塞，防止CPU空转。

＊　重量级锁：指向互斥量（mutex），底层通过操作系统的mutex lock实现。等待锁的线程会被阻塞，由于Linux下Java线程与操作系统内核态线程一一映射，所以涉及到用户态和内核态的切换、操作系统内核态中的线程的阻塞和恢复。

##　自旋锁与自适应自旋锁
引入自旋锁的原因：互斥同步对性能最大的影响是阻塞的实现，因为挂起线程和恢复线程的操作都需要转入内核态中完成，这些操作给系统的并发性能带来很大的压力。同时虚拟机的开发团队也注意到在许多应用上面，共享数据的锁定状态只会持续很短一段时间，为了这一段很短的时间频繁地阻塞和唤醒线程是非常不值得的。
＊　自旋锁：让该线程执行一段无意义的忙循环（自旋）等待一段时间，不会被立即挂起（自旋不放弃处理器额执行时间），看持有锁的线程是否会很快释放锁。自旋锁在JDK 1.4.2中引入，默认关闭，但是可以使用-XX:+UseSpinning开开启；在JDK1.6中默认开启。
＊　自旋锁的缺点：自旋等待不能替代阻塞，虽然它可以避免线程切换带来的开销，但是它占用了处理器的时间。如果持有锁的线程很快就释放了锁，那么自旋的效率就非常好；反之，自旋的线程就会白白消耗掉处理器的资源，它不会做任何有意义的工作，这样反而会带来性能上的浪费。所以说，自旋等待的时间（自旋的次数）必须要有一个限度，例如让其循环10次，如果自旋超过了定义的时间仍然没有获取到锁，则应该被挂起（进入阻塞状态）。通过参数-XX:PreBlockSpin可以调整自旋次数，默认的自旋次数为10。
＊　自适应的自旋锁：JDK1.6引入自适应的自旋锁，自适应就意味着自旋的次数不再是固定的，它是由前一次在同一个锁上的自旋时间及锁的拥有者的状态来决定：如果在同一个锁的对象上，自旋等待刚刚成功获得过锁，并且持有锁的线程正在运行中，那么虚拟机就会认为这次自旋也很有可能再次成功，进而它将允许自旋等待持续相对更长的时间。如果对于某个锁，自旋很少成功获得过，那在以后要获取这个锁时将可能省略掉自旋过程，以避免浪费处理器资源。简单来说，就是线程如果自旋成功了，则下次自旋的次数会更多，如果自旋失败了，则自旋的次数就会减少。
＊　自旋锁使用场景：从轻量级锁获取的流程中我们知道，当线程在获取轻量级锁的过程中执行CAS操作失败时，是要通过自旋来获取重量级锁的。（见前面“轻量级锁”）

### synchronized 方法

```java
public class SynchronizedObject {
    // 必须将共享资源设置为私有(不能被外部直接访问),否则synchronize方法将失去意义
    private Resource resource;
    // 所有的synchronize方法共享同一个锁,锁定的其实是这个对象本身
    synchronized void f() {/*访问resource*/}
    synchronized void g() {/*访问resource*/}
}
```

* 共享资源一般是以对象形式存在的内存的片段
* 要控制对共享资源的访问,一般是把它包装进一个对象,然后把所有要访问这个资源的方法标记为`synchronized`
* 如果某个线程正在调用一个标记为`synchronized`的方法,那么在此线程从该方法返回之前,
  所有要调用这个类中**任何**标记为`synchronized`方法的线程都会被阻塞
* 同一个线程可以多次获得对象的锁(`synchronized`实现的锁是可重入的)
  * 如 f 方法内部可以继续调用 g 方法,JVM 会负责追踪对象被加锁的次数
  * 只有首先获得了锁的线程才能继续重入这个锁,每次获得锁时,计数会递增
  * 当计数为零的时候,锁才被释放

## 临界区(同步控制块)

```java
synchronized (syncObject) {
    // 对于一个syncObject,同一时间只有一个线程能进入这段代码
}
```

* 相比与 synchronized 方法(对整个方法进行同步控制),
  同步控制块可以使多个任务访问对象的时间性能得到显著提高
* 临界区也可以用 Lock 对象来显式创建

## Lock 接口

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

* 此接口的实现基本都是通过聚合一个队列同步器(AbstractQueuedSynchronizer)来完成线程的访问控制的

### lock 和 unlock 方法

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

* lock 方法相当于显式创建临界区
* 不要将锁的获取过程写在 try 块中,因为如果在获取锁的过程中发生了异常,会导致锁的无故释放
* Lock 不会自动释放锁(synchronize 在发生异常时自动释放),需要在`try-finally`中显式释放锁

### lockInterruptibly 方法

```java
void lockInterruptibly() throws InterruptedException;
```

* 可中断地获取锁,和 lock()方法不同之处在于该方法会响应中断,即在锁的获取中可以中断当前线程
* 当通过这个方法去获取锁时，如果线程正在等待获取锁，则这个线程能够响应中断，即中断线程的等待状态。
例如当两个线程同时通过 lock.lockInterruptibly()想获取某个锁时，假若此时线程 A 获取到了锁，而线程 B 只有在等待，
那 么对线程 B 调用threadB.interrupt()方法能够中断线程 B 的等待过程。

### tryLock 方法

```java
boolean tryLock();
```

* 尝试非阻塞的获取锁,调用该方法之后立刻返回,如果能够获取则返回 true,否则返回 false

```java
boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
```

* 超时地获取锁,当前线程在以下三种情况下返回:
  1. 当前线程在超时时间内获得了锁
  2. 当前线程在超时时间内被中断
  3. 超时时间结束,返回 false

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

* 可重入的锁,对于已经获取到锁的线程,能够再次调用 lock 方法获取锁而不被阻塞
* 公平性问题: 若在绝对时间上,先对锁进行获取的请求一定先被满足,那么这个锁是公平的,否则不是
* 不同公平性的区别: 非公平性锁会使得其他锁饥饿,但是减少了线程的切换,保证了更大的吞吐量

* 注：内置锁（synchronized）并不会提供确定的公平性保证，Java语言规范并没有要求JVM以公平的方式实现内置锁（各种JVM实现也没有这么做，即内置锁是不公平的）

## ReadWriteLock 接口

```java
public interface ReadWriteLock {
    // 获得读锁
    Lock readLock();
    // 获得写锁
    Lock writeLock();
}
```

* 不是 Lock 接口的实现
* 不是排他锁(互斥锁),即允许同一时刻有多个读线程在访问
* 当有一个写线程在访问时,所有的读线程和其他写线程均被阻塞
* 通过分离读锁和写锁,使得并发性相比一般的排他锁有很大提升

## ReentrantReadWriteLock 类

```java
public class ReentrantReadWriteLock
        implements ReadWriteLock, java.io.Serializable {
}
```

[Lock 接口方法分析](https://github.com/pzxwhc/MineKnowContainer/issues/16)

## volatile

当且仅当满足一下**所有**条件时,才应该使用 volatile 变量

* 对变量的写入操作不依赖当前变量,或者能确保只有单个线程更新变量的值
* 该变量不会与其他状态变量一起纳入不变性条件中
* 在访问变量时不需要加锁

Q:

* volatile 修饰符的有过什么实践
* volatile 变量是什么？volatile 变量和 atomic 变量有什么不同
* volatile 类型变量提供什么保证？能使得一个非原子操作变成原子操作吗
-- volatile只能确保可见性， 一般不保证原子性（如count++）
-- 对于64位的double/long的读和写操作，虚拟机规范不要求其是原子操作，此时对其加上volatile声明可以确保其读写操作是原子的
* 能创建 volatile 数组吗？
-- volatile修饰的变量如果是对象或数组之类的，其含义是对象获数组的地址(引用)具有可见性，但是数组或对象内部的成员改变不具备可见性：
-- AtomicIntegerArray, AtomicLongArray, AtomicReferenceArray 能保证原子更新数组里的元素


[美团:不可不说的Java“锁”事](https://tech.meituan.com/2018/11/15/java-lock.html)
[Java并发编程：Synchronized底层优化（偏向锁、轻量级锁）](https://www.cnblogs.com/paddix/p/5405678.html)