---
title: Spring学习笔记
date: "2018-01-29T22:22:22.169Z"
path:  "/spring-framework"
tags:
   - spring
---

## AOP的相关概念
* 切面/方面（Aspect）：AOP核心就是切面，它将多个类的通用行为封装成可重用的模块，该模块含有一组API提供横切功能。
  如，一个日志模块可以被称作日志的AOP切面。根据需求的不同，一个应用程序可以有若干切面。在SpringAOP中，切面通过带有@Aspect注解的类实现。
* 连接点（Joinpoint）：程序执行过程中明确的点，如方法的调用或特定的异常被抛出, 对应拦截方法的传入参数`JoinPoint/ProceedingJoinPoint`。
* 通知/增强（Advice）：在切入点上，可以应用的增强包括：around、before和throws。许多AOP框架包括Spring都是以拦截器做通知模型，
  维护一个“围绕”连接点的拦截器链。Spring中定义了四个advice:BeforeAdvice, AfterAdvice, ThrowAdvice和DynamicIntroductionAdvice。
* 切入点（Pointcut）：将被增强（Advice）应用的连接点的集合（通常是Method集合）。对应拦截方法的`execution(public *.*)` 
  Spring定义了Pointcut接口，用来组合MethodMatcher和ClassFilter，可以通过名字很清楚的理解，
  MethodMatcher是用来检查目标类的方法是否可以被应用此通知，而ClassFilter是用来检查Pointcut是否应该应用到目标类上。
* 目标对象（TargetObject）：被通知（Advice）或被代理对象。
* AOP代理（AOP Proxy）：AOP框架创建的对象，包含通知（Advice）。在Spring中，AOP代理可以是JDK动态代理或者CGLIB代理。


## Spring AOP 实现
* 静态AOP, AspectJ(不同于Spring AOP的一种AOP实现), 通过编译器将Java字节码注入到Java类中, 每次改动需要重新编译, 灵活性不足;
  注意, spring 2.0之后集成了AspectJ的相关注解`@Aspect`, 但底层还是spring原先的实现体系
* 动态代理, Spring AOP默认的实现方式, [InvocationHandler](./DynamicProxy.java),
  所有横切关注点类都得实现相应的接口, 因为Java动态代理机制只针对接口有效
* 动态字节码增强, SpringAOP无法采用动态代理机制实现AOP的时候, 就会采用CGLIB(Code Generation Library)库的动态字节码增强来实现
  让程序在运行期间使用动态生成的子类, 即使没有实现相应接口也可以扩展; 注意如果类以及类中的实例方法声明为final的话则无法对其进行子类化的扩展.
  
## Spring中有哪些不同的advice类型
通知(advice)是你在你的程序中想要应用在其他模块中的横切关注点的实现。Advice主要有以下5种类型。
   
* 前置通知(Before Advice): 在连接点之前执行的Advice，不过除非它抛出异常，否则没有能力中断执行流。使用 @Before注解使用这个Advice。
* 返回之后通知(After Retuning Advice): 在连接点正常结束之后执行的Advice。例如，如果一个方法没有抛出异常正常返回。通过 @AfterReturning`关注使用它。
* 抛出（异常）后执行通知(After Throwing Advice): 如果一个方法通过抛出异常来退出的话，这个Advice就会被执行。通用 @AfterThrowing`注解来使用。
* 后置通知(After Advice): 无论连接点是通过什么方式退出的(正常返回或者抛出异常)都会执行在结束后执行这些Advice。通过@After注解使用。
* 围绕通知(Around Advice): 围绕连接点执行的Advice，这是最强大的Advice, 通常说的拦截器类型的advice。通过 @Around注解使用,
  如作用于controller上的Advice`@Around("execution(public * com.company.web.controller.*Controller.*(..))")`
  
## ProceedingJoinPoint 和 JoinPoint 的区别
JoinPoint只能获取相关参数, 无法执行连接点
```java
public interface JoinPoint { // 部分方法
    Object getThis();   // 代理对象本身
    Object getTarget(); // 连接点所在的目标对象
    Object[] getArgs(); // 参数列表
    Signature getSignature(); // 签名对象
}
```
```java
public interface ProceedingJoinPoint extends JoinPoint {
    void set$AroundClosure(AroundClosure arc);
    public Object proceed() throws Throwable;
    public Object proceed(Object[] args) throws Throwable;

}
```

## 值得探索的问题

* AOP的实现方法 - 动态代理
* 过滤器和拦截器的区别 
* spring sort for list 的应用

* [Java JDK代理、CGLIB、AspectJ代理分析比较](https://juejin.im/entry/595f53835188250d920875e3)

