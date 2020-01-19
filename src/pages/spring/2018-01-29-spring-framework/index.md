---
title: Spring学习笔记
date: "2018-01-29T22:22:22.169Z"
path:  "/spring-framework"
tags:
   - spring
---

## spring bean的生命周期

1. 实例化Bean
  对于BeanFactory容器，当客户向容器请求一个尚未初始化的bean时，或初始化bean的时候需要注入另一个尚未初始化的依赖时，容器就会调用createBean进行实例化。 
  对于ApplicationContext容器，当容器启动结束后，便实例化所有的bean。 
  容器通过获取BeanDefinition对象中的信息进行实例化。并且这一步仅仅是简单的实例化，并未进行依赖注入。 
  实例化对象被包装在BeanWrapper对象中，BeanWrapper提供了设置对象属性的接口，从而避免了使用反射机制设置属性。
  
2. 设置对象属性（依赖注入）
  实例化后的对象被封装在BeanWrapper对象中，并且此时对象仍然是一个原生的状态，并没有进行依赖注入。 
  紧接着，Spring根据BeanDefinition中的信息进行依赖注入,并且通过BeanWrapper提供的设置属性的接口完成依赖注入。
  BeanWrapper对bean的实例操作很方便, 免去了直接使用Java反射API的繁琐.
  
3. 注入Aware接口
  紧接着，Spring会检测该对象是否实现了xxxAware接口，并将相关的xxxAware实例注入给bean。
  * 如果这个Bean实现了BeanNameAware接口，会调用它实现的setBeanName(String beanId)方法，此处传递的是Spring配置文件中Bean的ID
  * 如果这个Bean实现了BeanFactoryAware接口，会调用它实现的setBeanFactory()，传递的是Spring工厂本身（可以用这个方法获取到其他Bean）
  * 如果这个Bean实现了ApplicationContextAware接口，会调用setApplicationContext(ApplicationContext)方法，传入Spring上下文
  
4. BeanPostProcessor
  当经过上述几个步骤后，bean对象已经被正确构造，但如果你想要对象被使用前再进行一些自定义的处理，就可以通过BeanPostProcessor接口实现。 该接口提供了两个函数：
  * postProcessBeforeInitialzation( Object bean, String beanName ) 当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。
    这个函数会先于InitialzationBean执行，因此称为前置处理。 所有Aware接口的注入就是在这一步完成的。
  * postProcessAfterInitialzation( Object bean, String beanName ) 当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。
    这个函数会在InitialzationBean完成后执行，因此称为后置处理。
    
5. InitializingBean与init-method
  当BeanPostProcessor的前置处理完成后就会进入本阶段。 
  * InitializingBean接口只有一个函数：afterPropertiesSet()这一阶段也可以在bean正式构造完成前增加我们自定义的逻辑，但它与前置处理不同，
  由于该函数并不会把当前bean对象传进来，因此在这一步没办法处理对象本身，只能增加一些额外的逻辑。 
  若要使用它，我们需要让bean实现该接口，并把要增加的逻辑写在该函数中。然后Spring会在前置处理完成后检测当前bean是否实现了该接口，并
  执行afterPropertiesSet函数。
  * 当然，Spring为了降低对客户代码的侵入性，给bean的配置提供了init-method属性，该属性指定了在这一阶段需要执行的函数名。
  Spring便会在初始化阶段执行我们设置的函数。init-method本质上仍然使用了InitializingBean接口。
  
6. DisposableBean和destroy-method和init-method一样，通过给destroy-method指定函数，就可以在bean销毁前执行指定的逻辑。

## Spring Bean 作用域
* singleton	该作用域将 bean 的定义的限制在每一个 Spring IoC 容器中的一个单一实例(默认)。
* prototype	该作用域将单一 bean 的定义限制在任意数量的对象实例。请求方自己负责对象后继的生命周期管理工作
* request	该作用域将 bean 的定义限制为 HTTP 请求。只在 web-aware Spring ApplicationContext 的上下文中有效。
* session	该作用域将 bean 的定义限制为 HTTP 会话。 只在web-aware Spring ApplicationContext的上下文中有效。
* global-session 该作用域将 bean 的定义限制为全局 HTTP 会话。只在 web-aware Spring ApplicationContext 的上下文中有效。

## Spring IoC 容器
* BeanFactory: 基础类型IoC容器, 默认采用延迟初始化(lazy-load)
* ApplicationContext: 继承自BeanFactory, 相对高级的容器实现, 包含事件发布, 国际化信息支持等

## 值得探索的问题

* AOP的实现方法 - 动态代理
* 控制反转的实现 IoC的理解
* Spring事务处理机制
* Spring事务的传播属性

* Springmvc 中DispatcherServlet初始化过程

* 如何解决两个Bean之间的循环依赖

* 一个HTTP请求怎么被分发到方法上

* 一个查询用户信息的URL输入在浏览器地址框以后按下回车以后，经历了什么

* Tomcat reloadable实现原理（这个没答出来，后来看是直接替换了ClassLoader，当时猜得是替换classLoader里面的已加载类

 Tomcat接收用户数据的IO原理（就是NIO，我就提了一下NIO三个字，面试官就说可以了。本来还想讲讲Reactor模式和Proactor模式来着）
 
* 过滤器和拦截器的区别 
 
* spring sort for list 的应用

* spring bean的加载模式？如何实现代理
* 代理的几种模式？ gclib？

## 参考
