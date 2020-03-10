---
title: Mybatis整合Spring
date: "2018-12-24T22:22:22.169Z"
path:  "/spring-mybatis"
tags:
   - spring
---

## SqlSession & SqlSessionFactory

## Mapper
* `session.getMapper(SomeMapper.class)`, 此步骤中调用jdk动态代理实例化了mapper对象
* jdk动态代理, `InvocationHandler.invoke(Object proxy, Method method, Object[] args)`中有method参数，
  可以拿到mapper类中声明的`@Select`注解中的sql语句，再使用sqlSession执行
 
## 实例化后的Mapper如何交给spring管理
* 利用注解`@MapperScan`, 其中利用`@Import(MapperScannerRegistrar.class)`,
* MapperScannerRegistrar实现了spring提供的ImportBeanDefinitionRegistrar接口, 可以注册BeanDefinition
* MapperScannerRegistrar中创建了ClassPathMapperScanner用于扫描mapper, 该类扩展自spring提供的ClassPathBeanDefinitionScanner类
* MapperFactoryBean实现了FactoryBean的接口，可以避免多次new Bean

## Q & A
应用
* Config, Sql, Mapper配置，有几种注册mapper的方法，优先级如何
* mybatis的一级缓存，二级缓存，为啥二级缓存是鸡肋
* mapper的实现, 编写sql的三种方式
* 如何利用mybatis源码来扩展插件

源码
* MapperScan的源码分析
* mybatis如何扩展spring的扫描器， 扫描完之后如何利用factoryBean
* Mybatis底层如何把一个代理对象放到spring容器中,用到spring的那些知识
* mybatis和spring核心接口ImportBeanDefinitionRegister的关系
* mybatis的一级缓存为什么失效, spring为什么让其失效，如何解决
* mybatis的执行流程, 什么时候进行缓存
* mybatis中方法名为什么需要和mapper中的id一致