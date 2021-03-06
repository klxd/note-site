---
title: 数据库学习笔记
date: "2018-02-02T22:22:22.169Z"
path:  "/relation-database"
tags:
   - middleware
---

## 数据库范式

第一范式：列不可分，eg:【联系人】（姓名，性别，电话），一个联系人有家庭电话和公司电话，那么这种表结构设计就没有达到 1NF；

第二范式：有主键，保证完全依赖。eg:订单明细表【OrderDetail】（OrderID，ProductID，UnitPrice，Discount，Quantity，ProductName），Discount（折扣），Quantity（数量）完全依赖（取决）于主键（OderID，ProductID），而 UnitPrice，ProductName 只依赖于 ProductID，不符合2NF；

第三范式：无传递依赖(非主键列 A 依赖于非主键列 B，非主键列 B 依赖于主键的情况)，eg:订单表【Order】（OrderID，OrderDate，CustomerID，CustomerName，CustomerAddr，CustomerCity）主键是（OrderID），CustomerName，CustomerAddr，CustomerCity 直接依赖的是 CustomerID（非主键列），而不是直接依赖于主键，它是通过传递才依赖于主键，所以不符合 3NF。


## drop、delete与truncate分别在什么场景之下使用
* 不再需要一张表的时候，用drop
* 想删除部分数据行时候，用delete，并且带上where子句
* 保留表而删除所有数据的时候用truncate

##mysql有关权限的表都有哪几个？
Mysql服务器通过权限表来控制用户对数据库的访问，权限表存放在mysql数据库里，由mysql_install_db脚本初始化。这些权限表分别user，db，table_priv，columns_priv和host。

