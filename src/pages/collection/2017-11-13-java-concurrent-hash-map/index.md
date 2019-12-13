---
title: Java ConcurrentHashMap
date: "2017-11-13T22:22:22.169Z"
path:  "/java-concurrent-hash-map"
tags:
   - java
   - java collection framework
---

## 分析要点
* JDK1.8版本的ConcurrentHashMap的底层数据结构接近HashMap, 都是Node数组, 当冲突链表长度大于阈值时, 都会转化为红黑树进行存储
* 使用CAS+Synchronized保证线程安全, 加锁粒度为数组元素Node

## Node

```java
/**
* -- key和value都不允许为空,特例:tab中的哑元(负的hash值且key和value均为null,不会被暴露)
*/
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    volatile V val;
    volatile Node<K,V> next;

    Node(int hash, K key, V val, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.val = val;
        this.next = next;
    }

    public final K getKey()       { return key; }
    public final V getValue()     { return val; }
    public final int hashCode()   { return key.hashCode() ^ val.hashCode(); }
    public final String toString(){ return key + "=" + val; }
    // -- 不同与一般Entry的实现,不支持对值的修改
    public final V setValue(V value) { // -- value是不可变的
        throw new UnsupportedOperationException();
    }

    public final boolean equals(Object o) {
        Object k, v, u; Map.Entry<?,?> e;
        return ((o instanceof Map.Entry) &&
                (k = (e = (Map.Entry<?,?>)o).getKey()) != null &&
                (v = e.getValue()) != null &&
                (k == key || k.equals(key)) &&
                (v == (u = val) || v.equals(u)));
    }

    /**
     * Virtualized support for map.get(); overridden in subclasses.
     * -- 用于辅助get方法,子类中会有覆盖实现
     */
    Node<K,V> find(int h, Object k) {
        Node<K,V> e = this;
        if (k != null) {
            do {
                K ek;
                if (e.hash == h &&
                    ((ek = e.key) == k || (ek != null && k.equals(ek))))
                    return e;
            } while ((e = e.next) != null);
        }
        return null;
    }
}

/* ---------------- Special Nodes -------------- */

/**
 * A node inserted at head of bins during transfer operations.
 * -- 扩容操作中放置于旧tab中的占位符
 * -- 一个用于连接两个table的节点类。它包含一个nextTable指针，用于指向下一张表。
 *    而且这个节点的key value next指针全部为null，它的hash值为-1. 
 *    这里面定义的find的方法是从nextTable里进行查询节点，而不是以自身为头节点进行查找
 */
static final class ForwardingNode<K,V> extends Node<K,V> {
    final Node<K,V>[] nextTable;
    ForwardingNode(Node<K,V>[] tab) {
        super(MOVED, null, null, null);
        this.nextTable = tab;
    }

    Node<K,V> find(int h, Object k) {
        // loop to avoid arbitrarily deep recursion on forwarding nodes
        outer: for (Node<K,V>[] tab = nextTable;;) {
            Node<K,V> e; int n;
            if (k == null || tab == null || (n = tab.length) == 0 ||
                (e = tabAt(tab, (n - 1) & h)) == null)
                return null;
            for (;;) {
                int eh; K ek;
                if ((eh = e.hash) == h &&
                    ((ek = e.key) == k || (ek != null && k.equals(ek))))
                    return e;
                if (eh < 0) {
                    if (e instanceof ForwardingNode) {
                        tab = ((ForwardingNode<K,V>)e).nextTable;
                        continue outer;
                    }
                    else
                        return e.find(h, k);
                }
                if ((e = e.next) == null)
                    return null;
            }
        }
    }
}

/**
 * A place-holder node used in computeIfAbsent and compute
 * -- 标识一个节点为保留节点,用于实现computeIfAbsent
 */
static final class ReservationNode<K,V> extends Node<K,V> {
    ReservationNode() {
        super(RESERVED, null, null, null);
    }

    Node<K,V> find(int h, Object k) {
        return null;
    }
}
```

## fields

