---
title: 分布式架构
date: "2019-12-22T22:40:32.169Z"
path: "/distributed-architecture"
tags:
    - middleware
---

## Q & A

* 分布式集群下如何做到唯一序列号
* 设计一个秒杀系统，30分钟没付款就自动关闭交易
* 如何使用redis和zookeeper实现分布式锁
* redlock，算法实现，争议点
* 分布式事务的原理，优缺点，如何使用分布式事务，2pc 3pc 的区别
* 一致性hash
* 设计建立和保持100w的长连接
* 解释什么是MESI协议(缓存一致性)
* paxos算法， 什么是zab协议
* 实现分布式环境下的countDownLatch

* 限流策略，令牌桶和漏斗算法的使用场景
* 分布式服务调用方，不依赖服务提供方的话，怎么处理服务方挂掉后，大量无效资源请求
  的浪费，如果只是服务提供方吞吐不高的时候该怎么做，如果服务挂了，那么一会重启，该怎
  么做到最小的资源浪费，流量半开的实现机制是什么