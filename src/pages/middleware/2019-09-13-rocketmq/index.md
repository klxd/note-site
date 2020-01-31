---
title: Rocket MQ学习笔记
date: "2019-09-13T22:22:22.169Z"
path:  "/rocketmq-note"
tags:
   - middleware
   - rocketmq
---

## 书籍
RocketMQ技术内幕： 详细源码讲解，原理剖析
RocketMQ实战与原理解析：简单样例代码，精炼原理解析

## Broker

### 配置文件
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

### 高可用机制
在 Consumer 的配置文件中，并不需要设置是从 Master读还是从 Slave 读，当 Master 不可用或者繁忙的时候， 
Consumer会被自动切换到从Slave读。有了自动切换Consumer这种机制，当一个 Master 角色的机器出现故障后， 
Consumer仍然可以从Slave读取消息，不影响Consumer程序。这就达到了消费端的高可用性 。

如何达到发送端的高可用性呢?在创建 Topic 的时候，把 Topic 的多个 Message Queue创建在多个Broker组上(相同 Broker名称，
不同 brokerId 的 机器组成 一 个 Broker 组)，这样当 一 个 Broker 组的 Master 不可用后，其他组 的 Master 仍然可用，
Producer 仍然可以发送消息 。 RocketMQ 目前还不支持把 Slave 自动转成 Master，如果机器资源不足，需要把 Slave 转成 Master，
则要手 动停止 Slave角色的 Broker，更改配置文件，用新的配置文件启动 Broker。

### “零拷贝”技术 MappedByteBuffer
Linux 操作系统分为“用户态”和“内核态”，文件操作、网络操作需要涉及这两种形态的切换，免不了进行数据复制，一台服务器把本机磁 盘文件的内容发送到客户端 一般分为两个步骤:
1. read(file, tmp buf, len);，读取本地文件内容;
2. write(socket, tmp_buf, len); 将读取的内容通过网络发送出去。
tmp_buf是预先申请的内存，这两个看似简单的操作，实际进行了 4次数据复制，分别是:
从磁盘复制数据到内核态内存，从内核态内存复制到用户 态内存(完成了 read(file, tmp_buf, len));
然后从用户态内存复制到网络驱动的内核态内存，最后是从网络驱动的内核态内存复制到网卡中进行传输(完成 write(socket, tmp_buf, len))。

通过使用 mmap 的方式，可以省去向用户态的内存复制，提高速度 。 
这种机制在 Java 中是通过 MappedByteBuffer 实现的
RocketMQ充分利用了上述特性，也就是所谓的“零拷贝”技术，提高消息存盘和网络发送的速度 。

### 同步刷盘和异步刷盘
* 异步刷盘方式:在返回写成功状态时 ，消息可 能只是被写人了内存的 PAGECACHE ，
  写操作的返回快，吞吐 量大 ;当内存里的消息 量 积累到 一定程度时 ，统一触发 写磁盘动 作，快速 写人 。
* 同步刷盘方式:在返回写成功状态时，消息已经被写人磁盘 。 具体流程 是，消息、写入内存的 PAGECACHE 后，立刻通知刷盘线程刷盘，
  然后 等待刷盘完成，刷盘线程执行完成后唤醒等待的线程，返回消息写成功 的状态 

### 同步复制和异步复制
如果一个 Broker组有 Master和Slave, 消息需要从 Master复制到 Slave上，有同步和异步两种复制方式 。 
同步复制方式是等 Master和Slave均写成功 后才反馈给客户端写成功状态; 异步复制方式是只要Master写成功即可反馈给客户端写成功状态 。

这两种复制方式各有优劣，在异步复制方式下，系统拥有较低的延迟和较 高的吞吐量，但是如果 Master 出了故障，有些数据因为没有被写人 Slave，有可能会丢失;
在同步复制方式下，如果 Master 出故障， Slave 上有全部的备份数据，容易恢复，但是同步复制会增大数据写人延迟，降低系统吞吐量 。

同步复制和异步复制是通过 Broker 配置文件里的 brokerRole 参数进行设置 的，这个参数可以被设置成 ASYNC MASTER、 SYNC MASTER、 SLAVE 三 个值中的一个 。
实际应用中要结合业务场景，合理设置刷盘方式和主从复制方式，尤其是SYNC FLUSH 方式，由于频 繁 地触发磁盘 写动 作， 会明显 降低性能 。
通常情 况下，应该把 Master和 Save配置成 ASYNC FLUSH 的刷盘方式，主从之间配 置成 SYNC MASTER 的 复制方式，
这 样即使有 一台机器出故障， 仍然能保证 数据不丢，是个不错的选择 。

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


