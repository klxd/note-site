---
title: Java TreeMap
date: "2017-11-10T22:22:22.169Z"
path:  "/java-tree-map"
tags:
   - java
   - java collection framework
---

* 实现了 SortedMap 接口,会按照 key 的大小对 map 中的元素进行排序
* 未实现同步(不是线程安全)
* key 不允许为空
* 底层使用红黑树实现

```java
public class TreeMap<K,V>
    extends AbstractMap<K,V>
    implements NavigableMap<K,V>, Cloneable, java.io.Serializable
{
    /**
     * The comparator used to maintain order in this tree map, or
     * null if it uses the natural ordering of its keys.
     * -- 对于key的一个比较器,为空则使用key的自然顺序
     * @serial
     */
    private final Comparator<? super K> comparator;

    // -- 红黑树的根节点
    private transient Entry<K,V> root;

    /**
     * The number of entries in the tree
     */
    private transient int size = 0;

    /**
     * The number of structural modifications to the tree.
     */
    private transient int modCount = 0;
}
```

## 红黑树

红黑树是一种近似平衡的二叉查找树，它能够确保任何一个节点的左右子树的高度差不会超过二者中较低那个的一陪。
具体来说，红黑树是满足如下条件的二叉查找树（binary search tree）：

* 每个节点要么是红色，要么是黑色。
* 根节点必须是黑色
* 红色节点不能连续（也即是，红色节点的孩子和父亲都不能是红色）。
* 对于每个节点，从该点至 null（树尾端）的任何路径，都含有相同个数的黑色节点

## Entry

```java
static final class Entry<K,V> implements Map.Entry<K,V> {
    K key;
    V value;
    Entry<K,V> left;
    Entry<K,V> right;
    Entry<K,V> parent;
    boolean color = BLACK;
}
```

## get()

```java
public V get(Object key) {
    Entry<K,V> p = getEntry(key);
    return (p==null ? null : p.value);
}

final Entry<K,V> getEntry(Object key) {
    // Offload comparator-based version for sake of performance
    if (comparator != null) // -- 使用comparator寻找
        return getEntryUsingComparator(key);
    if (key == null)　// -- 不允许key为空
        throw new NullPointerException();
    @SuppressWarnings("unchecked")
    Comparable<? super K> k = (Comparable<? super K>) key;　// -- 使用自然顺序
    Entry<K,V> p = root;
    while (p != null) {
        int cmp = k.compareTo(p.key);
        if (cmp < 0)
            p = p.left;
        else if (cmp > 0)
            p = p.right;
        else
            return p;
    }
    return null;
}

final Entry<K,V> getEntryUsingComparator(Object key) {
    @SuppressWarnings("unchecked")
        K k = (K) key;
    Comparator<? super K> cpr = comparator;
    if (cpr != null) {
        Entry<K,V> p = root;
        while (p != null) {
            int cmp = cpr.compare(k, p.key);
            if (cmp < 0)
                p = p.left;
            else if (cmp > 0)
                p = p.right;
            else
                return p;
        }
    }
    return null;
}
```

* 根据比较器顺序或者元素的自然顺序,对二叉树进行查找
* 直到满足`cmp = k.compareTo(p.key) == 0`的 entry

## put()

```java
public V put(K key, V value) {
    Entry<K,V> t = root;
    if (t == null) { // -- 若root为空,则put为根节点
        compare(key, key); // type (and possibly null) check

        root = new Entry<>(key, value, null);
        size = 1;
        modCount++;
        return null;
    }
    int cmp;
    Entry<K,V> parent;
    // split comparator and comparable paths
    Comparator<? super K> cpr = comparator;
    if (cpr != null) {
        do {
            parent = t;
            cmp = cpr.compare(key, t.key);
            if (cmp < 0)
                t = t.left;
            else if (cmp > 0)
                t = t.right;
            else
                return t.setValue(value);
        } while (t != null);
    }
    else {
        if (key == null)
            throw new NullPointerException();
        @SuppressWarnings("unchecked")
            Comparable<? super K> k = (Comparable<? super K>) key;
        do {
            parent = t;
            cmp = k.compareTo(t.key);
            if (cmp < 0)
                t = t.left;
            else if (cmp > 0)
                t = t.right;
            else
                return t.setValue(value);
        } while (t != null);
    }
    Entry<K,V> e = new Entry<>(key, value, parent);
    if (cmp < 0)
        parent.left = e;
    else
        parent.right = e;
    fixAfterInsertion(e);
    size++;
    modCount++;
    return null;
}
```

* 对 map 做一次查找,若找到对应的 key(`k.compareTo(t.key) == 0`),则将其 value 赋为新值,返回旧值
* 若找不到,新建一个 entry 将其插入到合适的位置(使用查找时记录的`parent`)
* 调用`fixAfterInsertion(newEntry)`调整树的结构

## remove

```java
public V remove(Object key) {
    Entry<K,V> p = getEntry(key);
    if (p == null)
        return null;

    V oldValue = p.value;
    deleteEntry(p);
    return oldValue;
}
```
* 调用`getEntry()`找到 key 相应的 entry
* 调用`deleteEntry()`删除对应的 entry (根据需要调整树的结构)

## NavigableMap接口

* NavigableMap接口已知实现类ConcurrentSkipListMap, TreeMap
* SortedMap 是继承于Map的接口。SortedMap中的内容是排序的键值对，排序的方法是通过比较器(Comparator)。
* NavigableMap 是继承于SortedMap的接口。相比于SortedMap，NavigableMap有一系列的导航方法；如"获取大于/等于某对象的键值对"、“获取小于/等于某对象的键值对”等等。 
* TreeMap 继承于AbstractMap，且实现了NavigableMap接口；因此，TreeMap中的内容是“有序的键值对”

NavigableMap提供的功能可以分为4类

第1类，提供操作键-值对的方法
lowerEntry、floorEntry、ceilingEntry 和 higherEntry 方法
它们分别返回与小于、小于等于、大于等于、大于给定键的键关联的 Map.Entry<K, V>对象, 若不存在则返回null
注意,为了使map内部结构不被破坏,此处返回的Entry均为AbstractMap.SimpleImmutableEntry的示例,调用其setValue方法会抛异常.
firstEntry、pollFirstEntry、lastEntry 和 pollLastEntry 方法，
它们返回和/或移除最小和最大的映射关系（如果存在），否则返回 null。

第2类，提供操作键的方法。这个和第1类比较类似
lowerKey、floorKey、ceilingKey 和 higherKey 方法，它们分别返回与小于、小于等于、大于等于、大于给定键的键, 若不存在则返回null。

第3类，获取键集。
navigableKeySet、descendingKeySet分别获取正序/反序的键集(NavigableSet<K>)。

第4类，获取键-值对的子集。
NavigableMap<K,V> descendingMap();
subMap、headMap、tailMap返回大于或小于某个key的一个SortedMap<K,V>


# 练习题
leetcode-56
leetcode-826