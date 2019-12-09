---
title: Rocket MQ学习笔记
date: "2019-09-13T22:22:22.169Z"
path:  "/kafka"
tags:
   - middleware
   - rocketmq
---

## 推模式 or 拉模式

Push方式是 Server端接收到消息后，主动把消息推送给 Client端，实时性高。
对于一个提供队列服务的 Server来说，用 Push方式主动推送有很多弊端: 
* 首先是加大 Server 端的 工作量，进而影响 Server 的性能;
* 其次，Client的 处理能力各不相同， Client 的状态不受 Server 控制，如果Client不能及时处理 Server 推送过来的消息，会造成各种潜在问题 。

Pull方式是 Client端循环地从 Server端拉取消息，主动权在 Client手里， 自己拉取到一定量消息后，处理妥当了再接着取。 
Pull 方式的问题是循环拉取 消息的间隔不好设定，间隔太短就处在一个 “忙等”的状态，浪费资源;每个
Pull 的时间间隔太长 Server 端有消息到来时 有可能没有被及时处理 。

## 推模式 - 长轮询
rocketmq推模式的底层还是拉模式（使用长轮询实现）
客户端中：
源码中有这一行设置语句 requestHeader.setSuspendTimeoutMillis (brokerSus- pendMaxTimeMillis)，
作用是设置Broker最长阻塞时间，默认设置是 15秒，注 意是 Broker在没有新消息的时候才阻塞，有消息会立刻返回 。

服务端broker中：
从 Broker 的源码中可以 看 出，服务端接到新消息 请求后， 如果队列里没有新消息，并不急于返回，通过一个循环不断查看状态，
每次 waitForRunning 一段时间 (默认是5秒)， 然后后再Check, 默认情况下当Broker一直没有新消息， 
第三次 Check的时候， 等待时间超过Request里面的 Broker­ SuspendMaxTimeMi11is， 就返回空结果 。 
在等待的过程中， Broker收到了新的消息后会直接调用notifyMessageArriving函数返回请求结果 。 
“长轮询”的核心是， Broker端HOLD 住客户端过来的请求一小段时间，在这个时间内有新消息到达，就利用现有的连接立刻返回消息给Consumer。
长轮询方式的局限性，是在HOLD住 Consumer 请求的时候需要占用资源， 它适合用在消息队列这种客户端连接数可控的场景中 。

# 流量控制
集群模式下，多个消费者如何对消息队列进行负载呢?消息队列负载机制遵循一个通用的思想: 
一个消息队列同一时间只允许被一个消费者消费，一个消费者可以消费多个消息队列 。

## 消息模式
Consumer的 GroupName用于把多个 Consumer组织到一起， 提高并发处理能力，GroupName需要和消息模式 (MessageModel)配合使用。
RocketMQ支持两种消息模式: Clustering和Broadcasting。
在 Clustering模式下，同一个 ConsumerGroup(GroupName相同) 里的每 个 Consumer 只消费所订阅消 息 的一部分 内容， 
同一个 ConsumerGroup 里所有的 Consumer消费的内容合起来才是所订阅 Topic 内容的整体， 从而达到负载均衡的目的 。

在 Broadcasting模式下，同一个 ConsumerGroup里的每个Consumer都能消费到所订阅Topic的全部消息，
也就是一个消息会被多次分发，被多个Consumer消费。


一个是DefaultMQPushConsumer，由系统控制读取操作，收到消息后自动调用传人的 处理方法来处理;
另一个是DefaultMQPullConsumer，读取操作中的大部分功能由使用者自主控制 。

根据消费消息方式的不同 ， OffsetStore 的类型也不同。 
如果是 BROADCASTING 模式，使用的是 LocalFileOffsetStore, Offset存到本地;
如果是 CLUSTERING 模式，使用的是 RemoteBrokerOffsetStore, Offset存到Broker机器上 。


## ConsumeFromWhere


## 存储文件组织与内存映射
RocketMQ通过使用内存映射文件来提高 IO访问性能，无论是 CommitLog、 ConsumeQueue还是 IndexFile，单个文件都被设计为固定长度，
如果一个文件写满以后再 创建一个新文件，文件名就为该文件第 一条消息 对应的全局物理偏移量

## TransientStorePool
暂存池TransientStorePool只在异步刷盘的模式下，并且配置了MessageStoreConfig.transientStorePoolEnable的时候才会开启。
暂存池维护了一系列的堆外内存，通过将消息写到堆外内存中来提高性能。如果启用，只会向writeBuffer写入数据。
否则只会向mappedByteBuffer写入数据，不会同时写入，看下图

对于不使用暂存池来说，维护两个位置：wrotePosition表示写入内存位置，同时这个位置是数据可读的最大位置；flushedPosition表示刷到磁盘的位置。
对于使用暂存池来说，维护三个位置：wrotePosition表示写入暂存池位置，这部分数据是不可读的；committedPosition表示提交到fileChannel的位置，
同时这个位置是数据可读的最大位置；flushedPosition表示刷到磁盘的位置。