### 动态增减Broker
只增加Broker不会对原有的Topic产生影响，原来创建好的Topic中数据的读写依然在原来的那些 Broker上进行。
集群扩容后， 一是可以把新建的Topic 指定到新的 Broker 机器上，均衡利 用资源;另一种方式是通过updateTopic命令更改现有的Topic配置，在新加的Broker上创建新的队列 。

如果因为业务变动或者置换机器需要减少 Broker，此时该如 何操作呢 ? 减少 Broker要看是否有持续运行的 Producer，
当一个 Topic 只有一个 Master Broker，停掉这个 Broker后，消息的发送肯定会受到影响，需要在停止这个 Broker 前，停止发送消息 。

### Broker端进行消息过滤
1. 基于 Tag 进行过滤，并不需要读取消息体 的内容，所以效率很高，创建 Message 的时候添加的， 一个 Message 只能有一个 Tag。
   ConsumerQueue 的存储格式： CommitLog Offset(8 byte), Size(4 byte), Message Tag Hashcode（8 byte）
2. 用 SQL 表达式的方式进行过滤，在构造 Message的时候，还可以通过 putUserProperty 函数来增加多个自定义的**属性**（不是消息体），
   在构造Consumer时用类似SQL表达式的方式对消息进行过滤（SQL发送到broker），(目前只 支 持在 PushConsumer 中实现这种过滤)。
   SQL表达式方式的过滤需要Broker先读出消息里的属性内容， 然后做SQL计算，增大磁盘压力，没有 Tag方式高效
3. Filter Server方式过滤， 用户自定义Java 函数，根据Java函数的逻辑对消息进行过滤。
   要使用 Filter Server， 首先要在启动 Broker前在配置文件里加上 filterServer­ Nums= 3 这样的配置， Broker在启动的时候， 就会在本机启动3个Filter Server进程。
   Filter Server类 似 一 个 RocketMQ 的 Consumer 进程，它从 本 机 Broker 获取消息，然后根据用户上传过来的 Java 函数进行过滤，
   过滤后的消息 再传给远端的 Consumer。 这种方式会占用很多 Broker机器的 CPU 资源，要根 据实际情况谨慎使用 。 
   上传的 java代码（构造Consumer时用string序列化类传入）也要经过检查 ，不能有申请大内存、创建线程等这样的操作，否则容易造成 Broker服务器右机。 

当某个Topic有多个 Master Broker，停了其中一个，这时候是否会丢 失消息呢?答案和Producer使用的发送消息的方式有关，如果使用同步方式send(msg)发送，
在DefaultMQProducer内部有个自动重试逻辑，其中一个Broker停了，会自动向另一个 Broker发消息，不会发生丢消息现象。 
如果使用异步方式发送`send(msg, callback)`，或者用`sendOneWay`方式，会丢失切换过程中的消息。
因为在异步和sendOneWay这两种发送方式下， Producer.setRetryTimesWhenSendFailed设置不起作用，发送失败不会重试。 
DefaultMQProducer默认每30秒到 NameServer 请求最新的路由消息，Producer如果获取不到已停止的Broker下的队列信息，后续就自动不再向这些队列发送消息。




## NameServer
NameServer是整个消息队列中的状态服务器，集群的各个组件通过它来了解全局的信息。
各个角色的机器都要定期向NameServer上报自己的状态，超时不上报的话，NameServer会认为某个机器出故障不可用了，其他的组件会把这个机器从可用列表里移除。
NameServer本身是无状态的，也就是说NameServer中的Broker、Topic等状态信息不会持久存储，都是由各个角色定时上报并存储到内存中的
(NameServer支持配置参数的持久化，一般用不到)

在`org.apache.rocketmq.namesrv.routeinfo`的RouteInfoManager类中，有五个变量 ，集群的状态就保存在这五个变量中 。
* `private final HashMap<String/* topic */， List<QueueData>> topicQueueTable` topicQueueTable 
   这个结构的Key是Topic的名称，它存储了所有Topic的属性信息 。Value 是个QueueData队列，队里的长度等于这个Topic数据存储的MasterBroker的个数，
   QueueData里存储着Broker的名称、 读写queue的数量、 同步标识等。
