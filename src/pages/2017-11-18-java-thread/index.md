---
title: Java Thread
date: "2017-11-17T22:22:22.169Z"
path:  "/java-thread"
tags:
   - java
---

## 线程基础

```java
// java8的函数式接口
@FunctionalInterface
public interface Runnable {
    void run();
}

public
class Thread implements Runnable {
    // 实现了Runnable接口,又聚合了一个Runnable实例
    private Runnable target;

    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }
}
```

Java 中的线程在运行的生命在周期中可能处于以下 6 个状态之一

* new 初始状态,线程被构建,但是还没有调用 start()方法
* runnable 运行状态,Java 线程将操作系统中的*就绪*和*运行*两种状态都笼统的称作*运行中*
* blocked 阻塞状态,表示线程阻塞于*锁*
* waiting 等待状态,表示线程进入等待状态,进入该状态表示当前线程需要等待其他线程作出一些特定动作(*通知*或*中断*)
* time-waiting 超时等待状态,该状态不同于 waiting,它是可以在指定时间的自行返回的(比如自己 sleep 一定的时间)
* terminated 终止状态,表示当前线程已经执行完毕

[thread-state](thread-state.png)
注意: 线程阻塞在进入 synchronized 关键字锁时的状态是*阻塞状态*,
而阻塞在 Lock 接口时的状态是*等待状态*.

## Daemon 线程 (后台线程,守护线程)

```java
public class Thread implements Runnable {
    /* Whether or not the thread is a daemon thread. */
    private boolean daemon = false;

    public final void setDaemon(boolean on) {
        checkAccess();
        if (isAlive()) {
            throw new IllegalThreadStateException();
        }
        daemon = on;
    }
    public final boolean isDaemon() {
        return daemon;
    }
}
```

* Daemon 线程是一种支持型线程,主要用于程序中的后台调度和支持型工作
* 不是程序中不可或缺的一部分,当所有的非 Daemon 线程退出的时候,JVM 将会退出
* Daemon 属性需要在启动线程之前设置
* Daemon 线程中的 finally 块并不一定会执行
* 由 Daemon 线程创建的任务子线程都会被自动设置成后台线程

## init() 线程初始化

```java
public class Thread implements Runnable {
    private void init(ThreadGroup g, Runnable target, String name,
                      long stackSize, AccessControlContext acc) {
        if (name == null) {
            throw new NullPointerException("name cannot be null");
        }

        this.name = name;
        // -- 将当前线程设为新建线程的父线程
        Thread parent = currentThread();
        SecurityManager security = System.getSecurityManager();
        if (g == null) {
            /* Determine if it's an applet or not */

            /* If there is a security manager, ask the security manager
               what to do. */
            if (security != null) {
                g = security.getThreadGroup();
            }

            /* If the security doesn't have a strong opinion of the matter
               use the parent thread group. */
            if (g == null) {
                g = parent.getThreadGroup();
            }
        }

        /* checkAccess regardless of whether or not threadgroup is
           explicitly passed in. */
        g.checkAccess();

        /*
         * Do we have the required permissions?
         */
        if (security != null) {
            if (isCCLOverridden(getClass())) {
                security.checkPermission(SUBCLASS_IMPLEMENTATION_PERMISSION);
            }
        }

        g.addUnstarted();

        this.group = g;
        // -- 将daemon和priority属性设置为父线程对应属性
        this.daemon = parent.isDaemon();
        this.priority = parent.getPriority();
        if (security == null || isCCLOverridden(parent.getClass()))
            this.contextClassLoader = parent.getContextClassLoader();
        else
            this.contextClassLoader = parent.contextClassLoader;
        this.inheritedAccessControlContext =
                acc != null ? acc : AccessController.getContext();
        this.target = target;
        setPriority(priority);
        // -- 将父线程的inheritableThreadLocals复制过来
        if (parent.inheritableThreadLocals != null)
            this.inheritableThreadLocals =
                ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
        /* Stash the specified stack size in case the VM cares */
        this.stackSize = stackSize;

        // -- 分配线程ID
        /* Set thread ID */
        tid = nextThreadID();
    }
}
```

## start 启动线程

```java
public synchronized void start() {
    /**
     * This method is not invoked for the main method thread or "system"
     * group threads created/set up by the VM. Any new functionality added
     * to this method in the future may have to also be added to the VM.
     *
     * A zero status value corresponds to state "NEW".
     */
    if (threadStatus != 0)
        throw new IllegalThreadStateException();

    /* Notify the group that this thread is about to be started
     * so that it can be added to the group's list of threads
     * and the group's unstarted count can be decremented. */
    group.add(this);

    boolean started = false;
    try {
        start0();
        started = true;
    } finally {
        try {
            if (!started) {
                group.threadStartFailed(this);
            }
        } catch (Throwable ignore) {
            /* do nothing. If start0 threw a Throwable then
              it will be passed up the call stack */
        }
    }
}
private native void start0();
```

