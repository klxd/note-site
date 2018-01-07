---
title: Java中的Future接口
date: "2018-01-06T22:22:22.169Z"
path:  "/java-future"
tags:
   - java
---

## Future接口简介
Future接口在Java5中被引入,设计初衷是对未来某个时刻发生的结果进行建模.
```java
public interface Future<V> {

    /**
     * 尝试取消此任务:
     * 若任务已经完成或者被取消,则不做任何操作
     * 若任务还未开始,则此任务将被取消,即永远不会开始
     * 若任务已经开始,则通过传入参数决定是否打断执行任务的线程
     *
     * 此函数返回之后,接下来调用{@link #isDone}或{@link #isCancelled}
     * 永远只会返回{@code true}
     * @param mayInterruptIfRunning 是否打断正在执行此任务的线程
     * @return {@code false} if the task could not be cancelled,
     * typically because it has already completed normally;
     * {@code true} otherwise
     */
    boolean cancel(boolean mayInterruptIfRunning);

    /**
     * @return 此任务是否在执行完毕之前被取消
     */
    boolean isCancelled();

    /**
     * 返回任务是否完成
     * 完成的判定,以下情况均返回true:
     * 1. 正常执行结束
     * 2. 抛出异常
     * 3. 被取消
     */
    boolean isDone();

    /**
     * 取回任务的执行结果,若任务未完成,则当前线程进入等待状态
     */
    V get() throws InterruptedException, ExecutionException;

    /**
     * 取回任务的执行结果,若任务未完成,则当前线程等待一定的时间
     */
    V get(long timeout, TimeUnit unit)
            throws InterruptedException, ExecutionException, TimeoutException;
} 
```