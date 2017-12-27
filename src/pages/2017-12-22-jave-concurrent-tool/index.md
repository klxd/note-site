---
title: Java中的并发工具类
date: "2017-12-22T22:22:22.169Z"
path:  "/java-concurrent-tool"
tags:
   - java
---

## 等待多线程完成的 CountDownLatch

CountDownLatch 允许一个或者多个线程等待其他线程完成操作,
`Latch`有门闩的意思,`CountDownLatch`能阻塞住线程,直到其他线程的工作完成,
才继续接下来的工作.

### 接口解析

```java
public class CountDownLatch {

    /**
     * 构造函数,count代表在{@link #await}能停止阻塞之前,方法{@link #countDown}必须
     * 被调用的次数,count不能小于0
     */
    public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");
        this.sync = new Sync(count);
    }

    /**
     * 阻塞当前线程直到计数器变为0,有可能被打断
     * 若计数器已经为0,此函数立刻返回
     */
    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    /**
     * 作用与{@link #await}方法基本相同,不过可以指定最长的等待时间
     * @return 若计数器到达0则返回true,若超过了等待时间则返回false
     */
    public boolean await(long timeout, TimeUnit unit)
        throws InterruptedException {
        return sync.tryAcquireSharedNanos(1, unit.toNanos(timeout));
    }

    /**
     * 将计数器减一,若计数值已经为零,则不做任何事情
     */
    public void countDown() {
        sync.releaseShared(1);
    }

    /**
     * 返回当前计数器的值
     */
    public long getCount() {
        return sync.getCount();
    }
}
```

### 使用样例

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class CountDownLatchTest {

    private static CountDownLatch c = new CountDownLatch(2);

    public static void main(String[] args) throws InterruptedException {
        System.out.println("start");

        new Thread(() -> {
            System.out.println(String.format("count is %d", c.getCount()));
            c.countDown();
            System.out.println(String.format("count is %d", c.getCount()));
            c.countDown();

        }
        ).start();
        System.out.println("waiting");
        // c.await(5, TimeUnit.SECONDS);
        c.await();
        System.out.println("end");

    }
}
```

运行输出为:

```
start
waiting
count is 2
count is 1
end
```

## 同步屏障 CyclicBarrier

CyclicBarrier 让一组线程在到达一个屏障(同步点)时被阻塞,知道满足数量的线程到达屏障时,屏障才会撤销,让所有被屏障阻塞的线程继续运行.Cyclic 意思为循环使用的,表示了
CyclicBarrier 可以被复用.具体的体现是当

### 接口解析

```java
public class CyclicBarrier {
    /**
     * @param parties 在屏障撤销之前,必须调用{@link #await}方法的线程数,parties必须大于0
     * @param barrierAction 屏障撤销的时候,会被调用的方法
     */
    public CyclicBarrier(int parties, Runnable barrierAction) {
        if (parties <= 0) throw new IllegalArgumentException();
        this.parties = parties;
        this.count = parties;
        this.barrierCommand = barrierAction;
    }

    public CyclicBarrier(int parties) {
        this(parties, null);
    }

    public int getParties() {
        return parties;
    }

    /**
     * 阻塞当前线程,直到以下情况发生:
     * 1. 最后一个线程到达屏障
     * 2. 当前线程被打断,抛出InterruptedException
     * 3. 其他被屏障阻塞的线程被打断,抛出BrokenBarrierException
     * 4. 其他被屏障阻塞的线程超过了其最长的等待时间,抛出BrokenBarrierException
     * 5. 屏障的{@link #reset}方法被调用,抛出BrokenBarrierException
     *
     * 若当前线程是最后一个到达屏障的线程且barrier-action非空,那么它会先执行barrier-action,
     * 若执行失败则抛出BrokenBarrierException,然后其他再等待的线程才能继续运行
     *
     * @return the arrival index of the current thread, where index
     *         {@code getParties() - 1} indicates the first
     *         to arrive and zero indicates the last to arrive
     */
    public int await() throws InterruptedException, BrokenBarrierException {
        try {
            return dowait(false, 0L);
        } catch (TimeoutException toe) {
            throw new Error(toe); // cannot happen
        }
    }

