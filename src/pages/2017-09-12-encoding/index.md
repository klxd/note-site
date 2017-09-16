---
title: Encoding
date: "2017-09-12T22:22:22.169Z"
path:  "/encoding"
tags:
   - encoding
   - java
---

BOM

Byte Order Mark
Unicode编码中特有的一个概念, 表明了文件编码是`大端字节序`还是`小端字节序`
`FEFF` big endian
`FFFE` little endian

在utf-8编码中,BOM只是用于标记这个文件是utf-8格式,并没有声明字节序的作用