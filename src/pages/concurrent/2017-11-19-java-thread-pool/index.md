---
title: Java Thread Pool
date: "2017-11-19T22:22:22.169Z"
path:  "/java-thread-pool"
tags:
   - java
---

Java 中的线程池是运用场景最多的并发框架,几乎所有需要异步或并发执行任务的程序都可以使用线程池。
在开发过程中,合理地使用线程池能够带来 3 个好处。

* 降低资源消耗。通过重复利用已创建的线程降低线程创建和销毁造成的消耗。
* 提高响应速度。当任务到达时,任务可以不需要等到线程创建就能立即执行。
* 提高线程的可管理性。线程是稀缺资源,如果无限制地创建,不仅会消耗系统资源,
  还会降低系统的稳定性,使用线程池可以进行统一分配、调优和监控。

## java.util.concurrent 包中相关的类

```java
public interface Executor {
    /**
     * 在未来的某个时间点执行给入命令
     */
    void execute(Runnable command);
}
public interface ExecutorService extends Executor {
    // ...
}
public abstract class AbstractExecutorService implements ExecutorService {
    // ...
}
public class ThreadPoolExecutor extends AbstractExecutorService {
    // ...
}
public interface ScheduledExecutorService extends ExecutorService {
    // ...
}
public class ScheduledThreadPoolExecutor
        extends ThreadPoolExecutor
        implements ScheduledExecutorService {
    // ...
}
```

## ThreadPoolExecutor 详解
构造参数
* int corePoolSize: 核心线程数
* int maximumPoolSize: 最大线程数
* long keepAliveTime: 空闲线程存活时间
* TimeUnit unit: 空闲线程存活时间单位
* BlockingQueue<Runnable> workQueue: 工作队列
* ThreadFactory threadFactory: 线程工厂
* RejectedExecutionHandler handler: 拒绝策略

```java
public class ThreadPoolExecutor extends AbstractExecutorService {

    /**
     * -- 核心线程池的大小
     * Core pool size is the minimum number of workers to keep alive
     * (and not allow to time out etc) unless allowCoreThreadTimeOut
     * is set, in which case the minimum is zero.
     */
    private volatile int corePoolSize;

    /**
     * -- 最大线程池的大小
     * Maximum pool size. Note that the actual maximum is internally
     * bounded by CAPACITY.
     */
    private volatile int maximumPoolSize;

    /**
     * 多余的空闲线程等待新任务的最长时间,超过这个时间后多余的线程将被终止
     * Timeout in nanoseconds for idle(空闲) threads waiting for work.
     * Threads use this timeout when there are more than corePoolSize
     * present or if allowCoreThreadTimeOut. Otherwise they wait
     * forever for new work.
     */
    private volatile long keepAliveTime;

    // 用来暂时保存任务的工作队列
    private final BlockingQueue<Runnable> workQueue;

    /**
     * -- 用于创建新线程的工厂
     */
    private volatile ThreadFactory threadFactory;

    /**
     * -- 当ThreadPoolExecutor已经关闭或ThreadPoolExecutor已经饱和
     *    时(达到了最大线程池大小且工作队列已满),execute()方法将要调用的Handler
     * Handler called when saturated or shutdown in execute.
     */
    private volatile RejectedExecutionHandler handler;

    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
}
```

## 执行流程
```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        /*
         * Proceed in 3 steps:
         *
         * 1. If fewer than corePoolSize threads are running, try to
         * start a new thread with the given command as its first
         * task.  The call to addWorker atomically checks runState and
         * workerCount, and so prevents false alarms that would add
         * threads when it shouldn't, by returning false.
         *
         * 2. If a task can be successfully queued, then we still need
         * to double-check whether we should have added a thread
         * (because existing ones died since last checking) or that
         * the pool shut down since entry into this method. So we
         * recheck state and if necessary roll back the enqueuing if
         * stopped, or start a new thread if there are none.
         *
         * 3. If we cannot queue task, then we try to add a new
         * thread.  If it fails, we know we are shut down or saturated
         * and so reject the task.
         */
        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            reject(command);
    }
}
```
* 新任务提交时, 若核心线程数未满, 尝试新建线程执行
* 核心线程已满, 尝试放入任务队列
* 任务队列已满, 尝试新建线程(不能超过最大线程数)
* 以上都不满足, 执行拒绝策略

