---
title: Java ArrayList
date: "2017-09-12T22:22:22.169Z"
path:  "/java-array-list"
tags:
   - java
   - java collection framework
---

Java 中最常用的数据结构之一

* 元素的存放顺序与`add`的顺序相同
* 允许放入`null`元素
* 未实现同步（不是线程安全）
* 底层实现是一个 array 数组

## add

```java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}

public void add(int index, E element) {
    rangeCheckForAdd(index);
    // 确保容量足够
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // native函数,将index之后的元素右移一位
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    // 插入新元素
    elementData[index] = element;
    size++;
}
```

* ArrayList 是在 add 之前扩容
* 允许放入空元素

## remove

```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    // -- 如果不是删除最后一位,则将index右边的所有元素左移一位
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}
```

```java
public boolean remove(Object o) {
    if (o == null) {
        for (int index = 0; index < size; index++)
            if (elementData[index] == null) {
                fastRemove(index);
                return true;
            }
    } else {
        for (int index = 0; index < size; index++)
            if (o.equals(elementData[index])) {
                fastRemove(index);
                return true;
            }
    }
    return false;
}
/*
 * 此函数与public E remove(int index)功能相同,不过省略了下标检查和返回值
 */
private void fastRemove(int index) {
    modCount++;
    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    elementData[--size] = null; // clear to let GC do its work
}
```

* 仅会删除 object 第一次出现的位置
* 可以传入 null,表示删除第一个 null 的位置
* 返回`true/false`表示是否有执行删除

## void grow(int minCapacity)

```java
private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);//原来的1.5倍
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    // 确保不会数值溢出,若newCapacity过大则设置为Integer.MAX_VALUE
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);//扩展空间并复制
}
```

* 由于 java 中的数组无法自动扩容，所以当 ArrayList 中的容量`capacity`不足时，会调用`grow`函数进行扩容。
* 数组默认扩容为原容量的 1.5 倍

## public void trimToSize()

```java
public void trimToSize() {
    modCount++;
    // 若底层数组有空闲位置,将数组中的内容复制到一个新的底层数组
    if (size < elementData.length) {
        elementData = (size == 0)
          ? EMPTY_ELEMENTDATA
          : Arrays.copyOf(elementData, size);
    }
}
```

* ArrayList 扩容之后,调用 remove 函数并不会使容量自动缩小,通过调用此函数可以将容量缩小,使得底层容器没有空闲空间

## Object clone()

```java
/**
 * Returns a shallow copy of this <tt>ArrayList</tt> instance.  (The
 * elements themselves are not copied.)
 *
 * @return a clone of this <tt>ArrayList</tt> instance
 */
public Object clone() {
    try {
        ArrayList<?> v = (ArrayList<?>) super.clone();
        v.elementData = Arrays.copyOf(elementData, size);
        v.modCount = 0;
        return v;
    } catch (CloneNotSupportedException e) {
        // this shouldn't happen, since we are Cloneable
        throw new InternalError(e);
    }
}
```

* 返回当前 ArrayList 的一个浅拷贝

## SubList

```java
public List<E> subList(int fromIndex, int toIndex) {
    subListRangeCheck(fromIndex, toIndex, size);
    return new SubList(this, 0, fromIndex, toIndex);
}

private class SubList extends AbstractList<E> implements RandomAccess {
    private final AbstractList<E> parent;
    private final int parentOffset;
    private final int offset;
    int size;

    SubList(AbstractList<E> parent,
            int offset, int fromIndex, int toIndex) {
        this.parent = parent;
        this.parentOffset = fromIndex;
        this.offset = offset + fromIndex;
        this.size = toIndex - fromIndex;
        this.modCount = ArrayList.this.modCount;
    }

    public E set(int index, E e) {
        rangeCheck(index);
        checkForComodification();
        E oldValue = ArrayList.this.elementData(offset + index);
        ArrayList.this.elementData[offset + index] = e;
        return oldValue;
    }

    public E get(int index) {
        rangeCheck(index);
        checkForComodification();
        return ArrayList.this.elementData(offset + index);
    }

    public int size() {
        checkForComodification();
        return this.size;
    }

    public void add(int index, E e) {
        rangeCheckForAdd(index);
        checkForComodification();
        parent.add(parentOffset + index, e);
        this.modCount = parent.modCount;
        this.size++;
    }

    public E remove(int index) {
        rangeCheck(index);
        checkForComodification();
        E result = parent.remove(parentOffset + index);
        this.modCount = parent.modCount;
        this.size--;
        return result;
    }
    ...
}
```

* 返回的 SubList 仅仅是原来 ArrayList 的一个视图,并没有做任何数据拷贝
* 对 SubList 的各种修改会被映射到原来的 ArrayList 上面
