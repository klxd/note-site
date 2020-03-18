---
title: Redis学习笔记
date: "2018-02-01T22:22:22.169Z"
path:  "/redis-note"
tags:
   - middleware
---

## 书籍
* Redis开发与运维：命令介绍，由浅入深
* Redis设计与实现：底层实现，原理讲解
* Redis实战：样例代码较多，读时需了解上下文情景

## Redis中的五种基本数据类型

* string 字符串是redis最基本的类型
* hash string类型键值(key=>value)对集合,hash特别适合用于存储对象
* list 简单的字符串列表，按照插入顺序排序
* set string类型的无序集合 通过hash和skiplist实现的
* zset(sort set) 每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序

## string

### string内部编码
* raw 动态字符串编码
* embstr：优化内存分配的字符串编码
* int：整数编码

## 哈希
### 设置值
* `hset key field value`
* `hsetnx` 功能与setnx类似
* `hmset key field value [field value ...]`: 批量设置

### 获取值
* `hget key filed`
* `hmget key field [field ...]`: 批量获取
* `hkeys key`: 返回指定哈希键（key）所有的field
* `hvals key`: 返回指定哈希键所有的value
* `hgetall key`: 返回所有field-value，field太多时建议用`hscan`代替

### 删除值
* `hdel key field [field ...]`

### other
* `hlen key`: 计算field的个数
* `hexist key field`: 判断field是否存在
* `hincrby key field`: 类似incrby，+1
* `hincrbyfloat key field`: 类似incrbyfloat
* `hstrlen key field`: 计算value的字符串长度 版本3.2以上

### hash内部编码
* ziplist - 压缩列表
  当元素个数小于`hash-max-ziplist-entries`(默认512个)，同时所有的值都小于`hash-max-ziplist-value`时使用
* hashtable - 哈希表，无法使用ziplist时使用，空间换时间


## 列表list
最多可以存储2^32-1个元素，列表中的元素是有序的，且是可以重复的

### 添加
* `rpush key value [value ...]`: 右侧插入，
* `lpush key value [value ...]`: 左侧插入
* `linsert key before|after pivot value`: 从列表中找到等于pivot的元素，在其前或后插入新元素

### 查
* `lrange key start end`: 索引下标从左到右是0到N-1，从右到左是-1到-N，end项包含本身
* `lindex key index`: 获取列表指定下标的元素
* `llen key`: 获取列表长度
### 删除
* `lpop key`: 弹出最左侧元素
* `rpop key`: 弹出最右侧元素
* `lrem key count value`：count>0，从左到右,删除最多count个；count<0，从右到左，删除最多count绝对值个；count=0，删除所有
* `ltrim key start end`：保留start到end（闭区间）内的元素

### 修改
* `lset key index newValue`: 修改指定下标元素

### 阻塞
* `blpop key [key ...] timeout`
* `brpop key [key ...] timeout`

可以同时监听多个列表的key， timeout为最长阻塞时间，单位为秒；
使用这两个命令时，如果有多个键，会从左往右遍历，若其中某个list有元素则立刻返回；
阻塞时，多个key中任何一个先有元素，则最先弹出那个元素；
多个客户端阻塞在同一个key，最先执行brpop/blpop命令的客户端会获取到值（公平地）；

### list内部编码
* ziplist：列表元素小于`list-max-ziplist-entries`（默认512个），同时列表中的值都小于`list-max-ziplist-value`时使用
* linkedlist：链表，无法使用ziplist时使用
* quicklist：以ziplist为节点的linkedlist，结合了两者的优势

### list使用场景
* 消息队列：`lpush + brpop`命令组合可以实现阻塞队列，可保证多个客户端消费的负载均衡与高可用，
  缺点：无法保证消息正确被消费，无法实现消息多次消费（多消费者组）
* 有限集合：`lpush + ltrim`
* 栈：`lpush + lpop`


## 集合set
无序集合，不允许重复，最多2^32-1个

