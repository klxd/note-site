---
title: Rocket MQ学习笔记
date: "2019-09-13T22:22:22.169Z"
path:  "/kafka"
tags:
   - middleware
   - rocketmq
---



## 配置文件
broker服务器配置：
* namesrvAddr: NameServer的IP地址，一般是多个
* brokerClusterName: 集群名称
* brokerName: broker的名称，Master和Slave通过此字段相同来表明关系
* brokerid: 一个 Master Barker可以有多个Slave, 0表示 Master，大于 0表示不同 Slave 的 ID。
* fileReservedTime=48: 在磁盘上保存消息的时长，单位是小时，自动删除超时的消息
* deleteWhen=04: 与fileReservedTim巳参数呼应，表明在几点做消息删除动作，默认值04表示凌晨4点
* brokerRole: brokerRole有3种: SYNC MASTER、 ASYNC MASTER、 SLAVE
  关键词 SYNC和ASYNC表示 Master 和 Slave 之间同步消息的机制， SYNC的意思是当Slave和Master消息同步完成后，再返回发送成功的状态
* flushDiskType=ASYNC FLUSH: flushDiskType表示刷盘策略，分为SYNC_FLUSH和ASYNC_FLUSH两种，
  分别代表同步刷盘和异步刷盘。 同步刷盘情况下，消息真正写人磁盘后再返回成功状态;异步刷盘情况下，消息写入page_cache后就返回成功状态
* listenPort=l0911: Broker监听的端口号，如果一台机器上启动了多个 Broker， 则要设置不同的端口号，避免冲突
* storePathRootDir=/home/rocketmq/store-a : 存储消息以及一些配置信息的根目录

这些配置参数，在Broker启动的时候生效，如果启动后有更改，要重启Broker。

## NameServer
NameServer是整个消息队列中的状态服务器，集群的各个组件通过它来了解全局的信息。
各个角色的机器都要定期向NameServer上报自己的状态，超时不上报的话，NameServer会认为某个机器出故障不可用了，其他的组件会把这个机器从可用列表里移除。
NameServer本身是无状态的，也就是说NameServer中的Broker、Topic等状态信息不会持久存储，都是由各个角色定时上报并存储到内存中的
(NameServer支持配置参数的持久化， 一般用不到)

在`org.apache.rocketmq.namesrv.routeinfo`的RouteInfoManager类中，有五个变量 ，集群的状态就保存在这五个变量中 。
* `private final HashMap<String/* topic */， List<QueueData>> topicQueueTable topicQueueTable` 
   这个结构的Key是Topic的名称，它存储了所有Topic的属性信息 。Value 是个QueueData队列 ， 队里的长度 等于这个Topic 数据存储的 MasterBroker的个数，
   QueueData里存储着 Broker的名称、 读写queue的数量、 同步标识等。
* `private final HashMap<String/* BrokerName */， BrokerData>BrokerAddrTable`
  以BrokerName为索引，相同名称的Broker可能存在多台机器，一个Master和多个Slave。 
  这个结构存储着一个 BrokerName 对应的属性信 息，包括所属的 Cluster 名称， 一 个 Master Broker 和多个 Slave Broker 的地址信息 。
* `private final HashMap<String/* ClusterName */， Set<String/* BrokerName */>> ClusterAddrTable`
  存储的是集群中Cluster的信息，结果很简单，就是一个Cluster名称对应一个由 BrokerName组成的集合。
* `private final HashMap<String/* BrokerAddr */， BrokerLiveInfo> BrokerLiveTable`
  这个结构和BrokerAddrTable有关系，但是内容完全不同，这个结构的Key是BrokerAddr，也就是对应着一台 机器， 
  BrokerAddrTable 中的 Key 是BrokerName， 多个机器的BrokerName可以相同。 BrokerLiveTable 存储的内容是这台 Broker机器的实时状态，
  包括上次更新状态的时间 戳， NameServer会定期检查这个时间戳，超时没有更新就认为这个 Broker无效了，将其从 Broker列表里清除。
* `private fina l HashMap<String/* BrokerAddr */ ， List<String>/* Fi lter Server */> filterServerTable`
  Filter Server是过滤服务器，是RocketMQ 的一种服务端过滤方式，一个Broker 可以有一个或多个Filter Server。 
  这个结构的 Key 是 Broker 的地址， Value是和这个 Broker关联的多个Filter Server 的地址。