```java
public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
    implements ConcurrentMap<K,V>, Serializable {
 /**
     * The array of bins. Lazily initialized upon first insertion.
     * Size is always a power of two. Accessed directly by iterators.
     * -- 存放node数据的数组,大小永远为2的幂,首次插入时初始化
     */
    transient volatile Node<K,V>[] table;

    /**
     * The next table to use; non-null only while resizing.
     * -- 一个用于过渡的table,只有在resize的过程中是非空的
     */
    private transient volatile Node<K,V>[] nextTable;

    /**
     * Base counter value, used mainly when there is no contention,
     * but also as a fallback during table initialization
     * races. Updated via CAS.
     *
     */
    private transient volatile long baseCount;

    /**
     * Table initialization and resizing control.  When negative, the
     * table is being initialized or resized: -1 for initialization,
     * else -(1 + the number of active resizing threads).  Otherwise,
     * when table is null, holds the initial table size to use upon
     * creation, or 0 for default. After initialization, holds the
     * next element count value upon which to resize the table.
     * -- 控制标识符
     * 负数代表正在进行初始化或扩容操作
     * -1代表正在初始化
     * -N代表有N-1个线程正在进行扩容操作
     * 正数或者0代表hash表还没有被初始化,这个数值代表初始化或下一次进行扩容的大小,
     * 这一点类似于扩容阈值的概念(等于 容量*loadFactor)
     */
    private transient volatile int sizeCtl;

    /**
     * The next table index (plus one) to split while resizing.
     * 扩容过程中的下一个桶下标, 扩容开始初始化为原始tab大小, 扩容过程逐渐减小至0
     */
    private transient volatile int transferIndex;

    /**
     * Spinlock (locked via CAS) used when resizing and/or creating CounterCells.
     */
    private transient volatile int cellsBusy;

    /**
     * Table of counter cells. When non-null, size is a power of 2.
     */
    private transient volatile CounterCell[] counterCells;

    // views
    private transient KeySetView<K,V> keySet;
    private transient ValuesView<K,V> values;
    private transient EntrySetView<K,V> entrySet;
}
```

## size()

```java
/* ---------------- Counter support -------------- */

/**
 * A padded cell for distributing counts.  Adapted from LongAdder
 * and Striped64.  See their internal docs for explanation.
 */
@sun.misc.Contended static final class CounterCell {
    volatile long value;
    CounterCell(long x) { value = x; }
}
final long sumCount() {
    CounterCell[] as = counterCells; CounterCell a;
    long sum = baseCount;
    if (as != null) {
        for (int i = 0; i < as.length; ++i) {
            if ((a = as[i]) != null)
                sum += a.value;
        }
    }
    return sum;
}
/**
 * {@inheritDoc}
 */
public int size() {
    long n = sumCount();
    return ((n < 0L) ? 0 :
            (n > (long)Integer.MAX_VALUE) ? Integer.MAX_VALUE :
            (int)n);
}
```

## get方法
```java
public class ConcurrentHashMap<K,V> {
    public V get(Object key) {
        Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
        int h = spread(key.hashCode());
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (e = tabAt(tab, (n - 1) & h)) != null) { // -- 调用tabAt方法
            if ((eh = e.hash) == h) { // -- 根据hash找到对应的node, 校验key
                if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                    return e.val;
            }
            // eh<0为特殊节点, 调用find函数
            // eh=-1，说明该节点是一个ForwardingNode，正在迁移，此时调用ForwardingNode的find方法去nextTable里找。
            // eh=-2，说明该节点是一个TreeBin，此时调用TreeBin的find方法遍历红黑树，由于红黑树有可能正在旋转变色，所以find里会有读写锁
            else if (eh < 0)
                return (p = e.find(h, key)) != null ? p.val : null;
            // eh>=0，说明该节点下挂的是一个链表，直接遍历该链表即可。
            while ((e = e.next) != null) {
                if (e.hash == h &&
                    ((ek = e.key) == key || (ek != null && key.equals(ek))))
                    return e.val;
            }
        }
        return null;
    }
}
```

## public V put(K key, V value)

