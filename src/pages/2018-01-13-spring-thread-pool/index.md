---
title: Spring中线程池的应用
date: "2018-01-06T22:22:22.169Z"
path:  "/spring-thread-pool"
tags:
   - spring
   - thread pool
---

## Spring**TaskExecutor**
TaskExecutor接口是Spring 2.0之后的一个新的抽象概念. 名字**Executor**表示这只是一个执行器,
而不对底层实现做任何保证,它的底层可以是线程池,也可以是单个线程,甚至是同步的实现. Spring提出的
TaskExecutor接口其实和```java.util.concurrent.Executor```包中的接口是完全相同的,
都只有一个方法```void execute(Runnable command)```,Spring提供这个接口是为了避免对Java 5
的依赖. 使得Spring在Java SE 1.4, Java SE 5和Java EE环境下均有统一的接口,隐藏了实现的细节.

## TaskExecutor的多种实现
Spring提供了**TaskExecutor**接口的多种实现,一般情况下找到符合自己需求的实现即可

* SimpleAsyncTaskExecutor
* ConcurrentTaskExecutor
* SimpleThreadPoolTaskExecutor
* ThreadPoolTaskExecutor
* TimerTaskExecutor
* WorkManagerTaskExecutor

## 参考资料
[Spring官方文档](https://docs.spring.io/autorepo/docs/spring-framework/3.2.x/spring-framework-reference/html/scheduling.html)