* start()方法的含义: 当前线程(即 parent 线程)*同步*告诉虚拟机,只要线程规划器空闲,
  应立即启动调用 start()方法的线程

## 中断

## 等待 & 通知

问题引入: 锁(synchronized)的互斥机制同步了线程之间的行为,解决了线程之间相互干涉的问题,
但是没有解决线程之间的协作问题(比如某些部分的工作必须在其他部分被解决之前解决).
本质问题是如何实现:一个线程(生产者)修改了一个对象的值(完成某些工作),而让另一个线程(消费者)感知到变化.
简单的实现方法是让消费者线程

```java
// 简单的实现: 让消费者线程不断循环检查变量是否符合预期
synchronized (syncObject) {
    while (value != desire) {
        Thread.sleep(1000);
    }
    // doSomething()
}
```

以上实现存在如下问题:

* 难以确保及时性.在睡眠时,基本不消耗处理器资源,但是如果睡的太久,就不能及时对变化作出相应
* 难以降低开销.如果降低睡眠的时间,比如休眠一毫秒,这样能迅速发现变化,但是相当于退化成空循环,
  即是*忙等待*,这通常是一种不良的 CPU 周期使用方式.
* 在互斥块中,调用 sleep 和 yield 并不会释放锁,这意味着其他线程并不能获得锁并协作本线程

以上问题能够使用 Java 内置的*等待-通知*机制解决,此机制的使用方法定义在基类 Object 上,
相关方法如下:

* notify() 通知一个在对象上等待的线程,使其重 wait()方法返回,
  而返回的前提是该线程获取到了对象的锁,调用 notify 不会释放锁
* notifyAll() 通知所有等待在该对象上的线程,调用 notifyAll 不会释放锁
* wait() 调用该方法的线程进入 waiting 状态,只有等待另外线程的通知或者被中断才会返回,
  需要注意的是,调用 wait()方法后,会释放对象的锁
* wait(long) 超时等待一段时间,这里的参数时间是毫秒,也就是等待长达 n 毫秒,
  如果没有通知就超时返回
* wait(long, int) 对超时时间更细粒度的控制,可以达到纳秒

为什么以上*等待-通知*机制的方法放在 Object 中?

* 同步块中的锁是其所有对象的一部分,可以把 wait 放进任何同步控制方法里,
  而不用考虑这个类是否继承 Thread 或是实现了 Runnable
* 实际上,只能在同步方法或同步块中使用以上函数,而 sleep 可以在非同步块中使用(不用操作锁)
* 如果在非同步块中使用以上方法,可以通过编译,但是会在运行时抛出异常

[例子:WaitNotify](WaitNotify.java)
使用细节

* 使用 wait,notify 和 notifyAll 时需要先对调用对象加锁
* 调用 wait 方法后,线程状态由 running 变为 waiting,并将当前线程放到对象的等待队列
* notify 或是 notifyAll 方法调用后,等待线程依旧不会从 wait 返回,
  需要调用 notify 或 notifyA 的线程释放了锁之后,等待线程才有机会从 wait 返回
* notify 方法将等待队列的一个等待线程从等待队列移到同步队列中,
  而 notifyAll 方法则是将等待队列中所有线程全部移动到同步队列,
  被移动的线程状态由 waiting 变为 blocked
* 从 wait 方法返回的前提是获得了调用对象的锁

对应的伪代码如下

```java
// waiting thread
synchronized (syncObject) {
    while (value != desire) {
        syncObject.wait();
    }
    // do something
}

// notify thread
synchronized (syncObject){
    // change value
    syncObject.notifyAll();
}
```

## join

```java
/**
 * join方法会对线程对象本身上锁
 * @param millis 最长等待时间
 */
public final synchronized void join(long millis)
throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;

    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }

    if (millis == 0) {
        while (isAlive()) {
            // 父类Object上的方法,参数0表示没有超时时间
            wait(0);
        }
    } else {
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                break;
            }
            // 父类Object上的方法,参数delay为超时时间
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
public final void join() throws InterruptedException {
    join(0);
}
```

* 如果一个线程 a 执行了 b.join(),其含义是:当前线程 a 等待 b 线程终止之后才从 b.join()返回
* join(long millis)表示:如果线程 b 在给定的超时时间里没有终止,那么将会从该超时方法中返回
