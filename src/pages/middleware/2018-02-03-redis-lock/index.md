---
title: Redis Distributed Lock
date: "2018-02-02T22:22:22.169Z"
path:  "/redis-lock"
tags:
   - middleware
   - redis
---


## 原生Redis分布式锁

获得锁
`SET resource_name my_random_value NX PX 30000`
* 使用`NX`参数, 而不用`setnx`命令, 是为了在原子操作中加上过期时间,
* PX后面带的是以毫秒单位的过期时间, 可替换成EX, 表示以秒为单位,

释放锁
* 不直接使用del命令, 因为可能错误地释放了别人加上的锁
* 使用lua脚本实现, redis保证在一段lua脚本中不执行其他命令(单线程)
```lua
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

锁续租
* 延长自己持有的锁的过期时间
```lua
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("expire",KEYS[1], ARGV[2])
else
    return 0
end
```

### 原生实现缺点
原生的redis锁在高可用架构下(有故障转移)无法保证强一致性, 因为lock-key只保存在一个master节点上, 且redis的主从复制是异步的, 如果加锁后master宕机, 发生高可用切换,
新的master可能没有lock-key的信息(缓冲区数据未同步), 此时新的客户端能获得另一个锁, 导致数据不一致.

## RedLock 红锁
红锁是Redis作者提出的一致性解决方案, 算法基于多redis实例(实例间相互独立)实现，相对于单redis节点来说，优点在于防止单节点故障造成整个服务停止运行的情况

引入概念
1.TTL：Time To Live; redis key(lock)的过期时间或有效生存时间
2.clock drift:时钟漂移；指两个电脑间时间流速基本相同的情况下，两个电脑（或两个进程间）时间的差值；如果电脑距离过远会造成时钟漂移值过大

步骤
1.获取当前时间戳

2.client尝试按照顺序使用相同的key,value获取所有redis服务的锁，在获取锁的过程中的获取时间应该比TTL短很多，这是为了不要过长时间等待已经关闭的redis服务。
  并且试着获取下一个redis实例

3.再次获取当前时间, 减去第一步的时间，这个时间差要小于TTL时间(确定不是一个已过期的锁)并且至少有`(N/2+1)`个redis实例成功获取锁，才算真正的获取锁成功

4.如果成功获取锁，则锁的真正有效时间是TTL减去前三步所用的时间

5.如果客户端由于某些原因获取锁失败，需要向所有客户端发送释放锁的指令


### RedLock争议
Martin分析了RedLock的文章后提出以下批评:
* RedLock有过期时间(原生指定实现其实也有这个问题), 若client1持有锁的时间过长(如发生fullGC), 此时锁自动释放并且被client2拿到, 此时会发生多个客户端同时持有锁
  * Martin提出用`fecting token`(类似数据库的CAS)保证持有锁的client1更新时失败
* RedLock是一个严重依赖系统时钟的分布式系统, 如果某个Redis Master系统时钟错误, 可能造成锁的提前释放.
  * client1从ABCDE五个节点中获得了ABC三个节点的锁, 即成功持有锁
  * B节点由于系统时间走的快提前释放了锁
  * 此时client2可以从BDE三个节点获得RedLock


### RedLock缺点
* 加锁解锁延迟较大
* 占用资源较多, 需要创建多个互不相关的Redis实例
* 难以在集群版或标准主从架构的redis中实现


* [Redis RedLock 完美的分布式锁么](https://juejin.im/post/59f592c65188255f5c5142d2)
* [大家所推崇的 Redis 分布式锁，真的万无一失吗？](https://blog.csdn.net/u013256816/article/details/93305532)
* [Redlock（redis分布式锁）原理分析](https://www.cnblogs.com/rgcLOVEyaya/p/RGC_LOVE_YAYA_1003days.html)
* [How to do distributed locking](http://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)