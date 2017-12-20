webpackJsonp([0x75b9f6ddc7733400],{"./node_modules/json-loader/index.js!./.cache/json/cassandra.json":function(n,l){n.exports={data:{site:{siteMetadata:{title:"Note Site",author:"stone"}},markdownRemark:{id:"/home/peng/develop/workspace/stone-site/src/pages/2017-11-29-cassandra/index.md absPath of file >>> MarkdownRemark",html:'<p>使用Cassandra已经有一段时间了,但是平时使用的都是公司内部封装好的接口,对Cassandra的特性并不会暴露太多,\n现在在这里总结一下.</p>\n<h2 id="acid"><a href="#acid" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>ACID</h2>\n<ul>\n<li>\n<p>原子性(Atomic)</p>\n<ul>\n<li>执行一个语句时,事务中的每个更新都必须成功才能称为成功</li>\n</ul>\n</li>\n<li>\n<p>一致性(Consistent)</p>\n<ul>\n<li>数据必须从一个正确的状态转移到另一个正确的状态</li>\n</ul>\n</li>\n<li>\n<p>隔离性(Isolated)</p>\n<ul>\n<li>并发执行的事务不应该彼此依赖</li>\n</ul>\n</li>\n<li>\n<p>持久性(Durable)</p>\n<ul>\n<li>一旦一个事务成功完成,变更就不再丢失</li>\n</ul>\n</li>\n</ul>\n<h2 id="cap理论"><a href="#cap%E7%90%86%E8%AE%BA" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>CAP理论</h2>\n<ul>\n<li>\n<p>一致性(Consistent)</p>\n<ul>\n<li>对于所有的数据库客户端使用同样的查询都可以得到同样的结果,\n即使是有并发更新的时候也是如此</li>\n</ul>\n</li>\n<li>\n<p>可用性(Availability)</p>\n<ul>\n<li>所有的数据库客户端总是可以读写数据</li>\n</ul>\n</li>\n<li>\n<p>分区耐受性(Partition Tolerance)</p>\n<ul>\n<li>数据库可以分散到多台机器上,即使发生网络故障,被分成多个分区,\n依然可以提供服务\nCAP理论:对于任意给定的系统,只能强化这三个特性中的两个.</li>\n</ul>\n</li>\n<li>\n<p>CA</p>\n<ul>\n<li>主要支持一致性和可用性,很可能使用了两阶段提交的分布式事务,如果网络\n发生分裂,那么系统可能停止响应</li>\n<li>关系型数据库,MySQL,Postgres</li>\n</ul>\n</li>\n<li>\n<p>CP</p>\n<ul>\n<li>主要支持一致性和分区耐受性,通过设置数据分片来提升可扩展性,数据将保持\n一致性,但是如果有节点发生故障,仍有部分数据不可用</li>\n<li>MongoDB,HBase,Redis</li>\n</ul>\n</li>\n<li>\n<p>AP</p>\n<ul>\n<li>主要支持可用性和分区耐受性,系统可能返回不太精确的数据,但是系统将始终\n可用,即使网络发生分区的时候也是如此</li>\n<li>亚马逊Dynamo的衍生品,Cassandra</li>\n</ul>\n</li>\n</ul>\n<h2 id="base模型"><a href="#base%E6%A8%A1%E5%9E%8B" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>BASE模型</h2>\n<ul>\n<li>Basically Available: 基本可用,允许分区失败</li>\n<li>Soft state: 软状态,接收一段时间的状态不同步</li>\n<li>Eventually consistent: 最终一致,保证最终数据的状态是一致的</li>\n</ul>\n<h2 id="cassandra与rdb的对比"><a href="#cassandra%E4%B8%8Erdb%E7%9A%84%E5%AF%B9%E6%AF%94" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Cassandra与RDB的对比</h2>\n<table>\n<thead>\n<tr>\n<th align="right">RDB</th>\n<th align="left">column1</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="right">database</td>\n<td align="left">keyspace</td>\n</tr>\n<tr>\n<td align="right">table</td>\n<td align="left">column family</td>\n</tr>\n<tr>\n<td align="right">primary key</td>\n<td align="left">row key</td>\n</tr>\n<tr>\n<td align="right">column name</td>\n<td align="left">column name/key</td>\n</tr>\n<tr>\n<td align="right">column value</td>\n<td align="left">column value</td>\n</tr>\n</tbody>\n</table>\n<ul>\n<li>Cassandra没有引用完整性,因而没有join的概念和联级删除的概念</li>\n<li>无法自由地对列进行搜索(SQL中的where语句)</li>\n<li>RDB先对数据进行建模,然后写查询方法;Cassandra应先定义好查询,然后围绕查询来组织数据</li>\n<li>Cassandra中没有update查询</li>\n<li>不支持服务端事务,必须手工回滚</li>\n</ul>\n<h2 id="cassandra的数据模型"><a href="#cassandra%E7%9A%84%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Cassandra的数据模型</h2>\n<ul>\n<li>\n<p>集群(cluster): Cassandra数据库系统是由多个节点组成的一个集群,有时也叫做环(ring)</p>\n</li>\n<li>\n<p>keyspace :集群是keyspace的容器,里面通常只有一个keyspace</p>\n<ul>\n<li>可以针对keyspace设置的基本属性有一下几个</li>\n<li>副本因子(Replication factor): 每行数据会被复制到多少个节点上</li>\n<li>副本放置策略(Replica placement strategy): 副本如何放置到环上</li>\n<li>列族 </li>\n</ul>\n</li>\n<li>\n<p>列族(column family): 容纳一组<em>有序行</em>的容器,每行都包含一组<em>有序</em>的列</p>\n<ul>\n<li>cassandra定义了列族但是没定义列,可以随意在任意列族中添加任意的列</li>\n<li>列族有两个属性: 名称和比较器</li>\n<li>向列族中写数据的时候，需要指定行键值(row key),类似于关系型数据库中的主键</li>\n</ul>\n</li>\n<li>\n<p>列(column): Cassandra数据模型中最基本的数据结构单元</p>\n<ul>\n<li>列由名称,值和时间戳组成的三元组,行没有时间戳,每个单独的列才有时间戳</li>\n<li>Cassandra中不需要预先定义列,所有列的名字都是由客户端提供的</li>\n<li>列的排序,Cassandra返回给客户端的结果可以指定列的名字如何进行比较和排序</li>\n</ul>\n</li>\n</ul>\n<h2 id="一致性级别"><a href="#%E4%B8%80%E8%87%B4%E6%80%A7%E7%BA%A7%E5%88%AB" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>一致性级别</h2>\n<ul>\n<li>\n<p>读一致性级别</p>\n<ul>\n<li><em>ONE</em>, 当一个节点响应查询时,立刻返回该响应的值.同时创建一个后台线程,检查这个记录的其他副本,\n如果哪个副本已经过期了,接下来就会进行读时修复,以确保所有的副本都拥有最新的值</li>\n<li><em>QUORUM</em>, 查询所有节点,当大部分副本((副本因子/2)+1)返回的时候,把时间戳最新的值返回,\n之后在后台进行必要的读修复</li>\n<li><em>ALL</em>, 查询所有节点,等待所有节点响应,并把时间戳最新的记录返回给客户端,之后进行必要的读修复.\n如果有任何节点没有响应(响应超时时间由rpc<em>timeout</em>in_ms决定,默认是10秒),读操作都会失败</li>\n</ul>\n</li>\n<li>\n<p>写一致性级别</p>\n<ul>\n<li><em>ZERO</em> 在写数据被记录之前的返回,写操作将会在后台线程中异步完成,无法确保一定成功</li>\n<li><em>ANY</em> 保证数据至少已经写到一个节点上了,提示(hint)也被看做是一个成功的写入</li>\n<li><em>ONE</em> 保证在返回时,数据至少已经写入到一个节点的commit log和memtable中了</li>\n<li><em>QUORUM</em> 保证多数副本((副本因子/2)+1)已经接收到数据</li>\n<li><em>ALL</em> 保证在返回时副本因子指定数量的节点都接收到了数据.如果某个副本对写操作无响应,则写操作会失败</li>\n</ul>\n</li>\n</ul>\n<h2 id="cassandra的架构"><a href="#cassandra%E7%9A%84%E6%9E%B6%E6%9E%84" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Cassandra的架构</h2>\n<ul>\n<li>\n<p>system keyspace</p>\n<ul>\n<li>名字为system的内部keyspace,无法手工修改</li>\n<li>存储关于集群的原数据</li>\n</ul>\n</li>\n<li>\n<p>对等结构</p>\n<ul>\n<li>Cassandra没有主节点的概念,所有节点的地位都彼此相同</li>\n<li>任意节点掉线只会影响系统的整体吞吐能力,不会中断服务</li>\n<li>如果使用了合理的副本复制策略,故障节点上的所有数据仍然可以被读写</li>\n</ul>\n</li>\n<li>\n<p>gossip与故障检测</p>\n<ul>\n<li>Cassandra使用了gossip(流言)协议在进行环内通信,这样每个节点都会有其他节点的<strong>状态</strong>信息</li>\n</ul>\n</li>\n<li>\n<p>逆熵与读修复</p>\n<ul>\n<li>逆熵(anti-entropy)是Cassandra的副本同步机制,用于保障不同节点上的数据都更新到最新的版本</li>\n<li>读取数据时,基于用户指定的一致性级别,一定数量的节点会被读取,在没有达到客户端指定的一致性级别前,\n读操作是阻塞的.如果Cassandra检测到某些响应节点持有的是过时的数据,在数据返回之后,Cassandra\n会在后台进行一个<strong>读修复</strong>的过程,用于更新过时的数据</li>\n</ul>\n</li>\n<li>\n<p>墓碑</p>\n<ul>\n<li>当你执行一个删除操作时,数据并不会被立刻删除,而会进行一个更新操作,在相应的值上面放一个墓碑</li>\n<li>当执行压紧时,比墓碑更老的内容都会被清除,墓碑本身不会删除</li>\n<li>垃圾回收时延,默认是10天.一旦墓碑的寿命超过这个时间,墓碑将会被删除.\n设计这个时延的目的是留下足够长的时间以便于回复数据,如果一个节点的宕机时间超过这个时间点,那么应该被替换掉</li>\n</ul>\n</li>\n</ul>',tableOfContents:'<ul>\n<li><a href="#acid">ACID</a></li>\n<li><a href="#cap%E7%90%86%E8%AE%BA">CAP理论</a></li>\n<li><a href="#base%E6%A8%A1%E5%9E%8B">BASE模型</a></li>\n<li><a href="#cassandra%E4%B8%8Erdb%E7%9A%84%E5%AF%B9%E6%AF%94">Cassandra与RDB的对比</a></li>\n<li><a href="#cassandra%E7%9A%84%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B">Cassandra的数据模型</a></li>\n<li><a href="#%E4%B8%80%E8%87%B4%E6%80%A7%E7%BA%A7%E5%88%AB">一致性级别</a></li>\n<li><a href="#cassandra%E7%9A%84%E6%9E%B6%E6%9E%84">Cassandra的架构</a></li>\n</ul>',frontmatter:{title:"Cassandra基础知识",date:"November 29, 2017",tags:["middleware","database"]}}},pathContext:{path:"/cassandra"}}}});
//# sourceMappingURL=path---cassandra-c2ec1f1e52dfe030e280.js.map