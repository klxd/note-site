---
title: Spring Boot学习笔记
date: "2018-02-03T22:22:22.169Z"
path:  "/spring-boot"
tags:
   - spring
---

## 数据库连接池
Spring Boot 2默认的数据库连接池由Tomcat换成HikariCP
```properties
# Hikari will use the above plus the following to setup connection pooling
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.maximum-pool-size=15
spring.datasource.hikari.auto-commit=true
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.pool-name=DatebookHikariCP
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.connection-test-query=SELECT 1
```

## 常用注解

## 如何启动

## 端口信息如何配置

## spring boot中对数据库乐观锁的支持(@version注解)