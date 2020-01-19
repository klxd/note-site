---
title: 限流 rate-limit
date: "2020-01-05T22:22:22.169Z"
path:  "/rate-limit"
tags:
   - distributed
---

## 限流算法

### 令牌桶算法
存放固定容量令牌的桶, 按照固定的速率往桶里添加令牌
* 假设限制 2r/s, 则按照500毫秒的速率往桶中添加令牌
* 桶中最多存放b令牌, 当桶满时, 新的令牌被丢弃 (即多余的令牌只会缓存一段时间)
* 当请求令牌时, 若桶中令牌足够, 则删除相应数量的令牌, 返回成功
* 若令牌数量不够, 则直接返回失败或者等待直到桶中拥有足够的令牌

### 漏桶算法
* 一个固定容量的漏桶, 按照固定的速率流出水滴, 若桶是空的则不流出水滴
* 可以以任意速率流入水滴到漏桶
* 如果流入水滴时桶满了, 则必须抛弃部分水滴(新或旧), 桶的数量不变

## Guava RateLimiter
```java
public abstract class RateLimiter { 
//实例化的两种方式：
public static RateLimiter create(double permitsPerSecond){}
public static RateLimiter create(double permitsPerSecond,long warmupPeriod,TimeUnit unit) {}
 
// 只关心acquire，没有release操作
public double acquire() {
    // 预约，如果当前不能直接获取到 permits，需要等待, 返回值代表需要 sleep 多久
    long microsToWait = reserve(permits);
    // sleep等待
    stopwatch.sleepMicrosUninterruptibly(microsToWait);
    // 返回sleep的秒数
    return 1.0 * microsToWait / SECONDS.toMicros(1L);
}
public double acquire(int permits) {}
 
public boolean tryAcquire() {}
public boolean tryAcquire(int permits) {}
public boolean tryAcquire(long timeout, TimeUnit unit) {}
public boolean tryAcquire(int permits, long timeout, TimeUnit unit) {}
 
public final double getRate() {}
public final void setRate(double permitsPerSecond) {}
}
```

* RateLimiter 是用来控制访问资源的速率（rate）的，它强调的是控制速率。比如控制每秒只能有 100 个请求通过，比如允许每秒发送 1MB 的数据。
* 它的构造方法指定一个 permitsPerSecond 参数，代表每秒钟产生多少个 permits，这就是我们的速率。
* RateLimiter 允许预占未来的令牌，比如，每秒产生 5 个 permits，我们可以单次请求 100 个，这样，紧接着的下一个请求需要等待大概 20 秒才能获取到 permits。
* 目前只有一个子类SmoothRateLimiter(抽象类)，SmoothRateLimiter有两个实现类


### SmoothRateLimiter
```java
abstract class SmoothRateLimiter extends RateLimiter {

// 当前还有多少permits没有被使用，被存下来的permits数量
double storedPermits;
 
// 最大允许缓存的 permits 数量，也就是 storedPermits 能达到的最大值
double maxPermits;
 
// 每隔多少时间产生一个 permit，
// 比如我们构造方法中设置每秒 5 个，也就是每隔 200ms 一个，这里单位是微秒，也就是 200,000
double stableIntervalMicros;
 
// 下一次可以获取 permits 的时间，这个时间是相对 RateLimiter 的构造时间的，是一个相对时间
private long nextFreeTicketMicros = 0L;

final long reserveEarliestAvailable(int requiredPermits, long nowMicros) {
    resync(nowMicros);
    long returnValue = nextFreeTicketMicros;
    double storedPermitsToSpend = min(requiredPermits, this.storedPermits);
    double freshPermits = requiredPermits - storedPermitsToSpend;
    long waitMicros =
        storedPermitsToWaitTime(this.storedPermits, storedPermitsToSpend)
            + (long) (freshPermits * stableIntervalMicros);

    this.nextFreeTicketMicros = LongMath.saturatedAdd(nextFreeTicketMicros, waitMicros);
    this.storedPermits -= storedPermitsToSpend;
    return returnValue;
}

}
```

* nextFreeTicketMicros 是一个很关键的属性。我们每次获取 permits 的时候，先拿 storedPermits 的值，如果够，storedPermits 减去相应的值就可以了，
* 如果不够，那么还需要将 nextFreeTicketMicros 往前推，表示我预占了接下来多少时间的量了。
* 那么下一个请求来的时候，如果还没到 nextFreeTicketMicros 这个时间点，需要 sleep 到这个点再返回，当然也要将这个值再往前推。
  对于带超时时间的tryAcquire, 可以去判断等待的超时时间是否大于下次运行的时间，以使得能够执行，如果等待的超时时间太短，就能立即返回。


### SmoothBursty
* SmoothRateLimiter的子类之一
* Bursty是突发的意思, RateLimiter 会缓存一定数量的 permits 在池中，这样对于突发请求，能及时得到满足。
  想象一下我们的某个接口，很久没有请求过来，突然同时来了好几个请求，如果我们没有缓存一些 permits 的话，很多线程就需要等待了
* SmoothBursty 默认缓存最多1秒钟的 permits, 在构造函数中指定, 无法修改

### SmoothWarmingUp
* SmoothRateLimiter的子类之一
* 使用`public static RateLimiter create(double permitsPerSecond,long warmupPeriod,TimeUnit unit)`构造
* warmupPeriod表示从冷启动速率过渡到平均速率的时间间隔
* 程序刚开始运行的时候，warmingup方式会存满所有的令牌，而根据从存储令牌中的获取方式，可以实现从存储最大令牌中到降到一半令牌所需要的时间为存储同量令牌时间的2倍，
  从而使得刚开始的时候发放令牌的速度比较慢，等消耗一半之后，获取的速率和生产的速率一致，从而也就实现了一个‘热身’的概念
  
  
## 分布式限流
应用级限流只能是单应用内的请求限流, 分布式限流可以进行全局限流
* Redis+Lua脚本实现, 原理: 在redis中维护一个当前时间秒数作为key的变量, 每次acquire是变量+1, 若小于限流值则表示获取成功
* Nginx+Lua实现, 底层原理需要用到锁


* [限流原理解读之guava中的RateLimiter](https://juejin.im/post/5bb48d7b5188255c865e31bc)