## FixedThreadPool

```java
public class Executors {
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
    public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>(),
                                      threadFactory);
    }
}
```

* FixedThreadPool 适用于为了满足资源管理的需求,而需要限制当前线程数量的应用场景,它适用于负载比较重的服务器
* FixedThreadPool 使用无界队列 LinkedBlockingQueue 作为线程池的工作队列(队列的容量为
  Integer.MAX_VALUE)。使用无界队列作为工作队列会对线程池带来如下影响

  1. 当线程池中的线程数达到 corePoolSize 后,新任务将在无界队列中等待,因此线程池中的线程数不会超过 corePoolSize
  2. 由于 1,使用无界队列时 maximumPoolSize 将是一个无效参数(等于 corePoolSize)
  3. 由于 1 和 2,使用无界队列时 keepAliveTime 将是一个无效参数(等于 0)
  4. 由于使用无界队列,运行中的 FixedThreadPool(未执行方法 shutdown()或
     shutdownNow())不会拒绝任务(不会调用 RejectedExecutionHandler.rejectedExecution 方法)

## SingleThreadExecutor

```java
public class Executors {
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
    public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>(),
                                    threadFactory));
    }
}
```

* SingleThreadExecutor 适用于需要保证顺序地执行各个任务;并且在任意时间点,不会有多个线程是活动的应用场景
* SingleThreadExecutor 的 corePoolSize 和 maximumPoolSize 被设置为 1
* 与 FixedThreadPool 相同,SingleThreadExecutor 使用无界队列 LinkedBlockingQueue 作为线程池的工作队列(队列的容量为 Integer.MAX_VALUE)

## CachedThreadPool

```java
public class Executors {
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
    public static ExecutorService newCachedThreadPool(ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>(),
                                      threadFactory);
    }
}
```

* CachedThreadPool 是大小无界的线程池,适用于执行很多的短期异步任务的小程序,或者是负载较轻的服务器

## ScheduledThreadPoolExecutor

```java
public class Executors {
    public static ScheduledExecutorService newScheduledThreadPool(
            int corePoolSize, ThreadFactory threadFactory) {
        return new ScheduledThreadPoolExecutor(corePoolSize, threadFactory);
    }
}
```
* ScheduledThreadPoolExecutor继承自ThreadPoolExecutor, 实现了ScheduledExecutorService接口
* ScheduledThreadPoolExecutor的功能与Timer类似, Timer对应的是单个后台线程,
  而ScheduledThreadPoolExecutor可以在构造函数中指定多个对应的后台线程数
* ScheduledThreadPoolExecutor使用了DelayQueue, 这是一个无界队列, 所以maxPoolSize这个参数不起作用

* 内部调度任务使用了内部类ScheduledFutureTask
```java
private class ScheduledFutureTask<V>
        extends FutureTask<V> implements RunnableScheduledFuture<V> {

    /** 这个任务被添加到队列的序号 */
    private final long sequenceNumber;

    /** 这个任务将要被执行的具体时间(nanoTime units) */
    private long time;

    /**
     * 若 period > 0, 表示任务的执行周期
     * 若 period < 0, 表示这是一个固定延迟的任务(上一个任务完成之后再执行下一个)
     * 若 period = 0, 表示这是一个不用重复执行的任务
     */
    private final long period;
}
```
* DelayQueue封装了一个PriorityQueue, 这个队列会使用time对FutureTask进行排序,
  保证任务time小的排在前面, 若time相等则sequenceNumber小的排前面