### 添加
* `sadd key element [element ...]`: 返回添加成功的个数

### 删除
* `srem key element [element ...]`: 返回删除成功的个数
* `spop key [count]`：随机弹出一个元素，3.2开始支持count

### 查
* `scard key`: 计算元素个数，时间复杂度O（1）
* `sismember key element`: 是否在集合中
* `srandmember key [count]`: 随机从集合中返回元素，count默认为1
* `smembers key`: 获取所有元素，元素过多建议使用`sscan`

### 集合间操作
* `sinter key [key ...]`: 求多个集合的交集
* `suinon key [key ...]`: 求多个集合的并集
* `sdiff key [key ...]`: 求多个集合的差集，在第一个key中但是不在后续的key中

* `sinterstore destination key [key ...]`: 将交集保存在destination集合中
* `suinonstore destination key [key ...]`
* `sdiffstore destination key [key ...]`

### set内部编码
* intset 整数集合，当集合中元素都是整数且个数小于`set-max-intset-entries`(默认512个)时使用
  intset的encoding为3种int16，int32和int64，当整数超出当前类型时自动升级且不能回退，
  intset内部按升序存储了整数数组，插入速度为O(n)
* hashtable 哈希表

### set使用情景
* `sadd` 打标签tag
* `srandmember/spop`: 生成随机数，抽奖
* `sadd + sinter`: 社交需求

## 有序集合zset
元素不能重复，但有序，每个元素有一个score（分数可以重复）作为排序依据

### 集合内
* `zadd key score member [score member ...]`: 添加成员，时间复杂度为logN
* `zcard key`: 计算成员个数，时间复杂度O（1）
* `zscore key member`: 计算某个成员的分数
* `zrank key member`: 计算成员排名，从低到高排名，下标0开始
* `zrevrank key member`: 计算成员排名，从高到低排名，下标0开始
* `zrem key member [member ...]`: 删除成员
* `zincrby key increment member`: 增加成员分数
* `zrange key start end [withscores]`: 返回指定排名范围的成员，从低到高
* `zrevrange key start end [withscores]`: 返回指定排名范围的成员，从高到低


### zset内部编码
* ziplist 压缩列表，当有序集合元素个数小于`zset-max-ziplist-entries`（默认128个），同时每个元素的值都小于`zset-max-ziplist-value`(默认64字节)
* skiplist: 无法使用ziplist时使用

### zset使用场景
* `zadd+zincrby`: 统计获赞数
* `zrevrangebyrank key 0 9`：取排行榜前10名

## 过期时间
* `expire key seconds`: 键在seconds秒后过期，0表示键不存在，负值则键立刻被删除
* `expireat key timestamp`: 键在秒级时间戳timestamp后过期
* `ttl` & `pttl`：查询键的过期时间， 大于等于0：键的剩余过期时间； -1；没有过期时间； -2：键不存在
* `pexpire key milliseconds`: milliseconds毫秒后过期
* `pexpireat key millsseconds-timestamp`: 键在毫秒级时间戳后过期，所有过期相关命令的最终实现
* `persist`：消除过期时间
* 字符串的set指令会消除过期时间，setex作为set+expire的组合，是原子执行

## 键遍历
* `keys pattern`: 键过多时可能阻塞
* `scan cursor [match-pattern] [count-number]`： 渐进式遍历, 
   cursor为游标，第一次从0开始，每次遍历完返回当前游标的值，直到返回0结束，
   match-pattern可选，与keys的模式匹配类似；
   count-number表示每次要遍历的键的个数，默认为10，
   注意scan遍历过程中若键有变化，则可能遍历漏或重复遍历
* `hscan`，`sscan`和`zscan`分别代替`hgetall`，`smembers`和`zrange`，（lrange不存在阻塞问题，返回个数可自定义）
   

