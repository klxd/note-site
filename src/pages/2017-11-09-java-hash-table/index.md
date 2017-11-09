---
title: Java Hashtable
date: "2017-11-08T22:22:22.169Z"
path:  "/java-hash-table"
tags:
   - java
   - java collection framework
---

# Java Hashtable

* 抽象父类为Dictionary (一个过时的类)
* 实现同步（线程安全）
* key和value都不允许为空

```java
public class Hashtable<K,V>
    extends Dictionary<K,V>
    implements Map<K,V>, Cloneable, java.io.Serializable {
    /**
     * The hash table data.
     */
    private transient Entry<?,?>[] table;

    /**
     * The total number of entries in the hash table.
     * -- Hashtable的大小
     */
    private transient int count;

    /**
     * The table is rehashed when its size exceeds this threshold.  (The
     * value of this field is (int)(capacity * loadFactor).)
     * -- 阈值　用于判断是否需要扩容
     * @serial
     */
    private int threshold;

    /**
     * The load factor for the hashtable.
     * -- 负载因子
     * @serial
     */
    private float loadFactor;

    /**
     * The number of times this Hashtable has been structurally modified
     * Structural modifications are those that change the number of entries in
     * the Hashtable or otherwise modify its internal structure (e.g.,
     * rehash).  This field is used to make iterators on Collection-views of
     * the Hashtable fail-fast.  (See ConcurrentModificationException).
     * -- 记录修改次数 用于实现fail-fast
     */
    private transient int modCount = 0;
}
```
## put()

```java
public synchronized V put(K key, V value) {
    // Make sure the value is not null
    if (value == null) {
        throw new NullPointerException();
    }
    // Makes sure the key is not already in the hashtable.
    Entry<?,?> tab[] = table;
    int hash = key.hashCode();
    int index = (hash & 0x7FFFFFFF) % tab.length;
    @SuppressWarnings("unchecked")
    Entry<K,V> entry = (Entry<K,V>)tab[index];
    for(; entry != null ; entry = entry.next) {
        if ((entry.hash == hash) && entry.key.equals(key)) {
            V old = entry.value;
            entry.value = value;
            return old;
        }
    }

    addEntry(hash, key, value, index);
    return null;
}
```
* put方法用`synchronized`关键字实现同步
* 判断value是否为空,为空则抛出异常
* 直接计算key对象的hashCode(没有做非空检查,即不允许key为空)
* 将hashCode模table数组的长度得到index
* 若`table[index]`元素不为空,则迭代遍历,若得到相同的key则直接替换,并返回旧value
* 若key不存在于table中,调用addEntry将其加入table

## addEntry
```java
private void addEntry(int hash, K key, V value, int index) {
    modCount++;

    Entry<?,?> tab[] = table;
    if (count >= threshold) {
        // Rehash the table if the threshold is exceeded
        rehash();

        tab = table;
        hash = key.hashCode();
        index = (hash & 0x7FFFFFFF) % tab.length;
    }

    // Creates the new entry.
    @SuppressWarnings("unchecked")
    Entry<K,V> e = (Entry<K,V>) tab[index];
    tab[index] = new Entry<>(hash, key, value, e);
    count++;
}
```
* 判断count是否等于threshold,是则调用rehash增大table的大小
* 拿到`table[index]`位置上的引用(可能为空)
* 新建一个Entry并插入到`table[index]`的位置,其next指向其旧的引用

## rehash()
当count的大小达到threshold时调用此函数

```java
protected void rehash() {
    int oldCapacity = table.length;
    Entry<?,?>[] oldMap = table;

    // overflow-conscious code
    int newCapacity = (oldCapacity << 1) + 1;
    if (newCapacity - MAX_ARRAY_SIZE > 0) {
        if (oldCapacity == MAX_ARRAY_SIZE)
            // Keep running with MAX_ARRAY_SIZE buckets
            return;
        newCapacity = MAX_ARRAY_SIZE;
    }
    Entry<?,?>[] newMap = new Entry<?,?>[newCapacity];

    modCount++;
    threshold = (int)Math.min(newCapacity * loadFactor, MAX_ARRAY_SIZE + 1);
    table = newMap;

    for (int i = oldCapacity ; i-- > 0 ;) {
        for (Entry<K,V> old = (Entry<K,V>)oldMap[i] ; old != null ; ) {
            Entry<K,V> e = old;
            old = old.next;

            int index = (e.hash & 0x7FFFFFFF) % newCapacity;
            e.next = (Entry<K,V>)newMap[index];
            newMap[index] = e;
        }
    }
}
```
* 数组大小增大为(2n+1)
* 遍历旧的table,遍历每个index上的链表,根据其hashCode放入新的table

## get()
```java
public synchronized V get(Object key) {
    Entry<?,?> tab[] = table;
    int hash = key.hashCode();
    int index = (hash & 0x7FFFFFFF) % tab.length;
    for (Entry<?,?> e = tab[index] ; e != null ; e = e.next) {
        if ((e.hash == hash) && e.key.equals(key)) {
            return (V)e.value;
        }
    }
    return null;
}
```
* get方法用`synchronized`关键字实现同步
* 寻找value的方法与put相同,不再赘述
