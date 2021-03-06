---
title: 网络安全
date: "2018-02-08T22:22:22.169Z"
path:  "/web-security"
tags:
- java
---

## CSRF (Cross-site request forgery)

跨站请求伪造

### 原理

跨站请求攻击，简单地说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并执行一些操作（如发邮件，发消息，甚至财产操作如转账和购买商品）。
由于浏览器曾经认证过，所以被访问的网站会认为是真正的用户操作而去执行。
这利用了web中用户身份验证的一个漏洞：简单的身份验证只能保证请求发自某个用户的浏览器，却不能保证请求本身是用户自愿发出的。

### 如何防御

* 检查Referer字段

HTTP头中有一个Referer字段，这个字段用以标明请求来源于哪个地址。在处理敏感数据请求时，通常来说，Referer字段应和请求的地址位于同一域名下。
以上文银行操作为例，Referer字段地址通常应该是转账按钮所在的网页地址，应该也位于www.examplebank.com之下。
而如果是CSRF攻击传来的请求，Referer字段会是包含恶意网址的地址，不会位于www.examplebank.com之下，这时候服务器就能识别出恶意的访问。

这种办法简单易行，工作量低，仅需要在关键访问处增加一步校验。但这种办法也有其局限性，因其完全依赖浏览器发送正确的Referer字段。
虽然http协议对此字段的内容有明确的规定，但并无法保证来访的浏览器的具体实现，亦无法保证浏览器没有安全漏洞影响到此字段。
并且也存在攻击者攻击某些浏览器，篡改其Referer字段的可能。

* 添加校验token

由于CSRF的本质在于攻击者欺骗用户去访问自己设置的地址，所以如果要求在访问敏感数据请求时，要求用户浏览器提供不保存在cookie中，
并且攻击者无法伪造的数据作为校验，那么攻击者就无法再执行CSRF攻击。这种数据通常是表单中的一个数据项。
服务器将其生成并附加在表单中，其内容是一个伪乱数。当客户端通过表单提交请求时，这个伪乱数也一并提交上去以供校验。
正常的访问时，客户端浏览器能够正确得到并传回这个伪乱数，而通过CSRF传来的欺骗性攻击中，攻击者无从事先得知这个伪乱数的值，
服务器端就会因为校验token的值为空或者错误，拒绝这个可疑请求.

## XSS (Cross-site scripting)

跨站脚本, Cross-site scripting的英文首字母缩写本应为CSS，但因为CSS在网页设计领域已经被广泛指层叠样式表（Cascading Style Sheets），
所以将Cross（意为“交叉”）改以交叉形的X做为缩写
 
### 原理

XSS 全称“跨站脚本”，是注入攻击的一种。其特点是不对服务器端造成任何伤害，而是通过一些正常的站内交互途径，
例如发布评论，提交含有 JavaScript 的内容文本。这时服务器端如果没有过滤或转义掉这些脚本，
作为内容发布到了页面上，其他用户访问这个页面的时候就会运行这些脚本。

### 如何防御



## XSS 对比 CSRF
XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任

## 参考
* [总结 XSS 与 CSRF 两种跨站攻击](https://blog.tonyseek.com/post/introduce-to-xss-and-csrf/)