## 消费者

### 推模式 or 拉模式

Push方式是 Server端接收到消息后，主动把消息推送给 Client端，实时性高。
对于一个提供队列服务的 Server来说，用 Push方式主动推送有很多弊端: 
* 首先是加大 Server 端的 工作量，进而影响 Server 的性能;
* 其次，Client的 处理能力各不相同， Client 的状态不受 Server 控制，如果Client不能及时处理 Server 推送过来的消息，会造成各种潜在问题 。

Pull方式是 Client端循环地从 Server端拉取消息，主动权在 Client手里， 自己拉取到一定量消息后，处理妥当了再接着取。 
Pull 方式的问题是循环拉取 消息的间隔不好设定，间隔太短就处在一个 “忙等”的状态，浪费资源;每个
Pull 的时间间隔太长 Server 端有消息到来时 有可能没有被及时处理 。

### 推模式 - 长轮询
rocketmq推模式的底层还是拉模式（使用长轮询实现）
客户端中：
源码中有这一行设置语句 requestHeader.setSuspendTimeoutMillis (brokerSus- pendMaxTimeMillis)，
作用是设置Broker最长阻塞时间，默认设置是 15秒，注 意是 Broker在没有新消息的时候才阻塞，有消息会立刻返回 。

服务端broker中：
从 Broker 的源码中可以看出，服务端接到新消息请求后， 如果队列里没有新消息，并不急于返回，通过一个循环不断查看状态，
每次 waitForRunning 一段时间 (默认是5秒)， 然后后再Check, 默认情况下当Broker一直没有新消息， 
第三次 Check的时候， 等待时间超过Request里面的 BrokerSuspendMaxTimeMi11is， 就返回空结果 。 
在等待的过程中， Broker收到了新的消息后会直接调用notifyMessageArriving函数返回请求结果 。 
“长轮询”的核心是， Broker端HOLD 住客户端过来的请求一小段时间，在这个时间内有新消息到达，就利用现有的连接立刻返回消息给Consumer。
长轮询方式的局限性，是在HOLD住 Consumer 请求的时候需要占用资源， 它适合用在消息队列这种客户端连接数可控的场景中 。

### 流量控制
todo DefaultMQPushConsumer 的流量控制
集群模式下，多个消费者如何对消息队列进行负载呢?消息队列负载机制遵循一个通用的思想: 
一个消息队列同一时间只允许被一个消费者消费，一个消费者可以消费多个消息队列 。

## 生产者
### 消息发送
消息发送的返回状态有如下四种,不同状态在不同的刷盘策略和同步策略的配置下含义是不同的
* FLUSH DISK TIMEOUT : 表示没有在规定时间内完成刷盘(需要 Broker 的刷盘策 Il创立设置成 SYNC FLUSH 才会报这个错误) 。
* FLUSH SLAVE TIMEOUT : 表示在主备方式下，并且Broker被设置成SYNC MASTER 方式，没有在设定时间内完成 主从同步 。
* SLAVE NOT AVAILABLE : 这个状态 产生的场景和 FLUSH SLAVE TIMEOUT 类似， 
  表示在主备方式下，并且Broker被设置成 SYNC MASTER，但是没有找到被配置成 Slave 的 Broker。
* SEND OK: 表示发送成功，发送成功的具体含义，比如消息是否已经被存储到融盘?消息是否被同步到了 Slave上?消息在 Slave上是否被写人磁盘?
  需要结合所配置的刷盘策略、主从策略来定 。 这个状态还可 以简单理解为，没有发生上面列出的 三个问题状态就是 SEND OK。

## 延时消息
RocketMQ 支持发送延迟消息， Broker收到这类消息后 ，延迟一段时间再处理， 使消息在规定的一段时间后生效。
延迟消息的使用方法是在创建 Message对象时，调用 setDelayTimeLevel ( int level) 方法设置延迟时间， 然后再把这个消息发送出去。 
目前延迟的时间不支持任意设置，仅支持预设值的时间长度 ( 1s/5s/1Os/30s/Im/2m/3m/4m/5m/6m/7m/8m/9m/1Om/20m/30m/1h/2h)。 
比如setDelayTimeLevel(3)表示延迟10s。

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