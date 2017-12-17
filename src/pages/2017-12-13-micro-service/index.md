---
title: 什么是Micro-service
date: "2017-12-13T22:22:22.169Z"
path:  "/micro-service"
tags:
   - architecture
---

### Micro-service起源
2014年,James和Martin合作发表了一篇名为[Microservices](https://martinfowler.com/articles/microservices.html)
的文章,详细探讨了当时正流行起来的一种服务架构模式--microservice,并出以下定义:
>In short, the microservice architectural style [1] is an approach to
 developing a single application as a suite of small services, 
 each running in its own process and communicating with lightweight 
 mechanisms, often an HTTP resource API 
 
经过这几年的发展,微服务已经称为架构模式中最火热的名词之一,很多公司已经在实践了

### 整体式架构(Monolithic Architecture)
传统的Web应用通常分为以下三个部分:
1. 客户端界面: 包含HTML页面和在用户的浏览器运行的JavaScript
2. 服务器: 用于接受客户端请求,执行业务逻辑,与数据库交互,返回合适的HTML到客户端
3. 数据库: 用于持久化数据,通常是关系型数据库

在整体式架构中,服务器部分是一个整体,有以下特点:
1. 一个请求的所有工作都在服务器的单一进程中执行
2. 业务的划分主要通过语言内部的支持:包(package),类(class),方法(function)
3. 只能水平扩展:运行多个服务器,用load-balancer分发请求

整体式架构适合于小型系统,但是当用户数量上升和业务逻辑复杂化了之后,它的缺点也比较明显:
1. 难以部署,任何一个小改动都需要重新部署所有服务器
2. 难以合作开发,没有模块化的概念,任何改动都容易影响到其他逻辑
3. 难以扩展

![](sketch.png)

### 面向服务架构(Service-Oriented Architecture, SOA)
微服务刚兴起的时候,许多人都觉得这只是SOA的另一个名字.SOA概念的形成时间要比Microservices早十年左右,
Martin(还是那个人)在2005年发表过一篇[文章](https://martinfowler.com/bliki/ServiceOrientedAmbiguity.html)
对其进行阐述.
支撑SOA的关键是其消息传输架构--企业服务总线(ESB,Enterprise Service Bus)
> ESB是传统中间件技术与XML、Web服务等技术相互结合的产物，用于实现企业应用不同消息和信息的准确
  、高效和安全传递.同时它还可以消除不同应用之间的技术差异，让不同的应用服务器协调运作，
  实现了不同服务之间的通信与整合

ESB的基本功能
1. 服务的MetaData管理:在总线范畴内对服务的注册命名及寻址进行管理
2. 传输服务:确保通过企业总线互连的业务流程间的消息的正确交付,还包括基于内容的路由功能
3. 中介:提供位置透明的路由和定位服务,提供多种消息传递形式,支持广泛使用的传输协议
4. 多服务集成方式: 如JCA,Web服务,Messaging,Adapter等
5. 服务和事件管理支持:调用服务的记录、测量和监控数据;提供事件检测、触发和分布功能

### 微服务架构(Microservices)

优点:
1. 通过分解单体应用为多个服务,解决了复杂度的问题
2. 每个微服务可由专门的团队来开发,相对独立和自由
3. 每个微服务

参考资料
1. [基于微服务的软件架构模式](http://www.jianshu.com/p/546ef242b6a3)
2. [ESB和SOA到底是什么](https://zato.io/docs/intro/esb-soa-cn.html#id1)
3. [服务发现的可行方案以及实践案例](http://blog.daocloud.io/microservices-4/)