* `private final HashMap<String/* BrokerName */， BrokerData> brokerAddrTable`
  以BrokerName为索引，相同名称的Broker可能存在多台机器，一个Master和多个Slave。 
  这个结构存储着一个 BrokerName 对应的属性信 息，包括所属的 Cluster 名称， 一个Master Broker和多个Slave Broker的地址信息。
* `private final HashMap<String/* ClusterName */， Set<String/* BrokerName */>> clusterAddrTable`
  存储的是集群中Cluster的信息，结果很简单，就是一个Cluster名称对应一个由 BrokerName组成的集合。
* `private final HashMap<String/* BrokerAddr */， BrokerLiveInfo> brokerLiveTable`
  这个结构和BrokerAddrTable有关系，但是内容完全不同，这个结构的Key是BrokerAddr，也就是对应着一台 机器， 
  BrokerAddrTable 中的 Key 是BrokerName， 多个机器的BrokerName可以相同。 BrokerLiveTable 存储的内容是这台 Broker机器的实时状态，
  包括上次更新状态的时间 戳， NameServer会定期检查这个时间戳，超时没有更新就认为这个 Broker无效了，将其从 Broker列表里清除。
* `private final HashMap<String/* BrokerAddr */ ， List<String>/* FilterServer */> filterServerTable`
  FilterServer是过滤服务器，是RocketMQ的一种服务端过滤方式，一个Broker可以有一个或多个Filter Server。 
  这个结构的Key是 Broker 的地址， Value是和这个 Broker关联的多个Filter Server 的地址。
  
### 路由删除
根据上面章节的介绍， Broker 每隔 **30s** 向 NameServer 发送一个心跳包，心跳包中包含 BrokerId、Broker地址、Broker名称、 Broker所属集群名称、
Broker关联的 FilterServer列表。 但是如果 Broker若机 ， NameServer无法收到心跳包，此时 NameServer如何来剔除这些失 效的 Broker 呢? 
Name Server会每隔**10s**扫描 brokerLiveTable状态表，如果 BrokerLive 的 lastUpdateTimestamp 的时间戳距当前时间超过 **120s**，
则认为 Broker失效，移除该 Broker, 关闭与Broker连接，并同时更新topicQueueTable、 brokerAddrTable、brokerLiveTable、 filterServerTable。
RocktMQ有两个触发点来触发路由删除 。
    1) NameServer定时扫描 brokerLiveTable检测上次心跳包与 当前系统时间的时间差， 如果时间戳大于 120s，则需要移除该 Broker 信息 。
    2 ) Broker在正常被关闭的情况下，会执行 unr巳gisterBroker指令。
  
### 为何不用 ZooKeeper
ZooKeeper 是 Apache 的 一 个开源软件，为分布式应用程序提供协调服务 。
那为什么 RocketMQ 要自己造轮子，开发 集 群的管理程序呢?答案是 ZooKeeper 的功能很强大，包括自动 Master 选举等， 
RocketMQ 的架构设计决 定了它**不需要进行 Master选举**(master都是通过配置文件制定，挂了需要用slave代替时需要手动改配置重启)，
用不到这些复杂的功能，只需要一个轻量级的 元数据服务器就足够了。
中间件对稳定性要求很高，RocketMQ的NameServer 只有很少的代码，容易维护，所以不需要再依赖另一个中间件，从而减少整体维护成本 。

从实际需求出发，因为Topic路由信息无须在集群之间保持强一致，追求最终一致性，并且能容忍分钟级的不一致。 正是基于此种情况,
RocketMQ的NameServer集群之间互不通信，极大地降低了NameServer实现的复杂程度，对网络的要求也降低了不少，但是性能相比较Zookeeper有了极大的提升 。


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
RocketMq推模式的底层还是拉模式（使用长轮询实现）
客户端中：
源码中有这一行设置语句 requestHeader.setSuspendTimeoutMillis (brokerSuspendMaxTimeMillis)，
作用是设置Broker最长阻塞时间，默认设置是 15秒，注 意是 Broker在没有新消息的时候才阻塞，有消息会立刻返回 。

服务端broker中：
从 Broker 的源码中可以看出，服务端接到新消息请求后， 如果队列里没有新消息，并不急于返回，通过一个循环不断查看状态，
每次 waitForRunning 一段时间 (默认是5秒)， 然后后再Check, 默认情况下当Broker一直没有新消息， 
第三次 Check的时候， 等待时间超过Request里面的 BrokerSuspendMaxTimeMi11is， 就返回空结果 。 
在等待的过程中， Broker收到了新的消息后会直接调用notifyMessageArriving函数返回请求结果 。 
“长轮询”的核心是， Broker端HOLD 住客户端过来的请求一小段时间，在这个时间内有新消息到达，就利用现有的连接立刻返回消息给Consumer。
长轮询方式的局限性，是在HOLD住 Consumer 请求的时候需要占用资源， 它适合用在消息队列这种客户端连接数可控的场景中 。

