---
title: Zookeeper客户端Curator
date: "2019-11-11T22:22:22.169Z"
path:  "/zookeeper-curator-note"
tags:
   - middleware
---


## 简介
Curator是Netflix公司开源的一套zookeeper客户端框架，解决了很多Zookeeper客户端非常底层的细节开发工作，包括连接重连、反复注册Watcher和NodeExistsException异常等等。Patrixck Hunt（Zookeeper）以一句“Guava is to Java that Curator to Zookeeper”给Curator予高度评价。

## zookeeper分布式锁中利用到的特性
1. 有序节点：假如当前有一个父节点为/lock，我们可以在这个父节点下面创建子节点；zookeeper提供了一个可选的有序特性，例如我们可以创建子节点“/lock/node-”并且指明有序，那么zookeeper在生成子节点时会根据当前的子节点数量自动添加整数序号，也就是说如果是第一个创建的子节点，那么生成的子节点为/lock/node-0000000000，下一个节点则为/lock/node-0000000001，依次类推。
2. 临时节点：客户端可以建立一个临时节点，在会话结束或者会话超时后，zookeeper会自动删除该节点。
3. 事件监听：在读取数据时，我们可以同时对节点设置事件监听，当节点数据或结构变化时，zookeeper会通知客户端。当前zookeeper有如下四种事件：1）节点创建；2）节点删除；3）节点数据修改；4）子节点变更。

## 排它锁 (Exclusive Lock, X锁,独占锁)

### 简单实现 (分布式一致性原理与实践6.1.7)

1. 定义锁, 使用zk上的数据节点来表示一个锁, 如/exclusive_lock
2. 获取锁, 客户端尝试在/exclusive_lock节点下创建**临时**子节点/exclusive_lock/lock,
  * 若创建成功, 则成功拿到锁 (zk会保证只有一个客户端能成功)
  * 若创建失败, 则需要使用watcher监听/lock节点的变更情况, 然后再次尝试获取锁
3. 释放锁,由于/exclusive_lock/lock是一个临时节点, 所以有两种情况可能释放锁
  * 客户端机器宕机或异常, zk在链接超时后自动删除节点
  * 正常执行完业务逻辑后, 客户端主动删除节点

缺点: 羊群效应, 非公平?

 
## 共享锁 (Shared Lock, S锁)

### 简单实现

1. 定义锁, 使用zk上的**临时顺序**节点来表示, 如/shared_lock/XXXXX-R-00001,表示一个共享锁
2. 获取锁, 所有客户端都到/shared_lock这个节点下创建一个临时顺序节点
  * 如果是读请求则带R标识, 如/shared_lock/XXXXX-R-00001
  * 如果是写请求则带W标识, 如/shared_lock/XXXXX-W-00001
2.1 获取/shared_lock节点下所有子节点, 并对该节点下注册子节点变更的Watcher监听
2.2 确定自己节点序号在所有子节点中的顺序
2.3 对于读请求, 如果没有比自己序号小的写节点, 则成功获得锁,
    对于写请求, 如果自己是序号最小的子节点, 则成功获得锁
2.4 如果没有成功获得锁, 则进入等到, 接收到Watcher通知后, 重复步骤2.1

3. 释放锁, 同排它锁一样, 即子节点删除

### 改进版 (避免羊群效应)
思路, 只关系与自己获取锁相关的关键节点
1. 客户端创建相应请求类型的临时顺序节点
2. 获取/shared_lock下的所有子节点, 注意这里不注册任何Watcher
3. 如果无法获取共享锁, 那么调用exist()/getData()来对关键节点注册Watcher
  * 读请求关键节点: 比自己序号小的最后一个写节点
  * 写请求关键节点: 比自己序号小的最后一个节点
4. 等待Watcher通知, 然后进入步骤2


## 参考
* [Zookeeper客户端Curator使用详解](http://www.throwable.club/2018/12/16/zookeeper-curator-usage/)
* [基于Zookeeper的分布式锁](http://www.dengshenyu.com/java/%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F/2017/10/23/zookeeper-distributed-lock.html)
* [七张图彻底讲清楚ZooKeeper分布式锁的实现原理](https://juejin.im/post/5c01532ef265da61362232ed)