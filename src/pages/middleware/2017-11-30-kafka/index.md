---
title: Kafka基础知识
date: "2017-11-30T22:22:22.169Z"
path:  "/kafka"
tags:
   - middleware
   - kafka
---

[Kafka 官方网址](https://kafka.apache.org/)

## 基本概念

* Broker
  * Kafka 集群包含一个或多个服务器,这种服务器被称为 broker
* Topic
  * 每条发布到 Kafka 集群的消息都有一个类别,这个类别被称为 topic
* Partition
  * 物理上的概念,每个 topic 包含一个或者多个 partition
  * 每个partition都是一个**有序**的队列
  * partition中的每条消息都会被分配一个有序的ID (offset)
* Producer
  * 负责发布消息到 broker
  * 
* Consumer
  * 从 broker 读取消息的客户端
* Consumer Group
  * 每个 consumer 属于一个特定的 Consumer Group
  * 可为每个 consumer 指定一个 group name,若不指定则属于默认 group

## Kafka的技术优势
快速: 每秒处理数兆字节的读写操作
可伸缩: 可以在一组机器上对数据进行分区和简化, 以支持更大的数据
持久: 消息是持久的, 并在集群中进行复制
设计: 容错保证

## Zookeeper与Kafka的关系
Zookeeper用于Kafka的分布式应用:
* 不可能越过Zookeeper直接联系Kafka broker, 一旦Zookeeper停止工作,
就不能接受客户端请求
* Zookeeper用于在集群中不同节点之间的通信
* 在Kafka中, 它被用于移交偏移量
* Leader检测 分布式同步 配置管理 识别新节点 节点实时状态



## 多个consumer, 怎么消费一定数量的Partition

## Kafka怎么保证高效消费


## Kafka 对比 RabbitMQ

RabbitMQ,遵循AMQP协议，由内在高并发的erlanng语言开发，用在实时的对可靠性要求比较高的消息传递上。

kafka是Linkedin于2010年12月份开源的消息发布订阅系统,它主要用于处理活跃的流式数据,大数据量的数据处理上。

1. 架构模型

RabbitMQ遵循AMQP(Advanced Message Queuing Protocol)协议，RabbitMQ的broker由Exchange,Binding,queue组成，
其中exchange和binding组成了消息的路由键；客户端Producer通过连接channel和server进行通信，
Consumer从queue获取消息进行消费（长连接，queue有消息会推送到consumer端，consumer循环从输入流读取数据）。
rabbitMQ以broker为中心；有消息的确认机制。

kafka遵从一般的MQ结构，producer，broker，consumer，以consumer为中心，
消息的消费信息保存的客户端consumer上，consumer根据消费的点，从broker上批量pull数据；无消息确认机制。

2. 吞吐量

kafka具有高的吞吐量，内部采用消息的批量处理，zero-copy机制，
数据的存储和获取是本地磁盘顺序批量操作，具有O(1)的复杂度，消息处理的效率很高。

rabbitMQ在吞吐量方面稍逊于kafka，他们的出发点不一样，rabbitMQ支持对消息的可靠的传递，
**支持事务**，不支持批量的操作；基于存储的可靠性的要求存储可以采用内存或者硬盘。

3. 可用性

rabbitMQ支持mirror的queue，主queue失效，mirror queue接管。

kafka的broker支持主从模式。

4. 集群负载均衡

kafka采用zookeeper对集群中的broker、consumer进行管理，
可以注册topic到zookeeper上；通过zookeeper的协调机制，producer保存对应topic的broker信息，
可以随机或者轮询发送到broker上；并且producer可以基于语义指定分片，消息发送到broker的某分片上。

rabbitMQ的负载均衡需要单独的loadbalancer进行支持。


## 参考
[常见Kafka题目](http://server.it168.com/a2017/0821/3165/000003165600.shtml)