```java
/**
 * Maps the specified key to the specified value in this table.
 * Neither the key nor the value can be null.
 *
 * <p>The value can be retrieved by calling the {@code get} method
 * with a key that is equal to the original key.
 *
 * @param key key with which the specified value is to be associated
 * @param value value to be associated with the specified key
 * @return the previous value associated with {@code key}, or
 *         {@code null} if there was no mapping for {@code key}
 * @throws NullPointerException if the specified key or value is null
 */
public V put(K key, V value) {
    return putVal(key, value, false);
}

/*
 * Encodings for Node hash fields. See above for explanation.
 * -- 对应Node类中的hash域,不同的负值表示不同的node类型,正值则为正常node
 */
static final int MOVED     = -1; // hash for forwarding nodes
static final int TREEBIN   = -2; // hash for roots of trees
static final int RESERVED  = -3; // hash for transient reservations

static final int HASH_BITS = 0x7fffffff; // usable bits of normal node hash

static final int spread(int h) {
    // -- 抑或操作保证hashCode的高位信息也被利用,与操作保证最终结果为正数
    return (h ^ (h >>> 16)) & HASH_BITS;
}

/** Implementation for put and putIfAbsent */
final V putVal(K key, V value, boolean onlyIfAbsent) {
    // -- key和value都不允许为空
    if (key == null || value == null) throw new NullPointerException();
    int hash = spread(key.hashCode());
    int binCount = 0;
    for (Node<K,V>[] tab = table;;) { // -- 死循环实现自旋
        Node<K,V> f; int n, i, fh;
        // -- 若tab还未初始化,调用initTable
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        // -- 若tab中对应位置为空
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null,          // -- 使用cas操作放入node(无需加锁),成功了则跳出循环,否则重试
                         new Node<K,V>(hash, key, value, null)))
                break;                   // no lock when adding to empty bin
        }
        // -- 若tab中对应位置为扩容连接节点
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        // -- 以上条件都不满足,开始尝试插入新节点到对应位置
        else {
            V oldVal = null;
            synchronized (f) { // -- 对当前node加锁
                if (tabAt(tab, i) == f) { // -- 确认当前node没有变化,否则继续循环
                    // -- fh大于0表示这是一个普通node
                    if (fh >= 0) {
                        binCount = 1; // 记录当前位置上的节点数量
                        for (Node<K,V> e = f;; ++binCount) { // -- 遍历链表中的所有节点
                            K ek;
                            // -- 若hash值相同且key相等,修改对应节点的value值
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            // -- 若遍历到了最后一个节点,直接新建一个节点插到链表尾部
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key,
                                                          value, null);
                                break;
                            }
                        }
                    }
                    // -- 若f是一个树节点
                    else if (f instanceof TreeBin) {
                        Node<K,V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                       value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD) // -- 若链表长度达到临界值8,将其转化为红黑树
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    // 将当前元素数量加1
    addCount(1L, binCount);
    return null;
}

/**
 * Helps transfer if a resize is in progress.
 * -- 当前map正在扩容,而本线程需要加入到扩容操作中
 */
final Node<K,V>[] helpTransfer(Node<K,V>[] tab, Node<K,V> f) {
    Node<K,V>[] nextTab; int sc;
    if (tab != null && (f instanceof ForwardingNode) &&
        (nextTab = ((ForwardingNode<K,V>)f).nextTable) != null) { // -- 拿到nextTable
        int rs = resizeStamp(tab.length); // --计算一个操作校验码
        while (nextTab == nextTable && table == tab &&
               (sc = sizeCtl) < 0) { // 若扩容还未完成,继续循环
            if ((sc >>> RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||
                sc == rs + MAX_RESIZERS || transferIndex <= 0)
                break;
            // -- sizeCtl加1,表示有一个新的线程加入到扩容操作
            if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1)) {
                transfer(tab, nextTab);
                break;
            }
        }
        return nextTab;
    }
    return table;
}
```

## transfer

扩容方法

* 基本思想和HashMap很像, 在扩容的时候，tab长度翻倍, rehash的时候直接将冲突链表拆成两份放到对应的位置，这点和HashMap的resize方法类似。
* 支持并发扩容在扩容的时候,总会涉及到一个数组到另一个数组的拷贝操作,基本思路是把这个拷贝操作并发进行.
* 通过给每个线程分配桶区间，避免线程间的争用，通过为每个桶节点加锁，避免putVal方法导致数据不一致
* 而如果有新的线程想put数据时，也会经过helpTransfer帮助其扩容
* 核心代码: CAS设置sizeCtl与transferIndex变量，协调多个线程对table数组中的node进行迁移