## Bitmaps
使用字符串实现
* `setbit key offset value`: value为0或1
* `getbit key offset`：获取位置在offset的值
* `bitcount key [start] [end]`: 获取指定范围中1的个数
* `bitop op destkey key[key ...]`: op可以是 `and，or, not, xor`
* `bitpos key targetBit [start][end]`: 计算Bitmaps中第一个值为targetBit的偏移量

## HyperLogLog
* 实际类型为字符串类型，提供一种基数算法，可以用极小的内存空间完成独立总数的统计，如IP，email，Id等
* 指令`pfadd，pfcount，pfmerge`
* 只计算独立总数，不需要获取单条数据
* 可以容忍一定误差率，毕竟HyperLogLog在内存占用量上有很大优势


## 发布订阅
* `publish channel message`：发布消息
* `subscribe channel [channel...]`: 订阅消息
* 客户端执行订阅命令后则进入订阅状态，只能接收subscribe，unsubscribe，psubscribe，punsubscribe相关命令
* 新开启订阅的客户端无法接收之前的消息，因为redis不会对消息做持久化

## Jedis
* Jedis中pipeline使用：pipeline = jedis.pipelined(); pipeline.del(String key)...; pipeline.sync();
* Jedis.close()在直连下是关闭连接，在连接池则是归还连接
* monitor: 能监听所有其他客户端的命令，但是可能redis的输出缓冲暴涨，占用大量内存

## redis内存
* 内存上限可以通过`config set maxMemory`进行动态修改
* 过期键删除，redis中有两种策略
   * 惰性删除，当客户端访问到过期键时执行删除操作
   * 定时任务删除，维护一个定时任务，默认每秒运行10次，根据键的过期比例，采用快慢两种模式回收键
* 内存溢出控制策略，由参数`maxmemory-policy`控制
  1. noeviction：默认策略，不删除数据，但是拒绝所有写入操作
  2. volatile-lru：根据lru算法删除设置了超时属性的键，若没有可删除的键，回到noeviction
  3. allkeys-lru：不管键有没有超时属性，根据lru删除键
  4. allkeys-random：随机删除键
  5. volatile-random：随机删除过期键
  6. volatile-ttl: 根据对象的ttl属性，删除即将要过期的数据，若没有则回到noeviction
* 整数对象池：redis内部维护0-9999的整数对象池，注意对象池在使用volatile-lru和allkeys-lru相关淘汰策略时无效，ziplist也无法使用对象池

## 事务——Transactions
* `multi`代表事务开始，`exec`/`discard`代表事务结束，他们之间的命令是原子执行的
* 事务中有命令错误，则事务不执行，若是运行时错误，则事务部分执行，不支持*回滚*
虽然 Redis 的 Transactions 提供的并不是严格的 ACID 的事务
（比如一串用 EXEC 提交执行的命令，在执行中服务器宕机，那么会有一部分命令执行了，剩下的没执行）,
但是这个 Transactions 还是提供了基本的命令打包执行的功能
（在服务器不出问题的情况下，可以保证一连串的命令是顺序在一起执行的，中间不会有其它客户端命令插进来执行）.
Redis 还提供了一个 Watch 功能，你可以对一个 key 进行 Watch，然后再执行 Transactions，
在这过程中，如果这个 Watched 的值进行了修改，那么这个 Transactions 会发现并拒绝执行。

## 持久化
Redis虽然是一种内存型数据库，一旦服务器进程退出，数据库的数据就会丢失，
为了解决这个问题Redis提供了两种持久化的方案，将内存中的数据保存到磁盘中，避免数据的丢失。

* RDB持久化
   * redis提供了RDB持久化的功能，这个功能可以将redis在内存中的的状态保存到硬盘中，它可以手动执行，也可以再redis.conf中配置，定期执行。
   * RDB持久化产生的RDB文件是一个经过压缩的二进制文件，这个文件被保存在硬盘中，redis可以通过这个文件还原数据库当时的状态。
   * 生成 -- 有两个redis命令可以生成RDB文件, SAVE(阻塞服务器进程,RDB文件创建期间无法处理其他请求), BGSAVE(background save, 派生子进程来处理)
   * 载入, 优先使用AOF文件来还原数据, redis启动时只要检测到RDB文件的存在, 且没有AOF文件(AOF持久化功能关闭), 就会自动载入
     
