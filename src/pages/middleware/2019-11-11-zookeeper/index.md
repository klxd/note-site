---
title: Zookeeper学习
date: "2019-11-11T22:22:22.169Z"
path:  "/zookeeper-note"
tags:
   - middleware
---

## ZAB协议(Zookeeper Atomic broadcast protocol)

ZAB 协议是为分布式协调服务 ZooKeeper 专门设计的一种支持崩溃恢复的原子广播协议。在 ZooKeeper 中，主要依赖 ZAB 协议来实现分布式数据一致性，基于该协议，ZooKeeper 实现了一种主备模式的系统架构来保持集群中各个副本之间的数据一致性。


### ZAB的四个阶段 (理论)

* Phase 0: Leader election（选举阶段）节点在一开始都处于选举阶段，只要有一个节点得到超半数节点的票数，它就可以当选准 leader。只有到达 Phase 3 准 leader 才会成为真正的 leader。这一阶段的目的是就是为了选出一个准 leader，然后进入下一个阶段。协议并没有规定详细的选举算法，后面我们会提到实现中使用的 Fast Leader Election。

* Phase 1: Discovery（发现阶段）在这个阶段，followers 跟准 leader 进行通信，同步 followers 最近接收的事务提议。这个一阶段的主要目的是发现当前大多数节点接收的最新提议，并且准 leader 生成新的 epoch，让 followers 接受，更新它们的 acceptedEpoch. 一个 follower 只会连接一个 leader，如果有一个节点 f 认为另一个 follower p 是 leader，f 在尝试连接 p 时会被拒绝，f 被拒绝之后，就会进入 Phase 0。

* Phase 2: Synchronization（同步阶段）同步阶段主要是利用 leader 前一阶段获得的最新提议历史，同步集群中所有的副本。只有当 quorum 都同步完成，准 leader 才会成为真正的 leader。follower 只会接收 zxid 比自己的 lastZxid 大的提议。

* Phase 3: Broadcast（广播阶段）
到了这个阶段，Zookeeper 集群才能正式对外提供事务服务，并且 leader 可以进行消息广播。同时如果有新的节点加入，还需要对新节点进行同步。

### ZAB协议实现
协议的 Java 版本实现跟上面的定义有些不同，选举阶段使用的是 Fast Leader Election（FLE），它包含了 Phase 1 的发现职责。因为 FLE 会选举拥有最新提议历史的节点作为 leader，这样就省去了发现最新提议的步骤。实际的实现将 Phase 1 和 Phase 2 合并为 Recovery Phase（恢复阶段）。所以，ZAB 的实现只有三个阶段：

* Fast Leader Election, 前面提到 FLE 会选举拥有最新提议历史（lastZixd最大）的节点作为 leader，这样就省去了发现最新提议的步骤。这是基于拥有最新提议的节点也有最新提交记录的前提。

* Recovery Phase （恢复阶段）
这一阶段 follower 发送它们的 lastZixd 给 leader，leader 根据 lastZixd 决定如何同步数据。这里的实现跟前面 Phase 2 有所不同：Follower 收到 TRUNC 指令会中止 L.lastCommittedZxid 之后的提议，收到 DIFF 指令会接收新的提议。

* Broadcast Phase (广播阶段)

## Question
Q1、如何使用ZK进行选举？画图说明
Q2、用ZooKeeper作任务分配如何实现？
Q3、什么是脑裂？如何解决脑裂？并说明NameNode和RescoureManager如何避免脑裂？
Q4、如何实现分布式数据存储的一致性？
Q5、讲一下一致性Hash。哪些地方使用了一致性Hash
Q6、一致性Hash与Paxos的区别？
Q7、讲一下2PC、以及2PC在什么情况下会出现数据不一致？
Q8、Zab协议如何避免阻塞？
Q9、2PC会在什么时候发生阻塞？
Q10、叙述Zab集群同步过程
Q11、ZK在重新选举Leader的时候，还可以继续执行事务请求吗？
Q12、ZK可以进行横向扩展吗？可以通过增加机器增加集群的性能吗？
Q13、主从架构下，Leader崩溃，数据一致性怎么保证？
Q14、选举Leader的时候，整个集群无法处理写请求，如何快速进行Leader选举？
Q15、Paxos与Zab协议有什么区别？为什么要搞Zab？Zab相比Paxos相比有什么优点？
Q16、ZK集群数量选择

A13:Leader 崩溃之后，集群会选出新的 Leader，然后就会进入恢复阶段，新的 Leader 具有所有已经提交的提议，因此它会保证让 followers 同步已提交的提议，丢弃未提交的提议（以 Leader 的记录为准），这就保证了整个集群的数据一致性。
A14:这是通过 Fast Leader Election 实现的，Leader 的选举只需要超过半数的节点投票即可，这样不需要等待所有节点的选票，能够尽早选出 Leader。
A16:生产环境中最好部署奇数个(3\5\7...),偶数个是不可以的。
也就是说：2个ZK，1个挂掉了，那么整个ZK集群就不可用了，因为剩下1个没有超过总数2个的一半，剩下的1个ZK也不可用了，所以2个ZK的容忍度是0。
同理：3个ZK挂掉1个，还剩2个，超过总数3个的一半，整个集群可用，所以3个ZK的容忍度是1。
所以：3—>1, 4—>1, 5—>2, 6—>2 ===>2n和2n-1的容忍度是一样的，所以没必要再增那一台不需要的。


## 参考
* [从PAXOS到Zookeeper分布式一致性原理与时间]
* [看大牛如何分析Zookeeper ZAB 协议](https://juejin.im/post/5b924b0de51d450e9a2de615)