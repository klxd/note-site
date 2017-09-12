---
title: Markdown Learning
date: "2017-09-05T22:22:32.169Z"
path:  "/markdown-learning"
tags:
   - remark
   - markdown
---

页面内的快速跳转
- [标题](#标题)  
- [分割线](#分割线)  
- [强调](#强调)  
- [列表](#列表)  
- [链接](#链接)  
- [图片](#图片)  
- [表格](#表格)  
- [脚注](#脚注)  
- [引用](#引用)  
- [行内HTML](#行内HTML)  
- [分割线](#分割线)


<a name="标题"></a>
## 标题
```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alt-H1
===

Alt-H2
---

```
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alt-H1
===

Alt-H2
---

<a name="强调"></a>
### 强调

- _斜体_　使用星号或下划线标记，被包围的字词会被转化成用`<em>`包围
- **黑体**　使用两个连续星号或下划线标记，被包围的字词会被转化成用`<strong>`包围
- ~~删除线~~　使用两个连续波浪线标记，被包围的字词会被转化成用`<del>`包围


<a name="列表"></a>

### 列表
```markdown
- 无有序列表 使用`-`,`+`或`-`
   - 子列表 前面加三个空格
      1. 有序子列表
      1. 有序子列表

           对齐list3
  
       对齐list2

  对齐list1

不对齐  

- 需要与列表项对齐的段落,前面上有一个空行,再用前导空格决定与哪一列对齐
```

- 无有序列表 使用`-`,`+`或`-`
   - 子列表 前面加三个空格
      1. 有序子列表
      1. 有序子列表

           对齐list3
  
       对齐list2

  对齐list1

不对齐  

- 需要与列表项对齐的段落,前面上有一个空行,再用前导空格决定与哪一列对齐

<a name="链接"></a>
## 链接
```markdown
[行内链接](https://example.com)  
[行内链接(带标题)](https://example.com "示例标题")  
[索引链接][link to Github]  
[索引链接(数字索引)][1]  
[文件链接](../common.js)  
[缺省链接]

URL文本或带尖号的URL会自动转化成链接，比如https://github.com 或者是
<http://www.example.com> 

[link to github]: https://github.com
[1]: https://apple.com
[缺省链接]: https://abc.com
```
[行内链接](https://example.com)  
[行内链接(带标题)](https://example.com "示例标题")  
[索引链接][link to Github]  
[索引链接(数字索引)][1]  
[文件链接](../common.js)  
[缺省链接]

URL文本或带尖号的URL会自动转化成链接，比如https://github.com 或者是
<http://www.example.com> 

[link to github]: https://github.com
[1]: https://apple.com
[缺省链接]: https://abc.com

<a name="图片"></a>
## 图片
```markdown
图片语法:

行内图片:
![加载中](https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif "Logo Title Text 1")

索引图片:
![头像][logo]

[logo]: https://avatars3.githubusercontent.com/u/16486957?v=4&s=40 "Logo Title Text 2"
```

图片语法:

行内图片:
![加载中](https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif "Logo Title Text 1")

索引图片:
![头像][logo]

[logo]: https://avatars3.githubusercontent.com/u/16486957?v=4&s=40 "Logo Title Text 2"

<a name="表格"></a>
## 表格
markdown默认不支持表格

| header | column1 | column2 |
|-------:|:-------| :-------|
| row 1  | data1-1 | data1-2 |
| row 2  | data2-1 | data2-2 |


<a name="脚注"></a>
## 脚注
```markdown
这是一个脚注的例子[^1], 点击跳转到页面末端
[^1]: 这是页面末端的脚注, 点击跳转到使用脚注的地方
```

这是一个脚注的例子[^1], 点击跳转到页面末端

<a name="引用"></a>
## 引用
```markdown
> 使用引用  
> 多行引用
>>嵌套引用
```
> 使用引用  
> 多行引用
>>嵌套引用

<a name="行内html></a>
## 行内HTML
markdown中可以直接使用html的语法,被包围的区块中markdown语法无效

```markdown
<ul>
  <li> __item1__ </li>
  <li> **item** </li>
  <li> ##item2## </li>
</ul>
```

<ul>
  <li> __item1__ </li>
  <li> **item** </li>
  <li> ##item2## </li>
</ul>

<a name="分割线"></a>
## 分割线
```markdown
连续三个或以上的(行内不能有其它字符)  
中划线
---
星号
***
下划线
___
```
连续三个或以上的(行内不能有其它字符)  
中划线
---
星号
***
下划线
___
    
    
###语法高亮实现方法

>代码被分割成多个字段(token)
- keyword
- punctuation
- boolean
- operator



[^1]: 这是页面末端的脚注, 点击跳转到使用脚注的地方