* AOF(Append Only File)持久化
   * AOF持久化是通过保存Redis服务器所执行的写命令来记录数据库状态的，配置`appendonly yes`来开启
   * 命令请求会先保存到AOF缓冲区(内存)里面, 再定期写入并同步到AOF文件，类似rocketmq的异步刷盘
   * appendfsync选项的不同值对AOF持久化功能的安全性和服务器性能有很大影响，`always，everysec，no`，常用`everysec`，最多丢失两秒的数据
     (主线程负责写入AOF缓冲区, AOF线程负责每秒执行一次同步磁盘操作, 主线程负责对比上次AOF同步时间, 若小于2秒则直接返回, 超过则阻塞)k
   * AOF重写可以产生一个新的AOF文件, 这个新的文件和原有的文件所保存的数据库状态一样, 但体积更小
   * AOF重写是通过读取数据库中的键值对来实现的,无须对现有的AOF文件进行任何分析操作，
     手动触发`bgrewriteaof`命令，自动触发：配置`auto-aof-rewrite-min-size`和`auto-aof-rewrite-percentage`

对比:
* AOF更安全，可将数据及时同步到文件中，但需要较多的磁盘IO，AOF文件尺寸较大，文件内容恢复相对较慢， 也更完整。
* RDB持久化，安全性较差，它是正常时期数据备份及master-slave数据同步的最佳手段，文件尺寸较小，恢复数度较快，
  每次运行都要fork操作创建子进程，属于重量级操作

## 开发规范
【强制】：拒绝bigkey(防止网卡流量、慢查询)

string类型控制在10KB以内，hash、list、set、zset元素个数不要超过5000。

反例：一个包含200万个元素的list。

