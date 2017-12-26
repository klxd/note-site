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
* Producer
  * 负责发布消息到 broker
* Consumer
  * 从 broker 读取消息的客户端
* Consumer Group
  * 每个 consumer 属于一个特定的 Consumer Group
  * 可为每个 consumer 指定一个 group name,若不指定则属于默认 group
