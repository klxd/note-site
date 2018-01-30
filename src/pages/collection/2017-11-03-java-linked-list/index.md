---
title: Java LinkedList
date: "2017-11-03T22:22:22.169Z"
path:  "/java-linked-list"
tags:
   - java
   - java collection framework
---

## Java LinkedList

* LinkedList 同时实现了 List 和 Deque 接口
* 可以当做队列(Queue)或栈(Stack)使用,虽然首选还是 ArrayDeque
* 没有实现同步
* 底层通过**双向链表实现**

## 链表节点 Node

```java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;
    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

* 链表节点为内部类 Node
* LinkedList 通过 first 和 last 引用分别指向链表的第一个和最后一个元素
* LinkedList 没有使用哑元,当链表为空的时候 first 和 last 都指向 null

## boolean add(E e)

```java
public boolean add(E e) {
    linkLast(e);
    return true;
}
void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    // 若原链表为空,则为第一个元素
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    // AbstractList中的字段，用于标记list被修改的次数
    modCount++;
}
```

* 将一个元素(可为 null)添加到 list 的末尾,
* 时间复杂度 O(1),实现比较简单

## void add(int index, E element)

```java
public void add(int index, E element) {
    // 检查 index >= 0 && index <= size
    checkPositionIndex(index);

    if (index == size)
        linkLast(element); // 等同于add(e)
    else
        linkBefore(element, node(index));
}

void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null) // pred为前一个节点,若pred为null,则表示插入位置为0
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}

Node<E> node(int index) {
    // assert isElementIndex(index);
    // 由于是双向链表,两个方向都可以遍历,根据index是否大于中点决定从哪个方向遍历
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

* 将元素插入到链表中的指定位置,
* 时间复杂度 O(n),需要线性查找到插入的具体位置(函数`Node<E> node(int index)`)
* 由于`node`函数的优化,最差时间复杂度为 O(n/2)

## boolean remove(Object o)

```java
public boolean remove(Object o) {
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null) {
                unlink(x);
                return true;
            }
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item)) {
                unlink(x);
                return true;
            }
        }
    }
    return false;
}
```

* 找到 object 第一次出现的位置,将其删除
* 根据 object 是否为 null,分为两种方法判断是否相等
* 时间复杂度 O(n)