非字符串的bigkey，不要使用del删除，使用hscan、sscan、zscan方式渐进式删除，同时要注意防止bigkey过期时间自动删除问题(例如一个200万的zset设置1小时过期，
会触发del操作，造成阻塞，而且该操作不会出现在慢查询中(latency可查)

[Redis开发规范解析-bigkey](https://mp.weixin.qq.com/s?__biz=Mzg2NTEyNzE0OA==&mid=2247483677&idx=1&sn=5c320b46f0e06ce9369a29909d62b401)

# 缓存设计

## 缓存穿透

缓存穿透是指查询一个一定不存在的数据，由于缓存是不命中时被动写的，并且出于容错考虑，如果从存储层查不到数据则不写入缓存，
这将导致这个不存在的数据每次请求都要到存储层去查询，失去了缓存的意义。在流量大时，
可能DB就挂掉了，要是有人利用不存在的key频繁攻击我们的应用，这就是漏洞。

**解决方案**

* 布隆过滤器 将所有可能存在的数据哈希到一个足够大的bitmap中，一个一定不存在的数据会被 这个bitmap拦截掉，从而避免了对底层存储系统的查询压力。
* 缓存空结果 如果一个查询返回的数据为空（不管是数 据不存在，还是系统故障），我们仍然把这个空结果进行缓存，但它的过期时间会很短，最长不超过五分钟。

## 缓存雪崩

缓存雪崩是指在我们设置缓存时采用了相同的过期时间，导致缓存在某一时刻同时失效，请求全部转发到DB，DB瞬时压力过重雪崩。
缓存失效时的雪崩效应对底层系统的冲击非常可怕。大多数系统设计者考虑用加锁或者队列的方式保证缓存的单线程（进程）写，
从而避免失效时大量的并发请求落到底层存储系统上。

**解决方案**

* 分散过期时间 比如我们可以在原有的失效时间基础上增加一个随机值，比如1-5分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件。
* 后端(存储系统)限流并降级, 可使用Hystrix

## 缓存击穿 (热点key重建优化)

对于一些设置了过期时间的key，如果这些key可能会在某些时间点被超高并发地访问，是一种非常“热点”的数据。
这个时候，需要考虑一个问题：缓存被“击穿”的问题，这个和缓存雪崩的区别在于这里针对某一key缓存，前者则是很多key。

缓存在某个时间点过期的时候，恰好在这个时间点对这个Key有大量的并发请求过来，
这些请求发现缓存过期一般都会从后端DB加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端DB压垮。

**解决方案**

* 使用互斥锁(mutex key)  业界比较常用的做法，是使用mutex。此方法只允许一个线程重建缓存, 简单地来说，就是在缓存失效的时候（判断拿出来的值为空），不是立即去load db，
  而是先使用缓存工具的某些带成功操作返回值的操作（比如Redis的SETNX或者Memcache的ADD）去set一个mutex key (带上过期时间, 防止第一个线程出错不释放锁)，当操作返回成功时，
  再进行load db的操作并回设缓存；否则，就重试整个get缓存的方法。SETNX，是「SET if Not eXists」的缩写，
  也就是只有不存在的时候才设置，可以利用它来实现锁的效果。
* "提前"使用互斥锁(mutex key)：在value内部设置1个超时值(timeout1), timeout1比实际的timeout(timeout2)小。
  当从cache读取到timeout1发现它已经过期时候，马上延长timeout1并重新设置到cache。然后再从数据库加载数据并设置到cache中.

* "永远不过期",不设置过期时间,所以不会出现热点key过期后产生的问题,也就是“物理”不过期.为每个value设置一个逻辑过期时间,
  当发现超过逻辑过期时间后,会使用**单独的线程**去构建缓存(不影响查询线程)
  
## 无底洞问题
分布式缓存中(redis cluster), 由于键分布在不同的数据节点中, 有更多的机器不保证有更高的性能;
有四种批量操作方式:串行命令、串行IO、并行IO、hash_tag。


## 一致性哈希

* <https://blog.csdn.net/u013851082/article/details/68063446>




## Question
* redis的操作是不是原子操作
   * Redis所有单个命令的执行都是原子性的, 深层原因是Redis底层是单线程的
   * 多个操作也支持事务，即原子性，通过MULTI和EXEC指令包起来
   * 可以利用watch, MULTI和EXEC实现CAS

* 如何实现分布式缓存

* redlock，算法实现，争议点

* 缓存击穿如何处理

* 缓存预热

* Redis有哪些数据结构？
  字符串String、字典Hash、列表List、集合Set、有序集合SortedSet。
  中级，还需要加上下面几种数据结构Bitmaps, HyperLogLog、Geo、Pub/Sub。
  高级Redis Module，像BloomFilter，RedisSearch，Redis-ML，
  
* 使用keys指令可以扫出指定模式的key列表。对方接着追问：如果这个redis正在给线上的业务提供服务，那使用keys指令会有什么问题？这个时候你要回答redis关键的一个特性：redis的单线程的。keys指令会导致线程阻塞一段时间，线上服务会停顿，直到指令执行完毕，服务才能恢复。这个时候可以使用scan指令，scan指令可以无阻塞的提取出指定模式的key列表，但是会有一定的重复概率，在客户端做一次去重就可以了，但是整体所花费的时间会比直接用keys指令长。

* 使用过Redis做异步队列么
  * 一般使用list结构作为队列，rpush生产消息，lpop消费消息。当lpop没有消息的时候，要适当sleep一会再重试。
  * list还有个指令叫blpop，在没有消息的时候，它会阻塞住直到消息到来。能不能生产一次消费多次呢？
  * 使用pub/sub主题订阅者模式，可以实现1:N的消息队列。缺点: 在消费者下线的情况下，生产的消息会丢失，得使用专业的消息队列如rabbitmq等。

* 如果对方追问redis如何实现延时队列？ 
  使用sortedset，拿时间戳作为score，消息内容作为key调用zadd来生产消息，消费者用zrangebyscore指令获取N秒之前的数据轮询进行处理。

* 如果有大量的key需要设置同一时间过期，一般需要注意什么？
  如果大量的key过期时间设置的过于集中，到过期的那个时间点，redis可能会出现短暂的卡顿现象。一般需要在时间上加一个随机值，使得过期时间分散一些,
  或者后台限流降级.

* Redis如何做持久化的？ bgsave做镜像全量持久化，aof做增量持久化。因为bgsave会耗费较长时间，不够实时，在停机的时候会导致大量丢失数据，所以需要aof来配合使用。在redis实例重启时，会使用bgsave持久化文件重新构建内存，再使用aof重放近期的操作指令来实现完整恢复重启之前的状态。

* 如果突然机器掉电会怎样？ 取决于aof日志sync属性的配置，如果不要求性能，在每条写指令时都sync一下磁盘，就不会丢失数据。
  但是在高性能的要求下每次都sync是不现实的，一般都使用定时sync，比如1s1次，这个时候最多就会丢失1s-2s的数据。

* bgsave的原理
  1. fork是指redis通过创建子进程来进行bgsave操作，
  2. cow指的是copy on write，子进程创建后，父子进程共享数据段，父进程继续提供读写服务，写脏的页面数据会逐渐和子进程分离开来。

* Pipeline有什么好处，为什么要用pipeline？
  * 可以将多次IO往返的时间缩减为一次，前提是pipeline执行的指令之间**没有因果相关性**。
    使用redis-benchmark进行压测的时候可以发现影响redis的QPS峰值的一个重要因素是pipeline批次指令的数目。

* Redis的同步机制了解么
  1. Redis可以使用主从同步，从从同步。第一次同步时，主节点做一次bgsave，并同时将后续修改操作记录到内存buffer，
  2. 待完成后将rdb文件全量同步到复制节点，复制节点接受完成后将rdb镜像加载到内存。
  3. 加载完成后，再通知主节点将期间修改的操作记录(buffer)同步到复制节点进行重放就完成了同步过程。

* 是否使用过Redis集群，集群的原理是什么？
  Redis Sentinel着眼于高可用，在master宕机时会自动将slave提升为master，继续提供服务。
  Redis Cluster着眼于扩展性，在单个redis内存不足时，使用Cluster进行分片存储

* Redis 如何做内存优化
  * 缩减key的长度(能标识业务即可),缩减value长度,用更高效的序列化工具,存储二进制数据而不是字符串等
  * redis中`0-9999`的整数共享对象池, 开发中使用整数存储值能减少内存使用
  * redis能自动做编码优化, 可通过配置适当调整
  * 控制外层键的数量, 可使用hash或set降低外层键的数量

* [50道Redis题目](https://mp.weixin.qq.com/s?__biz=MzI3ODcxMzQzMw==&mid=2247486734&idx=2&sn=d8454c6cbd09ab60ef5a728a36c19e8c&chksm=eb538838dc24012e15b813df90a115803c243eb6a242c052d684c6c3819b5f3300f3a2d482be&scene=21#wechat_redirect)

## 参考
* [Redis 菜鸟教程](http://www.runoob.com/redis/redis-data-types.html)
* [使用Redis实现分布式锁及其优化](http://mzorro.me/2017/10/25/redis-distributed-lock/)
* [Redis主从复制总结整理](http://alinuxer.sinaapp.com/?p=340)
* [Redis 集群规范](http://redisdoc.com/topic/cluster-spec.html)
 
* [Redis系列文章](https://www.cnblogs.com/kismetv/p/9609938.html)
* [大家所推崇的 Redis 分布式锁，真的万无一失吗？](https://blog.csdn.net/u013256816/article/details/93305532)
