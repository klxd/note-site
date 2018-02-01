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


## 参考
[常见Kafka题目](http://server.it168.com/a2017/0821/3165/000003165600.shtml)