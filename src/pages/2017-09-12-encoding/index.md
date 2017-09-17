---
title: Encoding
date: "2017-09-12T22:22:22.169Z"
path:  "/encoding"
tags:
   - encoding
   - java
---

## Unicode
Unicode是计算机科学领域里的一项业界标准,包括字符集、编码方案等。
Unicode 是为了解决传统的字符编码方案的局限而产生的，它为每种语言中
的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行
文本转换、处理的要求。[Unicode Standard](http://www.unicode.org/standard/standard.html)
中详叙了相关信息。

## UTF-8
UTF-8字符集是Unicode编码的一种，收录于[RFC 2279](https://www.ietf.org/rfc/rfc2279.txt)
中。UTF-8是一种变长编码，对于不同的字符范围使用不同长度的编码。如下表

| UCS-4 range (hex.)   | UTF-8 octet sequence (binary) |
| ---------------------|-------------------------------|
| 0000 0000-0000 007F  | 0xxxxxxx 
| 0000 0080-0000 07FF  | 110xxxxx 10xxxxxx
| 0000 0800-0000 FFFF  | 1110xxxx 10xxxxxx 10xxxxxx
| 0001 0000-001F FFFF  | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
| 0400 0000-7FFF FFFF  | 1111110x 10xxxxxx ... 10xxxxxx

## UTF-16

### UTF-16-LE
### UTF-16-BE

BOM

Byte Order Mark
Unicode编码中特有的一个概念, 表明了文件编码是`大端字节序`还是`小端字节序`
`FEFF` big endian
`FFFE` little endian

在utf-8编码中,BOM只是用于标记这个文件是utf-8格式,并没有声明字节序的作用