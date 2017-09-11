---
title: Markdown Learning
date: "2017-09-05T22:22:32.169Z"
path:  "/markdown-learning"
---

## Title
> ### Title

###代码区块###
#### 标记方法
- 用三个反引号<code>&#96;&#96;&#96;</code>包围  
  只有声明了程序语言的代码块才会应用语法高亮
- 缩进4个空格或者1个制表符
- 行内代码，用单个反引号<code>&#96;</code>包起来

#### 标记效果
- 区块会被`<pre>`和`<code>`标签包裹
- 区块中 *`&` `<` `>`*会自动转成html实体 
- 区块中各种markdown语法无效

```javascript
var func = function() {
    return false;
}
```

```python
s = "python_string"
print s
```

```bash
pwd 
cd ./sub_folder
```

### 分割线
####标记方法
一行中使用用三个以上的星号、减号或下划线，行内不能有其他字符
___


### 强调

- _斜体_　使用星号或下划线标记，被包围的字词会被转化成用`<em>`包围
- **黑体**　使用两个连续星号或下划线标记，被包围的字词会被转化成用`<strong>`包围
- ~~删除线~~　使用两个连续波浪线标记，被包围的字词会被转化成用`<del>`包围


### 列表
- 无有序列表 使用`-`,`+`或`-`
   - 子列表 前面加三个空格
      1. 有序子列表
      1. 有序子列表

           对齐list3
  
       对齐list2

  对齐list1

不对齐,需要与列表项对齐的段落,前面上有一个空行,再用前导空格决定与哪一列对齐

###语法高亮实现方法

代码被分割成多个字段(token)
- keyword
- punctuation
- boolean
- operator