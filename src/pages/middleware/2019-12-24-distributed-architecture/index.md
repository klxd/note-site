---
title: 分布式架构
date: "2019-12-22T22:40:32.169Z"
path: "/distributed-architecture"
tags:
    - middleware
---

## 2PC (two phase commit, 二阶段提交)
绝大部分关系型数据库采用二阶段提交协议来完成分布式事务处理.
阶段一: 提交事务请求
阶段二: 执行事务提交
1. 假如协调者从所有参与者得到的反馈都是yes响应, 那么**执行事务提交**
2. 假如任何一个参与者向协调者反馈了no响应, 或者等待超时之后, 协调者就会**中断事务**

优点: 原理简单, 实现方便
缺点:
* 同步阻塞: 各个参与者在等待其他参与者的过程中, 无法进行其他任何操作
* 单点问题: 协调者一旦出现问题, 则二阶段提交无法运转
* 数据不一致: 阶段二中, 执行事务提交的时候, 若只有部分参与者收到了commit请求(3PC试图解决), 则整个分布式系统会有数据不一致
* 过于保守: 没有容错机制, 任何一个参与者失败则导致整个事务的失败

## 3PC (three phase commit, 三阶段提交)
阶段一: canCommit, 协调者事务询问, 参与者反馈相应
阶段二: preCommit, 协调者根据阶段一中是否所有参与者都反馈了yes, 执行事务预提交或中断事务
阶段三: doCommit, 执行提交, 参与者正式执行事务提交操作, 发送ack消息, 此时若有任何参与者反馈了no响应,
      则协调者会发送中断请求, 参与者执行回滚

* 注意, 一旦进入阶段三, 无论是协调者出现故障, 还是网络出现分区, 参与者没有收到doCommit和中断请求,
  参与者都会在等待超时之后, 继续进行**事务提交**

优点: 降低了参与者的阻塞范围, 并且能在单点故障后继续达成一致
缺点: 部分参与者preCommit后出现网络分区, 则会出现数据不一致


## 分布式系统的难点
1。缺乏全局时钟
2。面对故障独立性
3。处理单点故障
4。事物的挑战


## 多机的Sequence问题处理
* 只考虑唯一性，使用UUID的生成方式；缺点：无连续性，存储空间较大
* 抽象一个id生成器服务，并发控制更新（如Zookeeper集群, Redis集群），改进每次取一个为每次取一段
* 雪花算法

## snowflake 雪花算法
* 使用41bit作为毫秒数, 可保存69年的时间区间, `(1L << 41) / (365 * 24 * 60 * 60 * 1000L) = 69`
* 10bit作为机器的ID(5个bit是数据中心，5个bit的机器ID), 最多支持1024个机器id
* 12bit作为毫秒内的流水号, 意味着每个节点在每毫秒可以产生 4096 个 ID
* 最后还有一个符号位，永远是0, 保证id为正数

### snowflake分析
属于半依赖数据源方式,需要保证机器id不重复,实际应用场景中要依赖外部参数配置或数据库记录
* 优点：高性能、低延迟、去中心化、按时间有序
* 缺点：
1. 要求机器时钟同步, 回拨会导致可能生成id重复
2. 只能趋势递增, 不像数据库id严格递增

