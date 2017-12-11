---
title: Cassandra
date: "2017-11-29T22:22:22.169Z"
path:  "/cassandra"
tags:
   - middleware
   - database
---

## ACID
- 原子性(Atomic)
   - 执行一个语句时,事务中的每个更新都必须成功才能称为成功
- 一致性(Consistent)
   - 数据必须从一个正确的状态转移到另一个正确的状态
- 隔离性(Isolated)
   - 并发执行的事务不应该彼此依赖
- 持久性(Durable)
   - 一旦一个事务成功完成,变更就不再丢失
   
   
## CAP理论

- 一致性(Consistent)
   - 对于所有的数据库客户端使用同样的查询都可以得到同样的结果,
     即使是有并发更新的时候也是如此
- 可用性(Availability)
   - 所有的数据库客户端总是可以读写数据
- 分区耐受性(Partition Tolerance)
   - 数据库可以分散到多台机器上,即使发生网络故障,被分成多个分区,
     依然可以提供服务
CAP理论:对于任意给定的系统,只能强化这三个特性中的两个.

- CA
   - 主要支持一致性和可用性,很可能使用了两阶段提交的分布式事务,如果网络
     发生分裂,那么系统可能停止响应
   - 关系型数据库,MySQL,Postgres
- CP
   - 主要支持一致性和分区耐受性,通过设置数据分片来提升可扩展性,数据将保持
     一致性,但是如果有节点发生故障,仍有部分数据不可用
   - MongoDB,HBase,Redis
- AP
   - 主要支持可用性和分区耐受性,系统可能返回不太精确的数据,但是系统将始终
     可用,即使网络发生分区的时候也是如此
   - 亚马逊Dynamo的衍生品,Cassandra
   


#＃ Cassandra与RDB的名词映射

| RDB    | column1 |
|-------:|:-------|
| database     | keyspace |
| table        | column family |
| primary key  | row key|
| column name  | column name/key |
| column value | column value |
