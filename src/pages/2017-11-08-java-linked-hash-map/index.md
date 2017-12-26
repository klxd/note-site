---
title: Java LinkedHashMap
date: "2017-11-08T22:22:22.169Z"
path:  "/java-linked-hash-map"
tags:
   - java
   - java collection framework
---

# Java LinkedHashMap

* HashMap 的直接子类
* 在 HashMap 的基础上，采用双向链表将所有的 entry 链接起来
* 能保证迭代顺序与插入顺序相同
* 未实现同步（不是线程安全）
*

```java
public class LinkedHashMap<K,V>
    extends HashMap<K,V>
    implements Map<K,V>
{
    /**
     * The head (eldest) of the doubly linked list.
     * -- 双向链表的表头元素
     */
    transient LinkedHashMap.Entry<K,V> head;

    /**
     * The tail (youngest) of the doubly linked list.
     * -- 双向链表的表尾元素
     */
    transient LinkedHashMap.Entry<K,V> tail;

    /**
     * The iteration ordering method for this linked hash map: <tt>true</tt>
     * for access-order, <tt>false</tt> for insertion-order.
     * -- true　按照访问顺序排序　false 按照插入顺序排序（默认）
     * @serial
     */
    final boolean accessOrder;

    // -- HashMap.Node的直接子类，新增了两个域用于实现双向链表
    static class Entry<K,V> extends HashMap.Node<K,V> {ii
        Entry<K,V> before, after;
        Entry(int hash, K key, V value, Node<K,V> next) {
            super(hash, key, value, next);
        }
    }
}
```
