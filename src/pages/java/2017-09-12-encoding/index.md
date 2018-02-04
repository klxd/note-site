---
title: Encoding
date: "2017-09-12T22:22:22.169Z"
path:  "/encoding"
tags:
   - encoding
   - java
---

## ASCII

American Standard Code for Information Interchange，美国信息互换标准代码）最常见的英文编码，标准的 ASCII 码表是 128 个字符,
范围是 0x00~0x7F (0000 0000 ~ 0111 1111),
扩展的 ASCII 字符把最高位也用上了,即共有 256 个字符。

## ISO 8859-1:1998

又称`Latin-1`或`西欧语言`
以 ASCII 为基础

## UCS

由 ISO（国际标谁化组织）提出,全名 Universal Coded Character Set，简称`UCS`。

## Unicode

也叫`unicode`.
Unicode 是计算机科学领域里的一项业界标准,包括字符集、编码方案等。
Unicode 是为了解决传统的字符编码方案的局限而产生的，它为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。[Unicode Standard](http://www.unicode.org/standard/standard.html)
中详叙了相关信息。原始的 unicode 编码有以下问题

> 1. **无法兼容 ASCII**如何才能区别 unicode 和 ascii？计算机怎么知道三个字节表示一个符号，而不是分别表示三个符号呢？
> 2. **浪费存储空间**英文字母只用一个字节表示就够了，如果 unicode 统一规定，每个符号用三个或四个字节表示，
     那么每个英文字母前都必然有二到三个字节是 0，这对于存储空间来说是极大的浪费，文本文件的大小会因此大出二三倍，这是难以接受的
     
     
## Java中的unicode
* char 类型可以存储一个中文汉字， 因为Java中使用的编码是Unicode（不选择任何特定的编码，
  直接使用字符在字符集中的编号，这是统一的唯一方法）
* string其实核心是char[],然而要把byte转化成string，必须经过编码。
  string.length()其实就是char数组的长度，如果使用不同的编码，很可能会错分，造成散字和乱码

## UTF-8

unicode 在很长一段时间内无法推广，直到互联网的出现，为解决 unicode 如何在网络上传输的问题，于是面向传输的众多 UTF（UCS Transfer Format）标准出现了，顾名思义，UTF-8 就是每次 8 个位传输数据。
UTF-8 就是在互联网上使用最广的一种 unicode 的实现方式，收录于[RFC 2279](https://www.ietf.org/rfc/rfc2279.txt)
中。UTF-8 是一种变长编码，对于不同的字符范围使用不同长度的编码。如下表

| UCS-4 range (hex.)  | UTF-8 octet sequence (binary)       |
| ------------------- | ----------------------------------- |
| 0000 0000-0000 007F | 0xxxxxxx                            |
| 0000 0080-0000 07FF | 110xxxxx 10xxxxxx                   |
| 0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx          |
| 0001 0000-001F FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |
| 0400 0000-7FFF FFFF | 1111110x 10xxxxxx ... 10xxxxxx      |

## UTF-16

### UTF-16-LE

### UTF-16-BE

BOM

Byte Order Mark
Unicode 编码中特有的一个概念, 表明了文件编码是`大端字节序`还是`小端字节序`
`FEFF` big endian
`FFFE` little endian

在 utf-8 编码中,BOM 只是用于标记这个文件是 utf-8 格式,并没有声明字节序的作用

[java charset blog](http://lukejin.iteye.com/blog/586088)