## 消息模式
Consumer的 GroupName用于把多个 Consumer组织到一起， 提高并发处理能力，GroupName需要和消息模式 (MessageModel)配合使用。
RocketMQ支持两种消息模式: Clustering和Broadcasting。
在 Clustering模式下，同一个 ConsumerGroup(GroupName相同) 里的每 个 Consumer 只消费所订阅消 息 的一部分 内容， 
同一个 ConsumerGroup 里所有的 Consumer消费的内容合起来才是所订阅 Topic 内容的整体，从而达到负载均衡的目的 。

在Broadcasting模式下，同一个ConsumerGroup里的每个Consumer都能消费到所订阅Topic的全部消息，
也就是一个消息会被多次分发，被多个Consumer消费。

一个是DefaultMQPushConsumer，由系统控制读取操作，收到消息后自动调用传人的 处理方法来处理;
另一个是DefaultMQPullConsumer，读取操作中的大部分功能由使用者自主控制 。

根据消费消息方式的不同 ， OffsetStore 的类型也不同。 
如果是 BROADCASTING 模式，使用的是 LocalFileOffsetStore, Offset存到本地;
如果是 CLUSTERING 模式，使用的是 RemoteBrokerOffsetStore, Offset存到Broker机器上 。


### 提高Consumer消费能力
1. 提高消费并行度，在同一个 ConsumerGroup 下( Clustering 方式)，可以通过增加 Consumer 实例的数量来提高并行度，
   通过加机器，或者在已有机器中启动 多个 Consumer 进程都可以增加 Consumer实例数。
   注意总的 Consumer数量不要超过 Topic下 Read Queue 数量，超过的 Consumer 实例接收不到消息 。 
   此外，通过提高单个 Consumer 实例中的并行处理的线程数可以在同一个 Consumer 内增加并行度来提高吞吐量
   (设置方法是修改 consumeThreadMin 和 consumeThreadMax)。
2. 以批量方式进行消费， 多条消息同时处理的时间会大大小于逐个处理的时间总和，比如消费消 息中涉及 update 某个数据库， 
   一次 update10条的时间会大大小 于十次update一条数据的时间。这时可以通过批量方式消费来提高消费的吞吐 量 。 
   实现方法是设置 Consumer 的 consumeMessageBatchMaxSize 这个参数 ，默认是 1，如果设置为N，在消息多的时候每次收到的是个长度为N的消息链表。
3. 检测延时情况，跳过非重要消息。Consumer 在消费的过程中， 如果发现由于某种原因发生严重的消息堆积，短时间无法消除堆积，
   这个时候可以选择丢弃不重要的消息，使Consumer尽快追上Producer的进度

### Consumer 的负载均衡 & 流量控制
集群模式下，多个消费者如何对消息队列进行负载呢?消息队列负载机制遵循一个通用的思想: 
一个消息队列同一时间只允许被一个消费者消费，一个消费者可以消费多个消息队列 。

* DefaultMQPushConsumer 的负载均衡过程不需要使用者操心，客户端程 序会自动处理，每个DefaultMQPushConsumer启动后，
  会马上会触发一个 doRebalance 动作;而且在同一个 ConsumerGroup 里加入新的 DefaultMQPush­ Consumer时，各个Consumer都会被触发 doRebalance动作。
  负载均衡算法有五种，默认用的是第一种AllocateMessageQueueAveragely。 
  以 AllocateMessageQueueAveragely策略为例，如果创建 Topic 的时候，把 Message Queue数设为 3， 
  当 Consumer数量为 2 的时候，有一个 Consumer需 要处理 Topic三分之二的消息，另一个处理三分之一的消息;当 Consumer数 量为 4 的时候，
  有 一个 Consumer 无 法收到消息，其他 3 个 Consumer 各处理 Topic三分之一的消息。可见 Message Queue数量设置过小不利于做负载均衡， 
  通常情况下，应把一个 Topic 的 Message Queue 数设置为 16。
