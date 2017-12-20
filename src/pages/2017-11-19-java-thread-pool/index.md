---
title: Java Thread Pool
date: "2017-11-19T22:22:22.169Z"
path:  "/java-thread-pool"
tags:
   - java
---

Java中的线程池是运用场景最多的并发框架,几乎所有需要异步或并发执行任务的程序
都可以使用线程池。在开发过程中,合理地使用线程池能够带来3个好处。
- 降低资源消耗。通过重复利用已创建的线程降低线程创建和销毁造成的消耗。
- 提高响应速度。当任务到达时,任务可以不需要等到线程创建就能立即执行。
- 提高线程的可管理性。线程是稀缺资源,如果无限制地创建,不仅会消耗系统资源,
  还会降低系统的稳定性,使用线程池可以进行统一分配、调优和监控。


## java.util.concurrent包中相关的类
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
- FixedThreadPool适用于为了满足资源管理的需求,而需要限制当前线程数量的应用场
  景,它适用于负载比较重的服务器
- FixedThreadPool使用无界队列LinkedBlockingQueue作为线程池的工作队列(队列的容量为
  Integer.MAX_VALUE)。使用无界队列作为工作队列会对线程池带来如下影响
   1. 当线程池中的线程数达到corePoolSize后,新任务将在无界队列中等待,因此线程池中
      的线程数不会超过corePoolSize
   2. 由于1,使用无界队列时maximumPoolSize将是一个无效参数(等于corePoolSize)
   3. 由于1和2,使用无界队列时keepAliveTime将是一个无效参数(等于0)
   4. 由于使用无界队列,运行中的FixedThreadPool(未执行方法shutdown()或
   shutdownNow())不会拒绝任务(不会调用RejectedExecutionHandler.rejectedExecution方法)
  
  
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
- SingleThreadExecutor适用于需要保证顺序地执行各个任务;并且在任意时间点,不会有多
  个线程是活动的应用场景
- SingleThreadExecutor的corePoolSize和maximumPoolSize被设置为1
- 与FixedThreadPool相同,SingleThreadExecutor使用无界队列LinkedBlockingQueue作为线程池的工
  作队列(队列的容量为Integer.MAX_VALUE)

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
- CachedThreadPool是大小无界的线程池,适用于执行很多的短期异步任务的小程序,或者
  是负载较轻的服务器
