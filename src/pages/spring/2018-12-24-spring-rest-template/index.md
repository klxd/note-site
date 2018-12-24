---
title: Spring RestTemplate学习笔记
date: "2018-12-24T22:22:22.169Z"
path:  "/spring-rest-template"
tags:
   - spring
---

## 简介
RestTemplate是Spring生态下常用的访问REST接口的类,
它在http-client库上提供了一个高级别的API.

## 实例化
默认的无参构造函数会使用`java.net.HttpURLConnection`来构造请求,
通过传入不同实现的`ClientHttpRequestFactory`可以使用不同的HTTP库,默认支持一下三种库
* Apache HttpComponents
* Netty
* OkHttp

如使用Apache HttpComponents,可以这样构造RestTemplate
```java
RestTemplate template = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
```

