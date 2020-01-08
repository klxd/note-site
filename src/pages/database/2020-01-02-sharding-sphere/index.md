---
title: sharding sphere
date: "2018-02-02T22:22:22.169Z"
path:  "/sharding-sphere"
tags:
   - database
---

## Sharding-JDBC
Sharding-JDBC 被定位为轻量级 Java 框架，在 Java 的 JDBC 层提供的额外服务。它使用客户端直连数据库，
以 jar 包形式提供服务，无需额外部署和依赖，可理解为增强版的 JDBC 驱动，完全兼容 JDBC 和各种 ORM 框架。

* 适用于任何基于 Java 的 ORM 框架，如：JPA、Hibernate、Mybatis、Spring JDBC Template 或直接使用 JDBC。
* 基于任何第三方的数据库连接池，如：DBCP、C3P0、BoneCP、Druid、HikariCP 等。
* 支持任意实现 JDBC 规范的数据库。目前支持 MySQL、Oracle、SQLServer 和 PostgreSQL。

## Sharding-Proxy
定位为透明化的数据库代理端，提供封装了数据库二进制协议的服务端版本，用于完成对异构语言的支持。 
目前先提供MySQL/PostgreSQL版本，它可以使用任何兼容MySQL/PostgreSQL协议的访问客户端
(如：MySQL Command Client, MySQL Workbench, Navicat等)操作数据，对DBA更加友好。
   
* 向应用程序完全透明，可直接当做MySQL/PostgreSQL使用。
* 适用于任何兼容MySQL/PostgreSQL协议的的客户端。

Sharding-JDBC属于client层的分库分表解决方案, 
而Sharding-proxy和mycat这种proxy层方案对于各个项目client是透明的, 但缺点在于需要部署，自己及运维一套中间件，运维成本高.


## 分布式主键
ShardingSphere 提供了内置的分布式主键生成器，例如 UUID、SNOWFLAKE 等分布式主键生成器，用户仅需简单配置即可使用，生成全局性的唯一自增 ID。

## 业务分片键值注入
通过解析 SQL 语句提取分片键列与值并进行分片，是 ShardingSphere 对 SQL 零侵入的实现方式。
   
若 SQL 语句中没有分片条件，则无法进行分片，需要全路由。在一些应用场景中，分片条件并不存在于 SQL，而存在于外部业务逻辑。因此需要提供一种通过外部指定分片结果的方式，在 ShardingSphere 中叫做 Hint。
   
ShardingSphere 使用 ThreadLocal 管理分片键值。可以通过编程的方式向 HintManager 中添加分片条件，该分片条件仅在当前线程内生效。
   
除了通过编程的方式使用强制分片路由，ShardingSphere 还计划通过 SQL 中的特殊注释的方式引用 Hint，使开发者可以采用更加透明的方式使用该功能。指定了强制分片路由的 SQL 将会无视原有的分片逻辑，直接路由至指定的真实数据节点。

## 分布式事务

### 本地事务

完全支持非跨库事务，例如：仅分表，或分库但是路由的结果在单库中。

完全支持因逻辑异常导致的跨库事务。例如：同一事务中，跨两个库更新。更新完毕后，抛出空指针，则两个库的内容都能回滚。

不支持因网络、硬件异常导致的跨库事务。例如：同一事务中，跨两个库更新，更新完毕后、未提交之前，第一个库宕机，则只有第二个库数据提交。

### 两阶段事务-XA
支持数据分片后的跨库XA事务
两阶段提交保证操作的原子性和数据的强一致性
服务宕机重启后，提交/回滚中的事务可自动恢复
SPI机制整合主流的XA事务管理器，默认Atomikos，可以选择使用Narayana和Bitronix
同时支持XA和非XA的连接池
提供spring-boot和namespace的接入端

不支持项: 服务宕机后，在其它机器上恢复提交/回滚中的数据

## 配置
基于Spring boot的规则配置properties
```properties
spring.shardingsphere.datasource.names=ds0,ds1

spring.shardingsphere.datasource.ds0.type=org.apache.commons.dbcp2.BasicDataSource
spring.shardingsphere.datasource.ds0.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.ds0.url=jdbc:mysql://localhost:3306/ds0
spring.shardingsphere.datasource.ds0.username=root
spring.shardingsphere.datasource.ds0.password=

spring.shardingsphere.datasource.ds1.type=org.apache.commons.dbcp2.BasicDataSource
spring.shardingsphere.datasource.ds1.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.ds1.url=jdbc:mysql://localhost:3306/ds1
spring.shardingsphere.datasource.ds1.username=root
spring.shardingsphere.datasource.ds1.password=

spring.shardingsphere.sharding.default-database-strategy.inline.sharding-column=user_id
spring.shardingsphere.sharding.default-database-strategy.inline.algorithm-expression=ds$->{user_id % 2}

spring.shardingsphere.sharding.tables.t_order.actual-data-nodes=ds$->{0..1}.t_order$->{0..1}
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.sharding-column=order_id
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.algorithm-expression=t_order$->{order_id % 2}

spring.shardingsphere.sharding.tables.t_order_item.actual-data-nodes=ds$->{0..1}.t_order_item$->{0..1}
spring.shardingsphere.sharding.tables.t_order_item.table-strategy.inline.sharding-column=order_id
spring.shardingsphere.sharding.tables.t_order_item.table-strategy.inline.algorithm-expression=t_order_item$->{order_id % 2}
```

```yaml
sharding.jdbc:
  datasource:
    names: ds0
    ds0:
      type: com.zaxxer.hikari.HikariDataSource
      driver-class-name: com.mysql.jdbc.Driver
      jdbcUrl: jdbc:mysql://localhost:3306/ds0
      username: root
      password:
  config:
    sharding:
      tables:
        t_order_item:
          actual-data-nodes: ds0.t_order_item->{0..32}
          table-strategy.inline:
            sharding-column: id
            algorithm-expression: t_order_item->{(long)(id/100) % 32}
    props.sql.show: true
```

##
```xml
<dependency>
    <groupId>io.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>3.1.0</version>
</dependency>
```


[谈谈分库分表](https://zhuanlan.zhihu.com/p/54921615)
[Sharding-JDBC简介](https://www.jianshu.com/p/60960deed354)