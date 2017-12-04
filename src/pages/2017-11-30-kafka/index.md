---
title: Kafka基础
date: "2017-11-29T22:22:22.169Z"
path:  "/kafka"
tags:
   - middleware
   - kafka
---


[Kafka官方网址](https://kafka.apache.org/)

## 基本概念
- Broker
   - Kafka集群包含一个或多个服务器,这种服务器被称为broker
- Topic
   - 每条发布到Kafka集群的消息都有一个类别,这个类别被称为topic
- Partition
   - 物理上的概念,每个topic包含一个或者多个partition
- Producer
   - 负责发布消息到broker
- Consumer
   - 从broker读取消息的客户端
- Consumer Group
   - 每个consumer属于一个特定的Consumer Group
   - 可为每个consumer指定一个group name,若不指定则属于默认group
