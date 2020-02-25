---
title: Netty Node
date: "2020-01-25T22:22:22.169Z"
path:  "/netty"
tags:
   - netty
---

## Reactor模式
基于IO复用模型，多个连接共用一个阻塞对象，应用程序只需要在一个阻塞对象等待，无需阻塞所有连接。
当某个连接有新的数据可以处理时，操作系统通知应用程序，线程从阻塞状态返回，进行业务处理
别名：反应器模式，分发者模式dispatcher，通知者模式（notifier） 

* 单reactor单线程：redis， 无法发挥多核cpu，线程意外终止会导致整个通信不可用
* 单reactor多线程
* 主从reactor多线程：netty
  * mainReactor通过select监听连接时间，通过Acceptor处理accept时间
  * mainReactor将连接分配给subReactor（多个，充分利用多核cpu）
  * subReactor将连接加入连接队列进行监听（select），并创建自己的线程池进行业务处理
  
  
* Netty的IO线程NioEventLoop聚合了Selector，可以同时并发处理多个客户端连接


## netty模型
1. netty抽象出两组线程池，BossGroup专门负责接收客户端连接，WorkerGroup专门负责网络读写操作
2. NioEventLoop表示一个不断循环执行处理任务的线程，每个NioEventLoop都有一个selector，用于监听绑定在其上的socket网络通道
3. NioEventLoop内部采用串行化设计，从消息的读取->解码->处理->编码->发送，始终由IO线程NioEventLoop负责
* NioEventLoopGroup下包含多个NioEventLoop
* 每个NioEventLoop中包含一个selector，一个taskQueue
* 每个NioEventLoop的Selector上可以注册监听多个NioChannel
* 每个NioChannel只会绑定在唯一的NioEventLoop上
* 每个NioChannel都会绑定自己的ChannelPipeline

Q & A
* netty如何实现tomcat的web容器功能，netty对socket的实现
* netty和websocket原理分析，生命周期的理解，服务端如何实现
* netty中IO模型的分析，nio的Scattering和Gathering原理分析
* NIO的零拷贝如何实现，buffer和channel的应用和原理
* netty复合缓冲和其他缓冲的原理分析和使用场景，计数原子核AtomicIntegerFieldUpdater
* 如何利用netty实现一个高性能的弹幕系统
* netty初始化流程总结及Channel和ChannelHandlerContext，channel注册原理，channel选择器工厂和轮询算法
* netty线程模型解析，netty自定义协议和TCP粘包拆包问题如何解决