    /**
     * 基本作用与{@link #await}函数相同,不过可以指定最长等待时间,若超过这个时间则
     * 抛出TimeoutException
     */
    public int await(long timeout, TimeUnit unit)
        throws InterruptedException,
               BrokenBarrierException,
               TimeoutException {
        return dowait(true, unit.toNanos(timeout));
    }

    /**
     * broken状态的定义:
     * 1.有任何等待的线程被打断或者等待超时
     * 2. 执行barrier-action失败
     */
    public boolean isBroken() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return generation.broken;
        } finally {
            lock.unlock();
        }
    }

    /**
     * 重置barrier回初始状态,此时所有正在等待的线程将会抛出BrokenBarrierException
     */
    public void reset() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            breakBarrier();   // break the current generation
            nextGeneration(); // start a new generation
        } finally {
            lock.unlock();
        }
    }

    /**
     * 返回正在等待的线程数
     */
    public int getNumberWaiting() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return parties - count;
        } finally {
            lock.unlock();
        }
    }
}
```

### 使用样例

```java
import java.util.concurrent.CyclicBarrier;

class MockRunnable implements Runnable {
    private final int num;

    public MockRunnable(int num) {
        this.num = num;
    }

    @Override
    public void run() {
        System.out.println(String.format("Thread %d is running", num));
        try {
            CyclicBarrierTest.cb.await();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(String.format("Thread %d is finish", num));
    }
}

public class CyclicBarrierTest {
    static CyclicBarrier cb = new CyclicBarrier(2, () -> {
        System.out.println("Barrier Action");

    });

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 4; i++) {
            new Thread(new MockRunnable(i + 1)).start();
        }
    }
}
```

运行结果:

```
Thread 2 is running
Thread 1 is running
Thread 4 is running
Thread 3 is running
Barrier Action
Thread 3 is finish
Barrier Action
Thread 4 is finish
Thread 1 is finish
Thread 2 is finish
```

* 线程并发执行,输出顺序无法保证
* 若线程数为偶数,程序顺利完成,否则会由于没有设置超时时间而陷入无限等待
* 体现了 CyclicBarrier 的可复用性,不用显式调用`reset`函数,
  每当最后一个线程到达屏障时,屏障会自动重置为初始状态

## 控制并发线程数的 Semaphore

Semaphore(信号量)可以用来控制同时访问特定资源的线程数量

### 接口解析

```java
public class Semaphore implements java.io.Serializable {

    /**
     * 创建一个不公平的信号量
     * @param permits 初始的许可证数量
     */
    public Semaphore(int permits) {
        sync = new NonfairSync(permits);
    }

    /**
     * @param permits 初始的许可证数量
     *        可为负值,表示在发放许可证之前方法{@link #release}需要被调用的次数
     * @param fair 授权机制是否公平,公平->先到先得, 不公平->抢占式
     */
    public Semaphore(int permits, boolean fair) {
        sync = fair ? new FairSync(permits) : new NonfairSync(permits);
    }

    /**
     * 从信号量中请求一个许可证,当前线程会被阻塞,直到获得许可证或者被中断
     */
    public void acquire() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    /**
     * 请求一个许可证,等待期间不接受中断
     */
    public void acquireUninterruptibly() {
        sync.acquireShared(1);
    }

    /**
     * 尝试获得一个许可证,无论成功与否此方法都会立刻返回.
     * 无论此信号量的授权机制是否公平,此方法都会使用不公平的抢占式机制,
     * 即无论当前是否有线程在等待许可证,只要调用此方法时有可用的许可证,它都会立刻抢占.
     *  此抢占式机制同样适用于{@link #tryAcquire(long, TimeUnit)}
     * @return 是否成功获得许可证
     */
    public boolean tryAcquire() {
        return sync.nonfairTryAcquireShared(1) >= 0;
    }

