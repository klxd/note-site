---
title: Code Highlight
date: "2017-09-10T22:22:32.169Z"
path:  "/code-highlight"
tags:
   - remark
   - markdown
   - prismJs
---

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

```javascript{1-2}
// long comment... long comment... long comment... long comment... long comment... 
var func = function() {
    return false;
}
console.log('Hello Javascript');
```

```java
public void test(String[] args) {
    System.out.println("Java Hello World");
}
```

```python
s = "python_hello_world"
print s
```

```bash
echo hello_bash
pwd 
cd ./sub_folder
```