### snowflake实现
```java
public class SnowflakeIdProvider implements IdProvider {
  public static final int machineBits = 10;
  public static final int sequenceBits = 12;

  public static final short machineIdUpperBound = (short) (round(pow(2, machineBits)) - 1);
  public static final short sequenceUpperBound = (short) (round(pow(2, sequenceBits)) - 1);

  public static final int timestampLShift = machineBits + sequenceBits;
  public static final int machineLShift = sequenceBits;
  public static final int sequenceLShift = 0;

  private int machineId;
  private long pauseMs = 0L;
  // 默认时间函数实现为当前时间毫秒,可以自定义
  private TimeFunction timeFn = SystemTimeFunction.getInstance();
  private short sequenceNum = 0;
  private long lastTimestamp = -1L;
  private final Object mutex = new Object();

  // 传入机器码初始化
  public SnowflakeIdProvider(int machineId) {
    if (machineId < 0 || machineId > machineIdUpperBound) {
      throw new IllegalArgumentException("machineId must be in the (inclusive) range [0, 1023]");
    }
    this.machineId = machineId;
  }

  public void setTimeFn(TimeFunction timeFn) {
    this.timeFn = timeFn;
  }

  public void setPauseMs(int pause) {
    this.pauseMs = pause;
  }

  public long getId() throws InvalidSystemClockException, SequenceExhaustedException {
    long now = timeFn.now();
    long seq;

    // 同步锁保证线程安全
    synchronized(mutex) {
      maybePause();

      if (now < lastTimestamp) {
        // 时钟回拨异常, 有些实现是容忍一定时间的时钟回拨, 用等待机制实现
        throw new InvalidSystemClockException();
      } else if (now > lastTimestamp) {
        // 时间已增加, 流水号重置  
        sequenceNum = 0;
      } else {
        // 时间相同, 流水号增大
        if (sequenceNum < SnowflakeIdProvider.sequenceUpperBound) {
          sequenceNum++;
        } else {
          // 12bit的流水号不够用时, 这里是报错处理,
          // 有些实现是自旋等待到下一个有剩余的时间戳
          throw new SequenceExhaustedException(sequenceNum);
        }
      }
      seq = sequenceNum;
      lastTimestamp = now;
    }

    return (now << timestampLShift) | (machineId << machineLShift) | (seq << sequenceLShift);
  }

  private void maybePause() {
    if (pauseMs > 0) {
      try {
        Thread.sleep(pauseMs);
      } catch (InterruptedException ie) {
      }
    }
  }
}

```

## 一致性哈希
一致性哈希解决了**固定哈希**分片在迁移和扩展节点时的问题
* 一致性哈希：将节点对应的哈希值变为一个范围，而不再是离散的
* 一般来说会将整个哈希值范围定义得比较大，然后将其分配给现有的节点，
  如果有节点加入则从某个节点上接管一部分哈希值，有节点推出则将其交给它的**下一个**节点来管理，
  这种方案受影响的节点最少，但是可能有负载均衡问题
* 虚拟节点可以改进一致性哈希加入删除节点时的负载均衡问题，将物理节点抽象为多个虚拟节点（如redis使用10^14个虚拟槽），
  每个虚拟节点支持连续哈希环上的一段，加入/删除物理节点时，将虚拟节点分配到其他多个物理节点上，
  即去除了上文**下一个节点**的概念。
  
## 分布式数据分区方案
哈希分区: 离散度好, 数据分布业务无关, 无法顺序访问, 代表产品: Redis Cluster, Cassandra, Dynamo
顺序分区: 离散度易倾斜, 数据分布业务相关, 可以顺序访问, 代表产品: Bigtable, HBase, Hypertable

## Raft算法
[Raft 中文翻译]https://github.com/maemual/raft-zh_cn/blob/master/raft-zh_cn.md
[raft-java实现](https://github.com/wenweihu86/raft-java)


## 配置中心Apollo
[Apollo配置中心架构剖析](https://mp.weixin.qq.com/s/-hUaQPzfsl9Lm3IqQW3VDQ)

## Q & A
* 设计一个秒杀系统，30分钟没付款就自动关闭交易

* 分布式事务的原理，优缺点，如何使用分布式事务，2pc 3pc 的区别
* 设计建立和保持100w的长连接
* 解释什么是MESI协议(缓存一致性)
* 实现分布式环境下的countDownLatch

* 限流策略，令牌桶和漏斗算法的使用场景
* 分布式服务调用方，不依赖服务提供方的话，怎么处理服务方挂掉后，大量无效资源请求
  的浪费，如果只是服务提供方吞吐不高的时候该怎么做，如果服务挂了，那么一会重启，该怎
  么做到最小的资源浪费，流量半开的实现机制是什么