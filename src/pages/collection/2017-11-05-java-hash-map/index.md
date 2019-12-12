---
title: Java HashMap
date: "2017-11-04T22:22:22.169Z"
path:  "/java-hash-map"
tags:
   - java
   - java collection framework
---

* Map 的最常用实现
* 允许放入空元素 (key 允许为空,value 也允许为空)
* 不保证元素的顺序
* 未实现同步（不是线程安全）

## Node<K, V>
```java
/**
 * Basic hash bin node, used for most entries.  (See below for
 * TreeNode subclass, and in LinkedHashMap for its Entry subclass.)
 */
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    public final K getKey()        { return key; }
    public final V getValue()      { return value; }
    public final String toString() { return key + "=" + value; }

    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }

    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }

    public final boolean equals(Object o) {
        if (o == this)
            return true;
        if (o instanceof Map.Entry) {
            Map.Entry<?,?> e = (Map.Entry<?,?>)o;
            if (Objects.equals(key, e.getKey()) &&
                Objects.equals(value, e.getValue()))
                return true;
        }
        return false;
    }
}
```
* HashMap的底层节点
* 实现了Map.Entry<K,V>接口, 保存了一个key-value键值对
* 同时保存了hashCode的值,用于避免重复计算
* 同时保存了下一个节点的值,用于???

## 内部域

```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {


    /* ---------------- Fields -------------- */

    /**
     * Map的底层数据存储 -- Node的数组, 在第一次被使用时初始化, 长度永远为2的幂
     */
    transient Node<K,V>[] table;

    /**
     * Holds cached entrySet(). Note that AbstractMap fields are used
     * for keySet() and values().
     */
    transient Set<Map.Entry<K,V>> entrySet;

    /**
     * 当前Map的大小 
     */
    transient int size;

    /**
     * -- 此hashMap被修改的次数,用于fail-fast机制
     */
    transient int modCount;

    /**
     * 下一个扩容阈值 (capacity * load factor).
     */
    int threshold;

    /**
     * -- 负载参数,当entry的数量大于(capacity * loadFactor)时,触发自动扩容并重hash
     */
    final float loadFactor;
}
```

## 构造函数
```java
/**
 * 默认负载参数 - 0.75f
 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;
/**
 * HashMap的默认大小 - 16
 */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

public HashMap(int initialCapacity, float loadFactor) { 
    // ... 
}

public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}
```

* HashMap构造时不会触发底层Node数组的初始化
* 默认大小16, 默认负载参数0.75
* HashMap 的 bucket 数组大小一定是2的幂，如果 new 的时候指定了容量且不是2的幂，
  实际容量会是最接近(且大于)指定容量的2的幂，比如 new HashMap<>(19)，比19大且最接近的2的幂是32，实际容量就是32。


## hash()
```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

* 由于`h>>>16`，高16bit补0，一个数和0异或不变，所以hash函数大概的作用就是：高16bit不变，低16bit和高16bit做了一个异或，目的是减少碰撞.
* 按照函数注释，因为bucket数组大小是2的幂，计算下标`index = (table.length - 1) & hash`，
  如果不做hash处理，相当于散列生效的只有几个低bit位，为了减少散列的碰撞，
  设计者综合考虑了速度、作用、质量之后，使用高16bit和低16bit异或来简单处理减少碰撞，
  而且JDK8中用了复杂度 O（logn）的红黑树结构来提升碰撞下的性能



## get()

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}
final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {
            if (first instanceof TreeNode) // 可能是冲突链表或红黑树,TreeNode也是Node的子类
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

* hash()函数: 取原对象的 hashCode,左移 16 位,返回与其自身的亦或结果原因: 因为 HashMap 的 bucket 数量永远为 2 的幂,
  对 hashCode 的取余操作等同于抹掉二进制的高位,
  这样 hashCode 的二进制高位没有被利用,增大的碰撞的概率.(低位相同的 hashCode 会发生碰撞)
  在对速度和效用进行权衡之后,对 hashCode 这样的处理.

* getNode()函数:根据 hashCode 得到 bucket 的下标,然后遍历冲突链表或树,得到相应的 entry

## put()

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
/**
 * Implements Map.put and related methods
 *
 * @param hash hash for key
 * @param key the key
 * @param value the value to put
 * @param onlyIfAbsent if true, don't change existing value
 * @param evict if false, the table is in creation mode.
 * @return previous value, or null if none
 */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // 若数组为空,执行resize函数初始化底层数组
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;

    if ((p = tab[i = (n - 1) & hash]) == null)
        // 如果node中对应的位置为null,直接放进新的Node
        tab[i] = newNode(hash, key, value, null);
    else {
        // 如果node中对应位置不为空
        Node<K,V> e; K k;
        // 1. 碰撞 - 若key对应的节点已经存在
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        // 2. 碰撞 - 若该位置是树节点
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        // 3. 碰撞 - 该位置是链表
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    // 插入新的node到链表末尾
                    p.next = newNode(hash, key, value, null);
                    // 如果链表长度大于
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        // key对应的节点已经存在,根据onlyIfAbsent的值决定是否要修改它
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```
put函数的基本执行流程如下:

1. 对key的hashCode()进行hash后计算数组下标index;
2. 如果当前数组table为null，进行resize()初始化；
3. 如果没碰撞直接放到对应下标的bucket里；
4. 如果碰撞了，且节点已经存在，就替换掉 value；
5. 如果碰撞后发现为树结构，挂载到树上。
6. 如果碰撞后为链表，添加到链表尾，并判断链表如果过长(大于等于TREEIFY_THRESHOLD，默认8)，就把链表转换成树结构；
7. 数据 put 后，如果数据量超过threshold，就要resize。

## resize

resize用来做第一次的初始化, 或者当HashMap的size达到扩容阈值时, 会触发此扩容函数

```java
/**
 * Initializes or doubles table size.  If null, allocates in
 * accord with initial capacity target held in field threshold.
 * Otherwise, because we are using power-of-two expansion, the
 * elements from each bin must either stay at same index, or move
 * with a power of two offset in the new table.
 *
 * @return the table
 */
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

* 扩容永远是将容量扩大一倍
* 

## tree
JDK8 中 HashMap 引入了红黑树来处理哈希碰撞
```java
/**
 * Replaces all linked nodes in bin at index for given hash unless
 * table is too small, in which case resizes instead.
 */
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        TreeNode<K,V> hd = null, tl = null;
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

## Q

* HashMap 的工作原理是什么
* 内部的数据结构是什么
* HashMap 的 table 的容量如何确定？loadFactor 是什么？ 该容量如何变化？这种变化会带来什么问题？
* HashMap 实现的数据结构是什么？如何实现
* HashMap 和 HashTable、ConcurrentHashMap 的区别
* HashMap 的遍历方式及效率
* HashMap、LinkedMap、TreeMap 的区别
* 如何决定选用 HashMap 还是 TreeMap
* 如果 HashMap 的大小超过了负载因子(load factor)定义的容量，怎么办
* HashMap 是线程安全的吗？并发下使用的 Map 是什么，它们内部原理分别是什么，比如存储方式、 hashcode、扩容、 默认容量等


## 参考
[阿里巴巴Java开发规约](https://zhuanlan.zhihu.com/p/30360734)