## mysql中in与exists效率比较
[mysql中in与exists效率比较](https://blog.csdn.net/lilun517735159/article/details/78826521)

## 主从延迟

## 数据库事务
四大特性 - ACID
* 原子性 (Atomicity)
* 一致性 (Consistency)
* 隔离性 (Isolation)
* 持久性 (Durability)


## 事务隔离级别

### 为什么要有隔离级别

如果事务之间没有隔离性, 可能会发生以下问题
* `脏读`(Dirty Read): 一个事务在处理过程中读取了另一个**未提交事务**中的数据
* `不可重复读`(Non-Repeatable Read): 一个事务范围内,多次查询同一个数据, 却返回了
  不同的数据值. 发生的原因是在查询的间隔, 数据被另一个事务修改并且提交了
* `幻读`(Phantom Read): 幻读是事务非独立执行时发生的一种现象, 例如事务T1对一个表
  中所有的行的某个数据项做了从“1”修改为“2”的操作, 这时事务T2又对这个表中插入了一行数据项,
  而这个数据项的数值还是为“1”并且提交给数据库. 而操作事务T1的用户如果再查看刚刚修改的数据,
   会发现还有一行没有修改，其实这行是从事务T2中添加的, 就好像产生幻觉一样, 这就是发生了幻读。
   幻读和不可重复读都是读取了另一条已经提交的事务（这点就脏读不同），所不同的是不可重复读查询的都是同一个数据项，
   而幻读针对的是一批数据整体（比如数据的个数）

### 四种事务隔离级别
在 SQL 标准中定义了四种数据库的事务的隔离级别：每个事务的隔离级别其实都比上一级多解 
* `RAED UNCOMMITED`：使用查询语句不会加锁，可能会读到未提交的行(Dirty Read)
* `READ COMMITED`：只对记录加记录锁，而不会在记录之间加间隙锁，
   所以允许新的记录插入到被锁定记录的附近，所以再多次使用查询语句时，
   可能得到不同的结果(Non-Repeatable Read)
* `REPEATABLE READ`：多次读取同一范围的数据会返回第一次查询的快照，不会返回不同
   的数据行，但是可能发生幻读(Phantom Read)
* `SERIALIZABLE`：InnoDB(数据库引擎之一)隐式地将全部的查询语句加上共享锁，解决了幻读的问题

以上四种隔离级别最高的是Serializable级别，最低的是Read uncommitted级别，当然级别越高，
执行效率就越低。像Serializable这样的级别，就是以锁表的方式(类似于Java多线程中的锁)
使得其他的线程只能在锁外等待，所以平时选用何种隔离级别应该根据实际情况。
在MySQL数据库中默认的隔离级别为Repeatable read (可重复读), Innodb的可重复读级别其实已经解决了幻读的问题。
oracle默认隔离级别 Read committed

### 设置隔离级别
设置数据库的隔离级别一定要是在开启事务之前, 如果是使用JDBC对数据库的事务设置隔离级别的话，
也应该是在调用Connection对象的setAutoCommit(false)方法之前。

隔离级别的设置只对当前链接有效。对于使用MySQL命令窗口而言，一个窗口就相当于一个链接，
当前窗口设置的隔离级别只对当前窗口中的事务有效; 
对于JDBC操作数据库来说，一个Connection对象相当于一个链接，
而对于Connection对象设置的隔离级别只对该Connection对象有效，与其他链接Connection对象无关。

[Innodb中的事务隔离级别和锁的关系](https://tech.meituan.com/2014/08/20/innodb-lock.html)

### 隔离级别的实现
#### 锁
锁是一种最为常见的并发控制机制，在一个事务中，我们并不会将整个数据库都加锁，
而是只会锁住那些需要访问的数据项， 
MySQL 和常见数据库中的锁都分为两种，共享锁（Shared）和互斥锁（Exclusive），
前者也叫读锁，后者叫写锁。 读锁保证了读操作可以并发执行，相互不会影响，
而写锁保证了在更新数据库数据时不会有其他的事务访问或者更改同一条记录造成不可预知的问题。

#### 时间戳

除了锁，另一种实现事务的隔离性的方式就是通过时间戳，使用这种方式实现事务的数据库，
例如 PostgreSQL 会为每一条记录保留两个字段；
* 读时间戳中保存了所有访问该记录的事务中的最大时间戳，
* 而记录行的写时间戳中保存了将记录改到当前值的事务的时间戳。


#### 多版本和快照隔离

通过维护多个版本的数据，数据库可以允许事务在数据被其他事务更新时对旧版本的数据进行读取，
很多数据库都对这一机制进行了实现；因为所有的读操作不再需要等待写锁的释放，
所以能够显著地提升读的性能，MySQL 和 PostgreSQL 都对这一机制进行自己的实现，
也就是 MVCC（多版本并发控制），虽然各自实现的方式有所不同，典型的有乐观并发控制和悲观并发控制
MySQL 就通过文章中提到的回滚日志实现了 MVCC，保证事务并行执行时能够不等待互斥锁的释放直接获取数据

## InnoDB的MVCC实现 
InnoDB的MVCC，是通过在每行记录后面保存两个隐藏的列来实现的。
这两个列，一个保存了行的创建时间，一个保存了行的过期时间（删除时间）。当然存储的并不是实际时间，而是系统版本号（system version number）。
每开始一个新的事务，系统版本号都会自动递增。事务开始时刻的系统版本号会作为事务的版本号，用来和查询到的每行记录的版本号进行比较。

下面看一下在**REPEATABLE READ**隔离级别下，MVCC具体是如何操作的。

* SELECT
    InnoDB 会根据以下两个条件检查每行记录：

    1. InnoDB只查找版本早于当前事务版本的数据行（也就是，行的系统版本号小于或等于事务的系统版本号），这样可以确保事务读取的行，要么是在事务开始前已经存在的，要么是事务自身插入或者修改过的。
    2. 行的删除版本要么未定义，要么大于当前事务版本号。这可以确保事务读取到的行，在事务开始之前未被删除。
   只有符合上述两个条件的记录，才能返回作为查询结果。

* INSERT InnoDB为新插入的每一行保存当前系统版本号作为行版本号。

* DELETE InnoDB为删除的每一行保存当前系统版本号作为行删除标识。

* UPDATE InnoDB为插入一行新记录，保存当前系统版本号作为行版本号，同时保存当前系统版本号到原来的行作为行删除标识。

保存这两个额外系统版本号，使大多数读操作都可以不用加锁。这样设计使得读数据操作很简单，性能很好，并且也能保证只会读取到符合标准的行。
不足之处是每行记录都需要额外的存储空间，需要做更多的行检查工作，以及一些额外的维护工作。

注意：MVCC只在REPEATABLE READ和READ COMMITIED两个隔离级别下工作。
其他两个隔离级别都和 MVCC不兼容 ，因为READ UNCOMMITIED总是读取最新的数据行，而不是符合当前事务版本的数据行。
而SERIALIZABLE则会对所有读取的行都加锁。

## mysql事务能保证失败回滚

想要保证事务的原子性，就需要在异常发生时，对已经执行的操作进行回滚
，而在 MySQL 中，恢复机制是通过回滚日志（undo log）实现的，
所有事务进行的修改都会先记录到这个回滚日志中，然后在对数据库中的对应行进行写入。

回滚日志除了能够在发生错误或者用户执行 ROLLBACK 时提供回滚相关的信息，
它还能够在整个系统发生崩溃、数据库进程直接被杀死后，当用户再次启动数据库进程时，
还能够立刻通过查询回滚日志将之前未完成的事务进行回滚，
这也就需要回滚日志必须先于数据持久化到磁盘上，是我们需要**先写日志后写数据库**的主要原因。

回滚日志并不能将数据库物理地恢复到执行语句或者事务之前的样子；
它是逻辑日志，当回滚日志被使用时，它只会按照日志逻辑地将数据库
中的修改撤销掉看，可以理解为，我们在事务中使用的每一条 INSERT 
都对应了一条 DELETE，每一条 UPDATE 也都对应一条相反的 UPDATE 语句。

## mysql数据库的锁有多少种，怎么编写加锁的sql语句

* **行级锁** 行级锁是Mysql中锁定粒度最细的一种锁，表示只针对当前操作的行进行加锁。
   行级锁能大大减少数据库操作的冲突。其加锁粒度最小，但加锁的开销也最大。行级锁分为两种:
   1. 共享锁 (读锁)
      * 用法: SELECT ... LOCK IN SHARE MODE;
   2. 排它锁 (写锁)
      * 用法: SELECT ... FOR UPDATE;

* **表级锁**  表级锁是MySQL中锁定粒度最大的一种锁，表示对当前操作的整张表加锁，
   它实现简单，资源消耗较少，被大部分MySQL引擎支持。最常使用的MYISAM与INNODB都支持表级锁定。
   意向锁:  意向锁是表级锁，其设计目的主要是为了在一个事务中揭示下一行将要被请求锁的类型。
   意向锁是InnoDB自动加的，不需用户干预, InnoDB中的两个表锁：
   
    1. 意向共享锁（IS）：表示**事务**准备给数据行加入共享锁，
       也就是说一个数据行加共享锁前必须先取得该表的IS锁
   
    2. 意向排他锁（IX）：类似上面，表示**事务**准备给数据行加入排他锁，
       说明事务在一个数据行加排他锁前必须先取得该表的IX锁。

* **页级锁**  页级锁是MySQL中锁定粒度介于行级锁和表级锁中间的一种锁。
   表级锁速度快，但冲突多，行级冲突少，但速度慢。所以取了折衷的页级，
   一次锁定相邻的一组记录。BDB支持页级锁
   
      


## mysql什么情况下会触发表锁
## 页锁、乐观锁、悲观锁

## 数据库的索引数据结构

### BST (binary search tree)
二叉搜索树：
1. 每个非叶节点最多有两个儿子
2. 每个节点都只存一个关键字
3. 节点左子树小于其关键字，右子树大于其关键字

* 若节点的左右子树深度相差太大，可能退化为链表
* 实际使用需要加上平衡算法，即“平衡二叉树”；
* 平衡算法是一种在BST中插入和删除结点的策略。常见的平衡二叉树有：AVL，RBT，Treap，Splay Tree
* BST作为数据库索引的缺点: 
   1. 树的深度太大,搜索时需要多次访问硬盘;
   2. 搜索时间不稳定, 搜索可能在非叶子节点结束


### B-树
平衡多路查找树，并不是二叉的，对于一颗M阶的B-树：
1. 任意非叶子节点最多只有M个儿子，且M>2
2. 根节点的儿子数目为`[2, M]`
3. 除根节点外的非叶子节点儿子数为`[M/2, M]`

B-树的特性：
   1. 关键字集合分布在整颗树中；
   2.任何一个关键字出现且只出现在一个结点中；
   3.搜索有可能在非叶子结点结束；
   4.其搜索性能等价于在关键字全集内做一次二分查找(logN)；
   5.自动层次控制；

### B+树

B+树是B树的一种变体，也是一种多路平衡查找树， 它和B树主要不同点在：

* 每个节点最多含有 m 个关键字
* 所有的叶节点中包含了全部关键字的信息，以及指向还有这些关节字记录的指针
* 叶节点本身按照关键字顺序相互连接
* 所有非叶节点可以看成是索引部门，节点中仅包含其子树中最大关键字。

由于以上不同点，B+树有如下特性：
1. 所有关键字都出现在叶子结点的链表中（稠密索引），且链表中的关键字恰好是有序的；
2.不可能在非叶子结点命中；
3.非叶子结点相当于是叶子结点的索引（稀疏索引），叶子结点相当于是存储（关键字）数据的数据层；
4.更适合文件索引系统

## B+树的查找
B+树的一次查找路径，最多不超过`log(n/2)(N)`, 二叉搜索树则为`log2(N)`.
B+树节点大小一般等于磁盘块大小，通常为4KB。
如果搜索码的大小为12字节，磁盘指针大小为8字节，那么n约为200；
更保守的估计，搜索码的大小为32字节，磁盘指针大小为8字节，那么n约为100；
在n=100的情况下，若搜索码共有一百万个，一次查找也只需要访问`log50（1000000）= 4`个节点，
即只需要读4个磁盘块，若考虑缓冲区则更少。

## B+树插入一个元素的过程
1. 找到需要插入的节点，如果该节点中已没有插入搜索码所需要的空间，则将叶节点分裂为两个，
   即将其中前`n/2(上取整)`放在原来的节点，剩下的放入新节点
2. 分裂一个节点后，新节点的最小元素作为搜索码的值，插入原节点的父节点中
3. 若父节点没有足够的空间容纳新的搜索码，则必须继续分裂
4. 最坏的情况下，从叶节点到根节点的路径上所有的节点必须分裂，如果根节点分裂了，则树的深度加大

注意：B+树保证节点半满，如果以随机顺序插入，那么节点平均情况下会比2/3更满，如果是以有序的方式插入，节点将会**仅仅半满**

## B+树删除一个元素的过程
B树（n阶）必须保证节点半满，即至少含有`(n - 1)/2 (上取整)`个搜索码。
如果删除后节点太小，根据相邻节点的搜索码数量，可能是将该节点合并入相邻节点，也可能在两个节点间重新分配索引，
这个删除导致删除算法的递归调用，直到树的根节点。

##　为什么说B+tree比B树更适合实际应用中操作系统的文件索引和数据库索引？

1. B+tree的磁盘读写代价更低：B+tree的内部结点并没有指向关键字具体信息的指针(红色部分)，因此其内部结点相对B 树更小。
   如果把所有同一内部结点的关键字存放在同一盘块中，那么盘块所能容纳的关键字数量也越多。一次性读入内存中的需要查找的关键字也就越多，相对来说IO读写次数也就降低了；

2. B+tree的查询效率更加稳定：由于内部结点并不是最终指向文件内容的结点，而只是叶子结点中关键字的索引，所
   以任何关键字的查找必须走一条从根结点到叶子结点的路。所有关键字查询的路径长度相同，导致每一个数据的查询效率相当；
   （存疑，b树虽然不稳定但是路径都更短，此优点应该是对比BST得出）

3. 数据库索引采用B+树而不是B树的主要原因：B+树只要遍历叶子节点就可以实现整棵树的遍历，而且在数据库中基于**范围的查询**是非常频繁的，而B树只能中序遍历所有节点，效率太低。


## MyIASM和Innodb两种引擎所使用的索引的数据结构
MyIASM和Innodb两种引擎所使用的索引都为B+树.
* MyIASM引擎，B+树的数据结构中存储的内容实际上是实际数据的地址值。也就是说它的索引和实际数据是分开的，只不过使用索引指向了实际数据。这种索引的模式被称为非聚集索引。
* Innodb引擎的索引的数据结构也是B+树，每一个innodb的表有一个特殊的索引叫聚集索引(clustered index, 也就是主索引), 该索引数据结构中存储的都是实际的数据.
  Innodb中的非主索引都是二级索引(secondary indexes),每一个Secondary Index的记录中除了索引列的值之外，还包含主健值。通过二级索引查询首先查到是主键值，
  然后InnoDB再根据查到的主键值通过主键/聚簇索引找到相应的数据块（此过程称为**回表**）.如果主键过长，二级索引就需要更大的空间，因此，推荐使用比较小的主键列.
  
## 索引条件下推 Index Condition Pushdown
如二级索引(b,c,d), 查询语句`where b=1 and d=1`, 在mysql5.7之前，索引走到b=1之后就会触发回表，然后拿到所有数据之后再判断d的值，
5.7之后会先根据二级索引里面的d值做判断，先筛选掉一部分数据再回表，此过程称为**索引条件下推**；
可以使用explain语句然后查看Extra字段看出区别`Using where`, `Using index condition`(使用了下推)

## innodb索引页物理结构
当新的记录插入到**聚簇索引**中时，innodb会尝试将页面的1/16留空以供将来的插入和更新索引记录。
如果以顺序（升序或降序）来插入索引记录，则生成的索引页大约为15/16满。如果索引记录是随机插入，页面从1/2到15/16满。

innodb在创建或重建B树索引时执行批量加载.这种索引构建方法称之为排序索引构建。`innodb_fill_factor`定义在排序索引构建期间填充的每个B树页面上的空间百分比，
剩余空间为未来索引增长保留。设置为100的innodb_fill_factor将留下聚集索引页中1/16的空间，以供将来索引增长。

在创建实例之前你可以通过设置innodb_page_size配置选项来配置mysql实例中所有innodb表空间的页大小。一旦设置了实例的页面大小，你就无法更改它。
支持的大小对应选项值为64k，32k，16k，8k，4k，16K是默认设置大小。

## InnoDB表最好要用自增列做主键
* 如果我们定义了主键(PRIMARY KEY), 那么InnoDB会选择主键作为聚集索引、如果没有显式定义主键，则InnoDB会选择第一个不包含有NULL值的唯一索引作为主键索引、
  如果也没有这样的唯一索引，则InnoDB会选择内置6字节长的ROWID作为隐含的聚集索引(ROWID随着行记录的写入而主键递增，这个ROWID不像ORACLE的ROWID那样可引用，是隐含的)。

* 数据记录本身被存于**主索引**（聚集索引,一颗B+Tree）的叶子节点上, 这就要求同一个叶子节点内（大小为一个内存页或磁盘页）的各条数据记录按主键顺序存放，
  因此每当有一条新的记录插入时，MySQL会根据其主键将其插入适当的节点和位置，如果页面达到装载因子（InnoDB默认为15/16），则开辟一个新的页（节点）

* 如果表使用自增主键, 那么每次插入新的记录，记录就会顺序添加到当前索引节点的后续位置，当一页写满，就会自动开辟一个新的页

* 如果使用非自增主键（如果身份证号或学号等）, 由于每次插入主键的值近似于随机，因此每次新纪录都要被插到现有索引页得中间某个位置，
  此时MySQL不得不为了将新记录插到合适位置而移动数据，甚至目标页面可能已经被回写到磁盘上而从缓存中清掉，此时又要从磁盘上读回来，
  这增加了很多开销，同时频繁的移动、分页操作造成了大量的碎片，得到了不够紧凑的索引结构，后续不得不通过OPTIMIZE TABLE来重建表并优化填充页面。

总结：如果InnoDB表的数据写入顺序能和B+树索引的叶子节点顺序一致的话，这时候存取效率是最高的，也就是下面这几种情况的存取效率最高：

1. 使用自增列(INT/BIGINT类型)做主键，这时候写入顺序是自增的，和B+数叶子节点分裂顺序一致；

2. 该表不指定自增列做主键，同时也没有可以被选为主键的唯一索引(上面的条件)，这时候InnoDB会选择内置的ROWID作为主键，写入顺序和ROWID增长顺序一致；

3. 如果一个InnoDB表又没有显示主键，又有可以被选择为主键的唯一索引，但该唯一索引可能不是递增关系时(例如字符串、UUID、多字段联合唯一索引的情况)，该表的存取效率就会比较差。


## InnoDB逻辑存储结构
* 表空间Tablespace（ibd文件）
* 段Segment（一个索引2个段）
* 区Extent（1MB）：64个Page
* 页Page（16KB）：磁盘管理的最小单位
  * 一个B+树节点就是一个页（16KB）
  * 页的编号可以映射到物理文件偏移
  * B+树叶子节点前后形成双向链表
* 行Row
* 字段Field
[InnoDB逻辑存储结构](https://www.jianshu.com/p/1573c4dcecd6)

## 数据库的锁机制

## 数据库的优化 最好不要设置null值 避免sql语句中进行计算 避免in ，导致全表扫描

## 数据库列有索引， 什么时候不使用索引
* 如果MySQL估计使用索引比全表扫描慢，则不使用索引，例如，如果列key均匀分布在1和100之间，下面的查询使用索引就不是很好：select * from table_name where key>1 and key<90;
* 用or分隔开的条件，如果or前的条件中的列有索引，而后面的列没有索引，那么涉及到的索引都不会被用到，
  例如：select * from table_name where key1='a' or key2='b';如果在key1上有索引而在key2上没有索引，则该查询也不会走索引
* 复合索引，如果索引列不是复合索引的第一部分，则不使用索引（即不符合最左前缀），
  例如，复合索引为(key1,key2),则查询select * from table_name where key2='b';将不会使用索引
* 如果like是以‘%’开始的，则该列上的索引不会被使用。例如select * from table_name where key1 like '%a'；
  该查询即使key1上存在索引，也不会被使用
* 数据类型出现隐式转换的时候不会使用索引，如果列为字符串，则where条件中必须将字符常量值加引号，否则即使该列上存在索引，也不会被使用。
  例如,select * from table_name where key1=1;如果key1列保存的是字符串，即使key1上有索引，也不会被使用。

## explain
Explain命令在解决数据库性能上是第一推荐使用命令
Explain语法：`explain select … from … [where …]`
返回结果`id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |`

possible_keys: 可能使用的索引，有时查询语句虽然有可以使用的索引，但是mysql判断走全表扫描可能更快时会使用`type=ALL`，即不使用索引；
   有时可能有多个索引匹配到，但只需要走一个索引；

key： 真正使用的索引，可能有多个，如or语句

key_len： 使用了索引里面字段的字节长度， 可以用来查看最左匹配原则匹配到几个

type：这列最重要，显示了连接使用了哪种类别,有无使用索引，是使用Explain命令分析性能瓶颈的关键项之一。结果值从好到坏依次是：
`system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL`
一般来说，得保证查询至少达到range级别，最好能达到ref，否则就可能会出现性能问题。

ALL：Full Table Scan， MySQL将遍历全表以找到匹配的行

index: Full Index Scan，index与ALL区别为index类型只遍历索引树

range:只检索给定范围的行，使用一个索引来选择行

ref: 表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值

eq_ref: 类似ref，区别就在使用的索引是唯一索引，对于每个索引键值，表中只有一条记录匹配，简单来说，就是多表连接中使用primary key或者 unique key作为关联条件

const、system: 当MySQL对查询某部分进行优化，并转换为一个常量时，使用这些类型访问。如将主键置于where列表中，MySQL就能将该查询转换为一个常量，
system是const类型的特例，当查询的表只有一行的情况下，使用system

NULL: MySQL在优化过程中分解语句，执行时甚至不用访问表或索引，例如从一个索引列里选取最小值可以通过单独索引查找完成。

## profile
show profile和show Profiles都是不建议使用的，在mysql后期的版本中可能会被删除；
官网建议使用Performance Schema（运行时实时检查server的内部执行情况）
```sql
set profiling=1;  				//打开分析
run your sql1;
run your sql2;
show profiles;					//查看sql1,sql2的语句分析
show profile for query 1;		//查看sql1的具体分析
show profile ALL for query 1;	//查看sql1相关的所有分析【主要看i/o与cpu,下边分析中有各项意义介绍】
set profiling=0;
```
可以查看sql语句中各个步骤的执行时间，cpu用户/系统的占用
starting：开始
checking permissions：检查权限
Opening tables：打开表
init ： 初始化
System lock ：系统锁
optimizing ： 优化
statistics ： 统计
preparing ：准备
executing ：执行
Sending data ：发送数据
Sorting result ：排序
end ：结束
query end ：查询 结束
closing tables ： 关闭表 ／去除TMP 表
freeing items ： 释放物品
cleaning up ：清理

## Q & A
* binlog,redolog,undolog都是什么, 起什么作用
* 一张表最多可以有几个索引？ 16

## 参考
* [浅入深出MySQL中事务的实现](https://draveness.me/mysql-transaction)
* [MySQL索引背后的数据结构及算法原理](https://www.kancloud.cn/kancloud/theory-of-mysql-index/41856)
* [B树，B-树，B+树，B*树，位图索引，Hash索引](http://blog.csdn.net/wl044090432/article/details/53423333)