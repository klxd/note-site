---
title: Netflix Hystrix
date: "2019-12-31T22:22:22.169Z"
path:  "/netflix-hystrix"
tags:
   - middleware
---

## spring cloud hystrix
maven文件依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-hystrix</artifactId>
    <version>1.4.5.RELEASE</version>
</dependency>
```
一般在ApplicationClass中加入注解`@EnableCircuitBreaker`，
```java
@Slf4j
@RestController
@RequestMapping("/hystrix")
@EnableCircuitBreaker
public class HystrixDemoController {

    @RequestMapping("/status")
    @HystrixCommand(fallbackMethod = "statusCallback")
    public String status() {
        log.info("call status");
        if (true) {
            throw new RuntimeException();
        }
        return "running";
    }

    private String statusCallback() {
        log.info("call status call back");
        return "call back running";
    }
}

```
Spring Cloud采用AOP实现hystrix的功能

## Hystrix 容错方法
Hystrix是Netflix开源的一款容错框架，包含常用的容错方法：线程池隔离、信号量隔离、熔断、降级回退

## 线程池隔离
执行Command的方式一共四种
* execute()：以同步堵塞方式执行run()。调用execute()后，hystrix先创建一个新线程运行run()，接着调用程序要在execute()调用处一直堵塞着，直到run()运行完成。

* queue()：以异步非堵塞方式执行run()。调用queue()就直接返回一个Future对象，同时hystrix创建一个新线程运行run()，
  调用程序通过Future.get()拿到run()的返回结果，而Future.get()是堵塞执行的。

* observe()：事件注册前执行run()/construct()。
  第一步是事件注册前，先调用observe()自动触发执行run()/construct()（如果继承的是HystrixCommand，hystrix将创建新线程非堵塞执行run()；
  如果继承的是HystrixObservableCommand，将以调用程序线程堵塞执行construct()）;
  第二步是从observe()返回后调用程序调用subscribe()完成事件注册，如果run()/construct()执行成功则触发onNext()和onCompleted()，
  如果执行异常则触发onError()。

* toObservable()：事件注册后执行run()/construct()。
  第一步是事件注册前，调用toObservable()就直接返回一个Observable<String>对象，
  第二步调用subscribe()完成事件注册后自动触发执行run()/construct()（如果继承的是HystrixCommand，hystrix将创建新线程非堵塞执行run()，
  调用程序不必等待run()；如果继承的是HystrixObservableCommand，将以调用程序线程堵塞执行construct()，调用程序等待construct()执行完才能继续往下走），
  如果run()/construct()执行成功则触发onNext()和onCompleted()，如果执行异常则触发onError()
  
注：
execute()和queue()是HystrixCommand中的方法，observe()和toObservable()是HystrixObservableCommand 中的方法。
从底层实现来讲，HystrixCommand其实也是利用Observable实现的（如果我们看Hystrix的源码的话，可以发现里面大量使用了RxJava），
虽然HystrixCommand只返回单个的结果，但HystrixCommand的queue方法实际上是调用了toObservable().toBlocking().toFuture()，
而execute方法实际上是调用了queue().get()。

执行依赖代码的线程与请求线程(比如Tomcat线程)分离，请求线程可以自由控制离开的时间，这也是我们通常说的异步编程，Hystrix是结合RxJava来实现的异步编程。通过设置线程池大小来控制并发访问量，当线程饱和的时候可以拒绝服务，防止依赖问题扩散。

线程池隔离的优点:
[1]:应用程序会被完全保护起来，即使依赖的一个服务的线程池满了，也不会影响到应用程序的其他部分。
[2]:我们给应用程序引入一个新的风险较低的客户端lib的时候，如果发生问题，也是在本lib中，并不会影响到其他内容，因此我们可以大胆的引入新lib库。
[3]:当依赖的一个失败的服务恢复正常时，应用程序会立即恢复正常的性能。
[4]:如果我们的应用程序一些参数配置错误了，线程池的运行状况将会很快显示出来，比如延迟、超时、拒绝等。同时可以通过动态属性实时执行来处理纠正错误的参数配置。
[5]:如果服务的性能有变化，从而需要调整，比如增加或者减少超时时间，更改重试次数，就可以通过线程池指标动态属性修改，而且不会影响到其他调用请求。
[6]:除了隔离优势外，hystrix拥有专门的线程池可提供内置的并发功能，使得可以在同步调用之上构建异步的外观模式，这样就可以很方便的做异步编程（Hystrix引入了Rxjava异步框架）。

线程池隔离的缺点:
[1]:线程池的主要缺点就是它增加了计算的开销，每个业务请求（被包装成命令）在执行的时候，会涉及到请求排队，调度和上下文切换。不过Netflix公司内部认为线程隔离开销足够小，不会产生重大的成本或性能的影响。

## 信号量
将属性execution.isolation.strategy设置为SEMAPHORE ，象这样 ExecutionIsolationStrategy.SEMAPHORE，则Hystrix使用信号量而不是默认的线程池来做隔离。
信号量隔离的方式是限制了总的并发数，每一次请求过来，请求线程和调用依赖服务的线程是同一个线程，那么如果不涉及远程RPC调用（没有网络开销）则使用信号量来隔离，更为轻量，开销更小。

线程池和信号量的区别
上面谈到了线程池的缺点，当我们依赖的服务是极低延迟的，比如访问内存缓存，就没有必要使用线程池的方式，那样的话开销得不偿失，而是推荐使用信号量这种方式。
下面这张图说明了线程池隔离和信号量隔离的主要区别：线程池方式下业务请求线程和执行依赖的服务的线程不是同一个线程；信号量方式下业务请求线程和执行依赖服务的线程是同一个线程

## 熔断
Hystrix在运行过程中会向每个commandKey对应的熔断器报告成功、失败、超时和拒绝的状态，熔断器维护计算统计的数据，根据这些统计的信息来确定熔断器是否打开。如果打开，后续的请求都会被截断。然后会隔一段时间默认是5s，尝试半开，放入一部分流量请求进来，相当于对依赖服务进行一次健康检查，如果恢复，熔断器关闭，随后完全恢复调用.
Hystrix会检查Circuit Breaker的状态。如果Circuit Breaker的状态为开启状态，Hystrix将不会执行对应指令，而是直接进入失败处理状态（图中8 Fallback）。如果Circuit Breaker的状态为关闭状态，Hystrix会继续进行线程池、任务队列、信号量的检查（图中5）

由于Hystrix是一个容错框架，因此我们在使用的时候，要达到熔断的目的只需配置一些参数就可以了。但我们要达到真正的效果，就必须要了解这些参数。Circuit Breaker一共包括如下6个参数。
1、circuitBreaker.enabled
是否启用熔断器，默认是TURE。
2、circuitBreaker.forceOpen
熔断器强制打开，始终保持打开状态。默认值FLASE。
3、circuitBreaker.forceClosed
熔断器强制关闭，始终保持关闭状态。默认值FLASE。
4、circuitBreaker.errorThresholdPercentage
设定错误百分比，默认值50%，例如一段时间（10s）内有100个请求，其中有55个超时或者异常返回了，那么这段时间内的错误百分比是55%，大于了默认值50%，这种情况下触发熔断器-打开。
5、circuitBreaker.requestVolumeThreshold
默认值20.意思是至少有20个请求才进行errorThresholdPercentage错误百分比计算。比如一段时间（10s）内有19个请求全部失败了。错误百分比是100%，但熔断器不会打开，因为requestVolumeThreshold的值是20. 这个参数非常重要，熔断器是否打开首先要满足这个条件，
6、circuitBreaker.sleepWindowInMilliseconds
半开试探休眠时间，默认值5000ms。当熔断器开启一段时间之后比如5000ms，会尝试放过去一部分流量进行试探，确定依赖服务是否恢复。

断路器对应源码`HystrixCircuitBreaker.java`
每个熔断器默认维护10个bucket,每秒一个bucket,每个blucket记录成功,失败,超时,拒绝的状态，默认错误超过50%且10秒内超过20个请求进行中断拦截。下图显示HystrixCommand或HystrixObservableCommand如何与HystrixCircuitBreaker及其逻辑和决策流程进行交互，包括计数器在断路器中的行为。

## 回退降级
所谓降级，就是指在在Hystrix执行非核心链路功能失败的情况下，我们如何处理，比如我们返回默认值等。如果我们要回退或者降级处理，代码上需要实现HystrixCommand.getFallback()方法或者是HystrixObservableCommand. HystrixObservableCommand()。
Hystrix一共有如下几种降级回退模式
* Fail Fast 快速失败
* Fail Silent 无声失败
* Fallback: Static 返回默认值
* Fallback: Stubbed 自己组装一个值返回
* Fallback: Cache via Network 利用远程缓存
* Primary + Secondary with Fallback 主次方式回退（主要和次要）


[Hystrix系列文章](https://chenyongjun.vip/articles/114)
[Hystrix原理与实战](https://my.oschina.net/7001/blog/1619842)