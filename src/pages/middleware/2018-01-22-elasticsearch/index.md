---
title: Elasticsearch学习笔记
date: "2018-01-22T22:22:22.169Z"
path:  "/elasticsearch-note"
tags:
   - middleware
---

## Lucene
Elasticsearch是一个基于Apache Lucene(TM)的开源搜索引擎,
Lucene只是一个库,想要使用它,你必须使用Java来作为开发语言并将其直接集成到你的应用中

## 集群和节点
节点(node)是一个运行着的Elasticsearch实例,
集群(cluster)是一组具有相同cluster.name的节点集合,
他们协同工作,共享数据并提供故障转移和扩展功能.
同一个局域网中,cluster.name相同的节点会自动组成一个集群

## 概念映射
Relational DB -> Databases -> Tables -> Rows -> Columns
Elasticsearch -> Indices   -> Types  -> Documents -> Fields

## Java API

### 节点客户端 (node client)
节点客户端以无数据节点的身份加入集群,它自己不存储任何数据,但是它知道数据在集群中
的具体位置,并且能够直接转发请求到对应的节点上.

### 传输客户端 (transport client)
这个更轻量级的客户端能发送请求到远程集群,它自己不加入集群,只是简单转发请求
给集群中的节点. 将在7.0版本中被弃用,计划在8.0版本删除. 

```java
Settings settings = Settings.builder()
        .put("cluster.name", "myClusterName")
        .put("client.transport.sniff", true)
        .build();
TransportClient client = new PreBuiltTransportClient(settings)
        .addTransportAddress(new TransportAddress(InetAddress.getByName("host1"), 9300))
        .addTransportAddress(new TransportAddress(InetAddress.getByName("host2"), 9300));
```
```client.transport.sniff```参数可以打开嗅探功能,该功能可以动态地自动添加或删除节点.
打开该功能后,client仅会保存数据节点(data node).有可能不包含最开始设置的节点.
仅包含数据节点可以避免发送搜索请求到master节点

### Document API
#### Index API
ES中的document为JSON格式,通常Java中构造JSON的方法有以下几种
* 手动拼接出String或者byte[]格式的JSON
* 使用一个Map并调用其toString方法
* 使用第三方库如Jackson来序列化
* 使用ES内置的XContentFactory.jsonBuilder()

#### Get API


## 更新文档
文档在Elasticsearch中是不可变的
update这个API似乎	允许你修改文档的局部,但事实上Elasticsearch
遵循与之前所说完全相同的过程,这个过程如下:
1. 从旧文档中检索JSON
2. 修改它
3. 删除旧文档
4. 索引新文档
唯一的不同是update API完成这一过程只需要一个客户端请求既可,
不再需要get和index请求了。

## 批量请求

整个批量请求需要被加载到接受我们请求节点的内存里,所以请求越大,给其它请求可用的内存就越小。有一个最佳
的 	bulk	 请求大小。超过这个大小,性能不再提升而且可能降低。
最佳大小,当然并不是一个固定的数字。它完全取决于你的硬件、你文档的大小和复杂度以及索引和搜索的负载。幸运的
是,这个最佳点(sweetspot)还是容易找到的:
试着批量索引标准的文档,随着大小的增长,当性能开始降低,说明你每个批次的大小太大了。开始的数量可以在
1000~5000个文档之间,如果你的文档非常大,可以使用较小的批次。
通常着眼于你请求批次的物理大小是非常有用的。一千个1kB的文档和一千个1MB的文档大不相同。一个好的批次最好保持
在5-15MB大小间。

## 排序

## 分布式搜索



## Question
* es搜索时的记分算法
* Lucene底层实现原理，它的索引结构

## 参考
[Elasticsearch官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
[ElasticSearch 内部机制浅析](http://leonlibraries.github.io/tags/%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2/)