* DefaultMQPullConsumer 的负载均衡， DefaultMQPullConsumer 有两个辅助方法可以帮助实现负载均衡，一个是 registerMessageQueueListener 函数，
  该函数在有新的Consumer加入或退出时被触 发。 另一个辅助工具是 MQPullConsumerScheduleService类，使用这个 Class 类 似使用 DefaultM Q PushConsumer，
  但是它把 Pull 消息的 主动 性留给了使用 者
 
### 死信队列
一般消费者消费失败需要返回`ConsumeConcurrentlyStatus.RECONSUME_LATER`；
RocketMQ的ACK机制，其中涉及到了消息消费重试，当重试次数达到默认的16次后（可以通过配置文件修改）如果对应的消息还没被成功消费的话，该消息就会投递到DLQ死信队列。 


## 生产者
### 消息发送
消息发送的返回状态有如下四种,不同状态在不同的刷盘策略和同步策略的配置下含义是不同的
* FLUSH DISK TIMEOUT : 表示没有在规定时间内完成刷盘(需要 Broker 的刷盘策 Il创立设置成 SYNC FLUSH 才会报这个错误) 。
* FLUSH SLAVE TIMEOUT : 表示在主备方式下，并且Broker被设置成SYNC MASTER 方式，没有在设定时间内完成 主从同步 。
* SLAVE NOT AVAILABLE : 这个状态 产生的场景和 FLUSH SLAVE TIMEOUT 类似， 
  表示在主备方式下，并且Broker被设置成 SYNC MASTER，但是没有找到被配置成 Slave 的 Broker。
* SEND OK: 表示发送成功，发送成功的具体含义，比如消息是否已经被存储到融盘?消息是否被同步到了 Slave上?消息在 Slave上是否被写人磁盘?
  需要结合所配置的刷盘策略、主从策略来定 。 这个状态还可 以简单理解为，没有发生上面列出的 三个问题状态就是 SEND OK。

### 消息发送异常机制
消息发送高可用主要通过两个手段 : 重试与 Broker规避。 Brok巳r规避就是在一次消息 发送过程中发现错误，
在某一时间段内，消息生产者不会选择该 Broker(消息服务器)上的 消息队列，提高发送消息的成功率 。

### 批量消息发送
RocketMQ 支持将同一主题下的多条消息一次性发送到消息服务端。
单批次消息发送总长度不能超过 Default MQProducer#maxMessageSize。

### 消息长度验证
消息体不能为空 、 消息长度不能等于 0且默认不能超过允许 发送消息的最大长度 4M (maxMessageSize=l024 *1024 *4)。

## 延时消息
RocketMQ 支持发送延迟消息， Broker收到这类消息后 ，延迟一段时间再处理， 使消息在规定的一段时间后生效。
延迟消息的使用方法是在创建 Message对象时，调用 setDelayTimeLevel ( int level) 方法设置延迟时间， 然后再把这个消息发送出去。 
目前延迟的时间不支持任意设置，仅支持预设值的时间长度 ( 1s/5s/1Os/30s/Im/2m/3m/4m/5m/6m/7m/8m/9m/1Om/20m/30m/1h/2h)。 
比如setDelayTimeLevel(3)表示延迟10s。

## 顺序消息
局部有序消息
消息发送默认根据主题的路由信息(主题消息队列)进行负载均衡，负载均衡机制为**轮询策略**。 例如现在有这样一个场景，
订单的状态变更消息发送到特定主题，为了避免消息消费者同时消费同一订单的不同状态的变更消息，我们应该使用顺序消息 。 
为了提高消息消费的并发度，如果我们能根据某种负载算法，相同订单的不同消息能统一发到同一个消息消费队列上，则可以避免引入分布式锁， 
RocketMQ 在消息发送时提供了**消息队列选择器** MessageQueueSelector。
```java
class Clazz {
SendResult sendResult = producer.send(msg, new MessageQueueSelector() {
    public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
        // 从传入的多个消息队列中选择一个进行发送，此样例中使用orderId取模来选择
        Integer id = (Integer) arg;
        int index = id % mqs.size(); 
        return mqs.get(index);
    }
}, orderId);
}
```


## 事务消息
RocketMQ 事务消息基 于两阶段提交和事务状态回查机制来实现，所谓的两阶段提交，即首先发送 prepare 消息， 
待事务提交或回滚时发送 commit, rollback命令。 再结合定时任务， RocketMQ使用专门的线程以特定的频率对RocketMQ服务器上的prepare信息进行处理， 
向发送端查询事务消息 的状态来决定是否提交或回滚消息 。