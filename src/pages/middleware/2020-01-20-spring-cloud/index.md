---
title: Spring Cloud
date: "2020-01-010T22:22:22.169Z"
path:  "/spring-cloud"
tags:
   - distributed
---

## Ribbon和Feign的区别： 
Ribbon和Feign都是用于调用其他服务的，不过方式不同。
   1.启动类使用的注解不同，Ribbon用的是@RibbonClient，Feign用的是@EnableFeignClients。
   2.服务的指定位置不同，Ribbon是在@RibbonClient注解上声明，Feign则是在定义抽象方法的接口中使用@FeignClient声明。
   3.调用方式不同，Ribbon需要自己构建http请求，模拟http请求然后使用RestTemplate发送给其他服务，步骤相当繁琐。Feign则是在Ribbon的基础上进行了一次改进，采用接口的方式，将需要调用的其他服务的方法定义成抽象方法即可，
   不需要自己构建http请求。不过要注意的是抽象方法的注解、方法签名要和提供服务的方法完全一致。
   
## Q & A
[SpringBoot和SpringCloud面试题](https://swenfang.github.io/2019/05/12/%E9%9D%A2%E8%AF%95%E6%80%BB%E7%BB%93/SpringBoot%E5%92%8CSpringCloud%E9%9D%A2%E8%AF%95%E9%A2%98/)
[Spring Cloud底层原理](https://juejin.im/post/5be13b83f265da6116393fc7)