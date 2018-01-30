---
title: Java CopyOnWriteArrayList
date: "2017-11-14T22:22:22.169Z"
path:  "/java-copy-on-write-array-list"
tags:
   - java
   - java collection framework
---

# CopyOnWriteArrayList

```java
public class CopyOnWriteArrayList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable {
    private static final long serialVersionUID = 8673264195747942595L;

    /** The lock protecting all mutators */
    final transient ReentrantLock lock = new ReentrantLock();

    /** The array, accessed only via getArray/setArray. */
    // -- 底层的数组,只通过getArray/setArray来访问
    private transient volatile Object[] array;

    /**
     * Gets the array.  Non-private so as to also be accessible
     * from CopyOnWriteArraySet class.
     * -- 也被CopyOnWriteArraySet复用
     */
    final Object[] getArray() {
        return array;
    }

    /**
     * Sets the array.
     */
    final void setArray(Object[] a) {
        array = a;
    }
}
```

## add

```java
/**
 * Appends the specified element to the end of this list.
 *
 * @param e element to be appended to this list
 * @return {@code true} (as specified by {@link Collection#add})
 */
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        // -- 创建一个新数组,长度为length+1,并讲旧数组的所有内容拷贝进去
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        // 将e赋值到最后一个位置
        newElements[len] = e;
        // 更换数组
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}

/**
 * Inserts the specified element at the specified position in this
 * list. Shifts the element currently at that position (if any) and
 * any subsequent elements to the right (adds one to their indices).
 *
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public void add(int index, E element) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        if (index > len || index < 0)
            throw new IndexOutOfBoundsException("Index: "+index+
                                                ", Size: "+len);
        Object[] newElements;
        // -- numMoved为需要向后挪动的元素个数
        int numMoved = len - index;
        // -- 若插入位置为最后一位,直接复制数组
        if (numMoved == 0)
            newElements = Arrays.copyOf(elements, len + 1);
        // -- 若插入位置在数组中间,分两次拷贝旧数组到新数组
        else {
            newElements = new Object[len + 1];
            System.arraycopy(elements, 0, newElements, 0, index);
            System.arraycopy(elements, index, newElements, index + 1,
                             numMoved);
        }
        // -- 将element放到正确的位置
        newElements[index] = element;
        // -- 更换数组
        setArray(newElements);
    } finally {
        lock.unlock();
    }
}
```

## E set(int index, E element)

```java
/**
 * Replaces the element at the specified position in this list with the
 * specified element.
 *
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E set(int index, E element) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        E oldValue = get(elements, index);

        if (oldValue != element) {
            int len = elements.length;
            // -- 复制旧数组
            Object[] newElements = Arrays.copyOf(elements, len);
            // -- 将index位置上的值复制为element
            newElements[index] = element;
            // 更新数组
            setArray(newElements);
        } else {
            // Not quite a no-op; ensures volatile write semantics
            setArray(elements);
        }
        return oldValue;
    } finally {
        lock.unlock();
    }
}
```

## remove

```java
/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).  Returns the element that was removed from the list.
 *
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E remove(int index) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        E oldValue = get(elements, index);
        // 删除之后需要向前挪的元素个数
        int numMoved = len - index - 1;
        // 删除的元素在数组末端
        if (numMoved == 0)
            setArray(Arrays.copyOf(elements, len - 1));
        // 删除的元素在数组中间
        else {
            Object[] newElements = new Object[len - 1];
            System.arraycopy(elements, 0, newElements, 0, index);
            System.arraycopy(elements, index + 1, newElements, index,
                             numMoved);
            setArray(newElements);
        }
        return oldValue;
    } finally {
        lock.unlock();
    }
}

/**
 * Removes the first occurrence of the specified element from this list,
 * if it is present.  If this list does not contain the element, it is
 * unchanged.  More formally, removes the element with the lowest index
 * {@code i} such that
 * <tt>(o==null&nbsp;?&nbsp;get(i)==null&nbsp;:&nbsp;o.equals(get(i)))</tt>
 * (if such an element exists).  Returns {@code true} if this list
 * contained the specified element (or equivalently, if this list
 * changed as a result of the call).
 *
 * @param o element to be removed from this list, if present
 * @return {@code true} if this list contained the specified element
 */
public boolean remove(Object o) {
    Object[] snapshot = getArray();
    int index = indexOf(o, snapshot, 0, snapshot.length);
    return (index < 0) ? false : remove(o, snapshot, index);
}

/**
 * A version of remove(Object) using the strong hint that given
 * recent snapshot contains o at the given index.
 */
private boolean remove(Object o, Object[] snapshot, int index) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] current = getArray();
        int len = current.length;
        if (snapshot != current) findIndex: {
            int prefix = Math.min(index, len);
            for (int i = 0; i < prefix; i++) {
                if (current[i] != snapshot[i] && eq(o, current[i])) {
                    index = i;
                    break findIndex;
                }
            }
            if (index >= len)
                return false;
            if (current[index] == o)
                break findIndex;
            index = indexOf(o, current, index, len);
            if (index < 0)
                return false;
        }
        Object[] newElements = new Object[len - 1];
        System.arraycopy(current, 0, newElements, 0, index);
        System.arraycopy(current, index + 1,
                         newElements, index,
                         len - index - 1);
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}
```

## get

```java
@SuppressWarnings("unchecked")
private E get(Object[] a, int index) {
    return (E) a[index];
}

/**
 * {@inheritDoc}
 *
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E get(int index) {
    // -- 不用加锁
    return get(getArray(), index);
}
```
