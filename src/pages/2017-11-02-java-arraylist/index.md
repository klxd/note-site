---
title: Java ArrayList
date: "2017-09-12T22:22:22.169Z"
path:  "/java-array-list"
tags:
   - java
   - java collection framework
---

# Java ArrayList

Java中最常用的数据结构之一
* 元素的存放顺序与`add`的顺序相同
* 允许放入`null`元素
* 未实现同步（不是线程安全）
* 底层实现是一个array数组

由于java中的数组无法自动扩容，所以当ArrayList中的容量`capacity`不足时，
会调用`grow`函数进行扩容。

```java
private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);//原来的1.5倍
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);//扩展空间并复制
}
```