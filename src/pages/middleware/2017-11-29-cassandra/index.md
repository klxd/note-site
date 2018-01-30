---
title: Cassandra基础知识
date: "2017-11-29T22:22:22.169Z"
path:  "/cassandra"
tags:
   - middleware
   - database
---

使用 Cassandra 已经有一段时间了,但是平时使用的都是公司内部封装好的接口,对 Cassandra 的特性并不会暴露太多,
现在在这里总结一下.

## ACID

* 原子性(Atomic)
  * 执行一个语句时,事务中的每个更新都必须成功才能称为成功
* 一致性(Consistent)
  * 数据必须从一个正确的状态转移到另一个正确的状态
* 隔离性(Isolated)
  * 并发执行的事务不应该彼此依赖
* 持久性(Durable)
  * 一旦一个事务成功完成,变更就不再丢失

## CAP 理论

* 一致性(Consistent)
  * 对于所有的数据库客户端使用同样的查询都可以得到同样的结果,
    即使是有并发更新的时候也是如此
* 可用性(Availability)
  * 所有的数据库客户端总是可以读写数据
* 分区耐受性(Partition Tolerance)

  * 数据库可以分散到多台机器上,即使发生网络故障,被分成多个分区,
    依然可以提供服务
    CAP 理论:对于任意给定的系统,只能强化这三个特性中的两个.

* CA
  * 主要支持一致性和可用性,很可能使用了两阶段提交的分布式事务,如果网络发生分裂,那么系统可能停止响应
  * 关系型数据库,MySQL,Postgres
* CP
  * 主要支持一致性和分区耐受性,通过设置数据分片来提升可扩展性,数据将保持一致性,但是如果有节点发生故障,仍有部分数据不可用
  * MongoDB,HBase,Redis
* AP
  * 主要支持可用性和分区耐受性,系统可能返回不太精确的数据,但是系统将始终可用,即使网络发生分区的时候也是如此
  * 亚马逊 Dynamo 的衍生品,Cassandra

## BASE 模型

* Basically Available: 基本可用,允许分区失败
* Soft state: 软状态,接收一段时间的状态不同步
* Eventually consistent: 最终一致,保证最终数据的状态是一致的

## Cassandra 与 RDB 的对比

|          RDB | column1         |
| -----------: | :-------------- |
|     database | keyspace        |
|        table | column family   |
|  primary key | row key         |
|  column name | column name/key |
| column value | column value    |

* Cassandra 没有引用完整性,因而没有 join 的概念和联级删除的概念
* 无法自由地对列进行搜索(SQL 中的 where 语句)
* RDB 先对数据进行建模,然后写查询方法;Cassandra 应先定义好查询,然后围绕查询来组织数据
* Cassandra 中没有 update 查询
* 不支持服务端事务,必须手工回滚

## Cassandra 的数据模型

* 集群(cluster): Cassandra 数据库系统是由多个节点组成的一个集群,有时也叫做环(ring)
* keyspace :集群是 keyspace 的容器,里面通常只有一个 keyspace
  * 可以针对 keyspace 设置的基本属性有一下几个
    1. 副本因子(Replication factor): 每行数据会被复制到多少个节点上
    2. 副本放置策略(Replica placement strategy): 副本如何放置到环上
    3. 列族
* 列族(column family): 容纳一组*有序行*的容器,每行都包含一组*有序*的列
  * cassandra 定义了列族但是没定义列,可以随意在任意列族中添加任意的列
  * 列族有两个属性: 名称和比较器
  * 向列族中写数据的时候，需要指定行键值(row key),类似于关系型数据库中的主键
* 列(column): Cassandra 数据模型中最基本的数据结构单元
  * 列由名称,值和时间戳组成的三元组,行没有时间戳,每个单独的列才有时间戳
  * Cassandra 中不需要预先定义列,所有列的名字都是由客户端提供的
  * 列的排序,Cassandra 返回给客户端的结果可以指定列的名字如何进行比较和排序

## 一致性级别

* 读一致性级别

  * _ONE_, 当一个节点响应查询时,立刻返回该响应的值.同时创建一个后台线程,检查这个记录的其他副本,
    如果哪个副本已经过期了,接下来就会进行读时修复,以确保所有的副本都拥有最新的值
  * _QUORUM_, 查询所有节点,当大部分副本((副本因子/2)+1)返回的时候,把时间戳最新的值返回,
    之后在后台进行必要的读修复
  * _ALL_, 查询所有节点,等待所有节点响应,并把时间戳最新的记录返回给客户端,之后进行必要的读修复.
    如果有任何节点没有响应(响应超时时间由 rpc_timeout_in_ms 决定,默认是 10 秒),读操作都会失败

* 写一致性级别
  * _ZERO_ 在写数据被记录之前的返回,写操作将会在后台线程中异步完成,无法确保一定成功
  * _ANY_ 保证数据至少已经写到一个节点上了,提示(hint)也被看做是一个成功的写入
  * _ONE_ 保证在返回时,数据至少已经写入到一个节点的 commit log 和 memtable 中了
  * _QUORUM_ 保证多数副本((副本因子/2)+1)已经接收到数据
  * _ALL_ 保证在返回时副本因子指定数量的节点都接收到了数据.如果某个副本对写操作无响应,则写操作会失败

## Cassandra 的架构

* system keyspace
  * 名字为 system 的内部 keyspace,无法手工修改
  * 存储关于集群的原数据
* 对等结构

  * Cassandra 没有主节点的概念,所有节点的地位都彼此相同
  * 任意节点掉线只会影响系统的整体吞吐能力,不会中断服务
  * 如果使用了合理的副本复制策略,故障节点上的所有数据仍然可以被读写

* gossip 与故障检测

  * Cassandra 使用了 gossip(流言)协议在进行环内通信,这样每个节点都会有其他节点的**状态**信息

* 逆熵与读修复

  * 逆熵(anti-entropy)是 Cassandra 的副本同步机制,用于保障不同节点上的数据都更新到最新的版本
  * 读取数据时,基于用户指定的一致性级别,一定数量的节点会被读取,在没有达到客户端指定的一致性级别前,
    读操作是阻塞的.如果 Cassandra 检测到某些响应节点持有的是过时的数据,在数据返回之后,Cassandra
    会在后台进行一个**读修复**的过程,用于更新过时的数据

* 墓碑
  * 当你执行一个删除操作时,数据并不会被立刻删除,而会进行一个更新操作,在相应的值上面放一个墓碑
  * 当执行压紧时,比墓碑更老的内容都会被清除,墓碑本身不会删除
  * 垃圾回收时延,默认是 10 天.一旦墓碑的寿命超过这个时间,墓碑将会被删除.
    设计这个时延的目的是留下足够长的时间以便于回复数据,如果一个节点的宕机时间超过这个时间点,那么应该被替换掉