```java
/**
 * Moves and/or copies the nodes in each bin to new table. See
 * above for explanation.
 */
class Clazz {
private final void transfer(Node<K,V>[] tab, Node<K,V>[] nextTab) {
    int n = tab.length, stride;
    // stride表示一个线程每次转移的桶的数量, 若在多核CPU的机器上运行,尽量保证每个CPU分到的桶的数量一样
    // -- 若CPU核心数大于1, 则将length / 8 然后除以CPU核心数。如果得到的结果小于 16，那么就使用 16
    if ((stride = (NCPU > 1) ? (n >>> 3) / NCPU : n) < MIN_TRANSFER_STRIDE)
        stride = MIN_TRANSFER_STRIDE; // subdivide range
    // 初始化nextTab
    if (nextTab == null) {            // initiating
        try {
            @SuppressWarnings("unchecked")
            Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n << 1]; // -- 扩容为原来的两倍,方便计算新的桶位置
            nextTab = nt;
        } catch (Throwable ex) {      // try to cope with OOME
            sizeCtl = Integer.MAX_VALUE;
            return;
        }
        nextTable = nextTab;
        transferIndex = n; // -- 初始化桶下标
    }
    int nextn = nextTab.length;
    // 标记连接节点, 创建一个fwd节点，用于占位。当别的线程发现这个槽位中是 fwd 类型的节点，则跳过这个节点。
    ForwardingNode<K,V> fwd = new ForwardingNode<K,V>(nextTab);
    // 首次推进为 true，如果等于 true，说明需要再次推进一个下标（i--），反之，如果是 false，那么就不能推进下标，需要将当前的下标处理完毕才能继续推进
    boolean advance = true;
    boolean finishing = false; // to ensure sweep before committing nextTab
    for (int i = 0, bound = 0;;) {
        Node<K,V> f; int fh;
        while (advance) {
            int nextIndex, nextBound;
            if (--i >= bound || finishing)
                advance = false;
            // -- 如果transferIndex=0，表示所以hash桶均被分配，将i置为-1，准备退出transfer方法
            else if ((nextIndex = transferIndex) <= 0) {
                i = -1;
                advance = false;
            }
            // -- 当迁移完bound这个桶后，尝试更新transferIndex，，获取下一批待迁移的hash桶
            else if (U.compareAndSwapInt
                     (this, TRANSFERINDEX, nextIndex,
                      nextBound = (nextIndex > stride ?
                                   nextIndex - stride : 0))) {
                bound = nextBound;
                i = nextIndex - 1;
                advance = false;
            }
        }
        //退出transfer
        if (i < 0 || i >= n || i + n >= nextn) {
            int sc;
            if (finishing) { // -- 扩容完成,实例nextTable指向null, table指向临时变量nextTab
                nextTable = null;
                table = nextTab;
                sizeCtl = (n << 1) - (n >>> 1); // -- 扩容阈值为当前容量的0.75倍
                return;
            }
            /**
                第一个扩容的线程，执行transfer方法之前，会设置 sizeCtl = (resizeStamp(n) << RESIZE_STAMP_SHIFT) + 2)
                后续帮其扩容的线程，执行transfer方法之前，会设置 sizeCtl = sizeCtl+1
                每一个退出transfer的方法的线程，退出之前，会设置 sizeCtl = sizeCtl-1
                那么最后一个线程退出时必然有sc == (resizeStamp(n) << RESIZE_STAMP_SHIFT) + 2)，
                即 (sc - 2) == resizeStamp(n) << RESIZE_STAMP_SHIFT
            */
            // -- 利用cas操作更新扩容阈值,sizeCtl减一,表示这个线程结束帮助扩容了，将sc的低16位减一。
            if (U.compareAndSwapInt(this, SIZECTL, sc = sizeCtl, sc - 1)) {
                if ((sc - 2) != resizeStamp(n) << RESIZE_STAMP_SHIFT)
                    return;
                finishing = advance = true;
                i = n; // recheck before commit
            }
        }
        // -- 遍历到节点为空,放入扩容连接节点
        else if ((f = tabAt(tab, i)) == null)
            advance = casTabAt(tab, i, null, fwd);
        // -- 遍历到连接节点,说明这个点已经被处理过了,直接跳过
        else if ((fh = f.hash) == MOVED)
            advance = true; // already processed
        else {
            // -- 节点上锁
            synchronized (f) {
                if (tabAt(tab, i) == f) {
                    Node<K,V> ln, hn;
                    // -- fh大于0表明这是一个简单node节点
                    if (fh >= 0) {
                        int runBit = fh & n;
                        Node<K,V> lastRun = f;
                        for (Node<K,V> p = f.next; p != null; p = p.next) {
                            int b = p.hash & n;
                            if (b != runBit) {
                                runBit = b;
                                lastRun = p;
                            }
                        }
                        if (runBit == 0) {
                            ln = lastRun;
                            hn = null;
                        }
                        else {
                            hn = lastRun;
                            ln = null;
                        }
                        for (Node<K,V> p = f; p != lastRun; p = p.next) {
                            int ph = p.hash; K pk = p.key; V pv = p.val;
                            if ((ph & n) == 0)
                                ln = new Node<K,V>(ph, pk, pv, ln);
                            else
                                hn = new Node<K,V>(ph, pk, pv, hn);
                        }
                        // -- 将nextTab上的i位置设置为ln链表
                        setTabAt(nextTab, i, ln);
                        // -- 将nextTab上的i+n(n为原tab的长度)位置设置为hn链表
                        setTabAt(nextTab, i + n, hn);
                        // -- 将原tab上的i位置设置为连接节点
                        setTabAt(tab, i, fwd);
                        // 设置advance为true,返回上面的while循环,就是执行i--操作
                        advance = true;
                    }
                    // 如果这是一个TreeBin节点
                    else if (f instanceof TreeBin) {
                        TreeBin<K,V> t = (TreeBin<K,V>)f;
                        TreeNode<K,V> lo = null, loTail = null;
                        TreeNode<K,V> hi = null, hiTail = null;
                        int lc = 0, hc = 0;
                        for (Node<K,V> e = t.first; e != null; e = e.next) {
                            int h = e.hash;
                            TreeNode<K,V> p = new TreeNode<K,V>
                                (h, e.key, e.val, null, null);
                            if ((h & n) == 0) {
                                if ((p.prev = loTail) == null)
                                    lo = p;
                                else
                                    loTail.next = p;
                                loTail = p;
                                ++lc;
                            }
                            else {
                                if ((p.prev = hiTail) == null)
                                    hi = p;
                                else
                                    hiTail.next = p;
                                hiTail = p;
                                ++hc;
                            }
                        }
                        ln = (lc <= UNTREEIFY_THRESHOLD) ? untreeify(lo) :
                            (hc != 0) ? new TreeBin<K,V>(lo) : t;
                        hn = (hc <= UNTREEIFY_THRESHOLD) ? untreeify(hi) :
                            (lc != 0) ? new TreeBin<K,V>(hi) : t;
                        setTabAt(nextTab, i, ln);
                        setTabAt(nextTab, i + n, hn);
                        setTabAt(tab, i, fwd);
                        advance = true;
                    }
                }
            }
        }
    }
}
}
```

