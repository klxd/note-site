---
title: Java ArrayDeque
date: "2017-11-04T22:22:22.169Z"
path:  "/java-array-deque"
tags:
   - java
   - java collection framework
---

# Java ArrayDeque

ArrayDeque和LinkedList是Deque的两个通用实现，
官方更推荐使用AarryDeque用作栈和队列.

* 底层通过__循环数组(circular array)__实现
* 不允许插入null元素
* 没有实现同步(不是线程安全)

```java
public class ArrayDeque<E> extends AbstractCollection<E>
                           implements Deque<E>, Cloneable, Serializable
{
    /**
     * The array in which the elements of the deque are stored.
     * The capacity of the deque is the length of this array, which is
     * always a power of two. The array is never allowed to become
     * full, except transiently within an addX method where it is
     * resized (see doubleCapacity) immediately upon becoming full,
     * thus avoiding head and tail wrapping around to equal each
     * other.  We also guarantee that all array cells not holding
     * deque elements are always null.
     * 存放数据的数组,此数组的大小即此deque的容量(capacity)
     * 此数组的大小永远为2的幂
     * 此数组中没有存放元素的位置为null(即不允许插入null至)
     * 此数组永远不允许填满(doubleCapacity会在此数组填满后立即调用)
     */
    transient Object[] elements; // non-private to simplify nested class access

    /**
     * The index of the element at the head of the deque (which is the
     * element that would be removed by remove() or pop()); or an
     * arbitrary number equal to tail if the deque is empty.
     * 指向队列的第一个元素,或等于tail(此时队列为空)
     */
    transient int head;

    /**
     * The index at which the next element would be added to the tail
     * of the deque (via addLast(E), add(E), or push(E)).
     * 指向队尾的第一个可以插入元素的空位
     */
    transient int tail;
 }
```

##　void addFirst(E e)
```java
public void addFirst(E e) {
    if (e == null)
        throw new NullPointerException();
    elements[head = (head - 1) & (elements.length - 1)] = e;
    if (head == tail)
        doubleCapacity();
}
```

* 不允许插入空值
* 插入位置需要考虑下标越界的问题　　
  `(head - 1) & (elements.length - 1)`
  这段代码相当于利用取余解决了`head-1`为`-1`的情况  
  因为elements.length永远为2的幂,减一之后二进制低位全为1,
  与-1取与之后等于其本身,即element数组的最后一个位置
* 空间问题是在插入之后解决的，即tail总是指向下一个可插入的空位

## void addLast(E e)
基本思路和addFirst一样
```java
public void addLast(E e) {
    if (e == null)
        throw new NullPointerException();
    elements[tail] = e;
    if ( (tail = (tail + 1) & (elements.length - 1)) == head)
        doubleCapacity();
}
```

```java
private void doubleCapacity() {
    assert head == tail;
    int p = head;
    int n = elements.length;
    int r = n - p; // number of elements to the right of p
    int newCapacity = n << 1;
    if (newCapacity < 0)
        throw new IllegalStateException("Sorry, deque too big");
    Object[] a = new Object[newCapacity];
    System.arraycopy(elements, p, a, 0, r);
    System.arraycopy(elements, 0, a, r, p);
    elements = a;
    head = 0;
    tail = n;
}
```
* 扩容为原数组的两倍(保持capacity大小的2的幂)
* 复制分两次进行,先复制head右边的元素,再复制head左边的
* 扩容之后head为0,tail为元素的个数

## poll

```java
public E pollFirst() {
    int h = head;
    @SuppressWarnings("unchecked")
    E result = (E) elements[h];
    // Element is null if deque empty
    if (result == null)
        return null;
    elements[h] = null;     // Must null out slot
    head = (h + 1) & (elements.length - 1);
    return result;
}

public E pollLast() {
    int t = (tail - 1) & (elements.length - 1);
    @SuppressWarnings("unchecked")
    E result = (E) elements[t];
    if (result == null)
        return null;
    elements[t] = null;
    tail = t;
    return result;
}
```
* 若poll取出的元素为空,代表此deque为空
* 取出元素后要将数组中相应的位置赋值为null,防止内存泄露

## peek

```java
@SuppressWarnings("unchecked")
public E peekFirst() {
    // elements[head] is null if deque empty
    return (E) elements[head];
}

@SuppressWarnings("unchecked")
public E peekLast() {
    return (E) elements[(tail - 1) & (elements.length - 1)];
}
```

