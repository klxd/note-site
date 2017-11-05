---
title: Java LinkedList
date: "2017-11-03T22:22:22.169Z"
path:  "/java-linked-list"
tags:
   - java
   - java collection framework
---

# Java LinkedList

* LinkedList同时实现了List和Deque接口
* 可以当做队列(Queue)或栈(Stack)使用,虽然首选还是ArrayDeque
* 没有实现同步
* 底层通过__双向链表实现__


链表节点为内部类Node,LinkedList通过first和last引用分别指向链表的第一个和最后一个元素。
注意这里没有所谓的哑元，当链表为空的时候first和last都指向null。
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

## boolean add(E e)
将一个元素(可为null)添加到list的末尾,
时间复杂度 O(1),实现比较简单
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

## void add(int index, E element)
讲元素插入到链表中的指定位置,
时间复杂度O(n),需要线性查找到插入的具体位置(函数`Node<E> node(int index)`)
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