    /**
     * 尝试获得一个许可证,如果当前没有可用的许可证,则阻塞一段时间,直到
     * 当前线程被打断或者超时
     */
    public boolean tryAcquire(long timeout, TimeUnit unit)
        throws InterruptedException {
        return sync.tryAcquireSharedNanos(1, unit.toNanos(timeout));
    }

    /**
     * 释放一个许可证
     */
    public void release() {
        sync.releaseShared(1);
    }

    /**
     * 请求一定数量的许可证,当前线程会被阻塞,直到获得许可证或者被中断
     */
    public void acquire(int permits) throws InterruptedException {
        if (permits < 0) throw new IllegalArgumentException();
        sync.acquireSharedInterruptibly(permits);
    }

    /**
     * 请求一定数量的许可证,等待期间不接受中断
     */
    public void acquireUninterruptibly(int permits) {
        if (permits < 0) throw new IllegalArgumentException();
        sync.acquireShared(permits);
    }

    /**
     * 尝试获得一定数量的许可证,无论成功与否此方法都会立刻返回.
     * 会使用不公平的抢占式机制
     */
    public boolean tryAcquire(int permits) {
        if (permits < 0) throw new IllegalArgumentException();
        return sync.nonfairTryAcquireShared(permits) >= 0;
    }

    /**
     * 尝试获得一定数量的许可证,如果当前没有可用的许可证,则阻塞一段时间,直到
     * 当前线程被打断或者超时
     * 会使用不公平的抢占式机制
     */
    public boolean tryAcquire(int permits, long timeout, TimeUnit unit)
        throws InterruptedException {
        if (permits < 0) throw new IllegalArgumentException();
        return sync.tryAcquireSharedNanos(permits, unit.toNanos(timeout));
    }

    /**
     * 释放一定数量的许可证,此数量可以是任意的非负数 
     */
    public void release(int permits) {
        if (permits < 0) throw new IllegalArgumentException();
        sync.releaseShared(permits);
    }

    /**
     * 返回此信号量中当前可用的许可证数
     */
    public int availablePermits() {
        return sync.getPermits();
    }

    /**
     * 取走此信号量中当前可用的所有许可证
     * @return 被取走的许可证数量
     */
    public int drainPermits() {
        return sync.drainPermits();
    }

    /**
     * 减少可用的许可证数量  
     * 此方法为protected方法,可在子类中做资源的可用性检查,然后调用此方法
     * 减少许可证的数量,此方法与{@code acquire}不同,不会阻塞当前线程
     */
    protected void reducePermits(int reduction) {
        if (reduction < 0) throw new IllegalArgumentException();
        sync.reducePermits(reduction);
    }

    /**
     * 当前的授权机制是否公平
     */
    public boolean isFair() {
        return sync instanceof FairSync;
    }

    /**
     * 返回现在是否有正在等待的线程
     */
    public final boolean hasQueuedThreads() {
        return sync.hasQueuedThreads();
    }

    /**
     * 返回正在等待获取许可证的线程数
     */
    public final int getQueueLength() {
        return sync.getQueueLength();
    }

    /**
     * 返回所有正在等待的线程,protected方法
     */
    protected Collection<Thread> getQueuedThreads() {
        return sync.getQueuedThreads();
    }
}
```

### 程序示例

## 线程间交换数据的Exchanger

```java
public class Exchanger<V> {
    /**
     * 构造函数
     */
    public Exchanger() {
        participant = new Participant();
    }
    /**
     * 等待另一个线程也调用此函数,然后互相交换数据
     * 等待期间可能被打断
     */
    @SuppressWarnings("unchecked")
    public V exchange(V x) throws InterruptedException {
        // ...
    }
    
    /**
     * 等待另一个线程也调用此函数,然后互相交换数据
     * 等待期间可能被打断,抛出InterruptedException
     * 等待超时则抛出TimeoutException
     */
    @SuppressWarnings("unchecked")
    public V exchange(V x, long timeout, TimeUnit unit) {
        // ...
    }
    
}
```

## 参考资料

* [Java 并发编程的艺术](https://www.gitbook.com/book/ysysdzz/theartofjavaconcurrencyprogramming/details)