### 三个核心方法

* 原子操作
* 对 table 中指定位置节点进行操作
* 一个读方法, 两个写方法(分别对应有锁和无锁)

```java
// -- 获得tab中i位置上的node节点
static final <K,V> Node<K,V> tabAt(Node<K,V>[] tab, int i) {
    return (Node<K,V>)U.getObjectVolatile(tab, ((long)i << ASHIFT) + ABASE);
}

// -- 利用cas操作设置tab中i位置上的node节点, 无锁方法,一般配合自旋调用
static final <K,V> boolean casTabAt(Node<K,V>[] tab, int i,
                                    Node<K,V> c, Node<K,V> v) {
    return U.compareAndSwapObject(tab, ((long)i << ASHIFT) + ABASE, c, v);
}

// -- 利用volatile方法将tab中i位置上的值设置为v, 在锁区域(locked regions)中才能调用此方法
static final <K,V> void setTabAt(Node<K,V>[] tab, int i, Node<K,V> v) {
    U.putObjectVolatile(tab, ((long)i << ASHIFT) + ABASE, v);
}
```


## Q & A
* 为什么 ConcurrentHashMap 的读操作不需要加锁(lock-free)
 1. 核心的读方法tabAt(内部为Unsafe.getObjectVolatile), 配合Node节点上的`value/next`字段均用volatile修饰, 保证了Node节点的可见性
 2. 当节点为TreeBin时, 调用内部的find方法会有读写锁, 但其也是由CAS实现的乐观锁
* ConcurrentHashMap迭代器是强一致性还是弱一致性？HashMap呢？
ConcurrentHashMap弱一致性，HashMap强一致性.
ConcurrentHashMap可以支持在迭代过程中，向map添加新元素，而HashMap则抛出了ConcurrentModificationException，


[ConcurrentHashMap源码分析（JDK8） 扩容实现机制](https://www.jianshu.com/p/487d00afe6ca)
[Java进阶（六）从ConcurrentHashMap的演进看Java多线程核心技术](http://www.jasongj.com/java/concurrenthashmap/)
[什么是 cas](http://www.cnblogs.com/Mainz/p/3546347.html)
[cas in java](http://cmsblogs.com/?p=2235)
[ConcurrentHashMap源码分析（JDK8版本）](http://blog.csdn.net/u010723709/article/details/48007881)
[Java 8 ConcurrentHashMap源码分析](http://www.jianshu.com/p/cf5e024d9432)
[what is thread safe](http://www.jasongj.com/java/thread_safe/)
