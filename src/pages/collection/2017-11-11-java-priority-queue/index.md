---
title: Java PriorityQueue
date: "2017-11-11T22:22:22.169Z"
path:  "/java-priority-queue"
tags:
   - java
   - java collection framework
---

* 优先队列,能保证每次取出来的元素都是队列中权值**最小**的(C++中每次取最大的元素)
* 元素大小比较可使用构造时传入的比较器或者使用元素的自然顺序(natural order)
* 不允许放入 null 元素
* 通过完全二叉树实现的最小堆,底层通过数组实现

最小堆:
* 插入: 将节点插在二叉树的最后一个叶子结点位置，然后比较它与它父亲节点的大小：如果大则停止；如果小则交换位置，然后对父亲节点递归该过程直至根节点。复杂度为O(log(n))
* 删除: 用最后一个节点替换掉要删除的节点，然后调整节点顺序以维持堆特性。

```java
public class PriorityQueue<E> extends AbstractQueue<E>
    implements java.io.Serializable {
    /**
     * Priority queue represented as a balanced binary heap: the two
     * children of queue[n] are queue[2*n+1] and queue[2*(n+1)].  The
     * priority queue is ordered by comparator, or by the elements'
     * natural ordering, if comparator is null: For each node n in the
     * heap and each descendant d of n, n <= d.  The element with the
     * lowest value is in queue[0], assuming the queue is nonempty.
     */
    transient Object[] queue; // non-private to simplify nested class access

    /**
     * The number of elements in the priority queue.
     * -- 当前队列中的元素个数
     */
    private int size = 0;

    /**
     * The comparator, or null if priority queue uses elements'
     * natural ordering.
     */
    private final Comparator<? super E> comparator;

    /**
     * The number of times this priority queue has been
     * <i>structurally modified</i>.  See AbstractList for gory details.
     */
    transient int modCount = 0; // non-private to simplify nested class access
}
```

## add() & offer()

```java
public boolean add(E e) {
    return offer(e);
}
public boolean offer(E e) {
    if (e == null) // -- 不允许放入空元素
        throw new NullPointerException();
    modCount++;
    int i = size;
    if (i >= queue.length) // -- 若队列中元素已满,则扩容
        grow(i + 1);
    size = i + 1;
    if (i == 0) // -- 若队列为空,则插入为第一个元素
        queue[0] = e;
    else
        siftUp(i, e);
    return true;
}

private void grow(int minCapacity) {
    int oldCapacity = queue.length;
    // -- 若size小于64,则增大100%, 否则增大50%
    // Double size if small; else grow by 50%
    int newCapacity = oldCapacity + ((oldCapacity < 64) ?
                                     (oldCapacity + 2) :
                                     (oldCapacity >> 1));
    // overflow-conscious code
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // -- 简单地把原数组的内容完全拷过去
    queue = Arrays.copyOf(queue, newCapacity);
}
```

## siftUp(int k, E x)

```java
// -- k: 准备插入的位置, x: 插入的元素
private void siftUp(int k, E x) {
    if (comparator != null)
        siftUpUsingComparator(k, x);
    else
        siftUpComparable(k, x);
}

@SuppressWarnings("unchecked")
private void siftUpComparable(int k, E x) {
    Comparable<? super E> key = (Comparable<? super E>) x;
    while (k > 0) {
        int parent = (k - 1) >>> 1;
        Object e = queue[parent];
        if (key.compareTo((E) e) >= 0)
            break;
        queue[k] = e;
        k = parent;
    }
    queue[k] = key;
}

@SuppressWarnings("unchecked")
private void siftUpUsingComparator(int k, E x) {
    while (k > 0) {
        int parent = (k - 1) >>> 1;
        Object e = queue[parent];
        if (comparator.compare(x, (E) e) >= 0)
            break;
        queue[k] = e;
        k = parent;
    }
    queue[k] = x;
}
```

* 根据是否有比较器,调用`siftUpUsingComparator`或`siftUpComparable`,这两个函数内部逻辑基本相同
* 根据插入位置 k 计算出其父亲节点的位置(`(k-1)/2`)parent, 比较父亲节点`parent`和准备插入点`x`的权值
* 若`parent小于x`,则当前 k 为合适的插入位置,退出循环
* 否则将父亲节点往下挪动(放到 k 所在的位置),并将 k 赋值为 parent,重复迭代

## element() & peek

```java
public E peek() {
    return (size == 0) ? null : (E) queue[0];
}
```

* 获取但不删除队首元素
* 由最小堆的性质,数组的第一个位置就是队首

## poll

```java
public E poll() {
    if (size == 0)
        return null;
    int s = --size;
    modCount++;
    E result = (E) queue[0]; // -- 队尾元素
    E x = (E) queue[s]; // -- 队首元素
    queue[s] = null; // -- 删除队尾元素
    if (s != 0) // -- 若队列不为空
        siftDown(0, x); // -- 将队尾元素插入到队首,并调整堆的结构
    return result;
}
```

* 删除队首元素
* 将队尾元素插入到队首,调用 siftDown 调整堆结构

## siftDown(int k, E x)

从 k 指定的位置开始，将 x 逐层向下与当前点的左右孩子中较小的那个交换，直到 x 小于或等于左右孩子中的任何一个为止

```java
private void siftDown(int k, E x) {
    if (comparator != null)
        siftDownUsingComparator(k, x);
    else
        siftDownComparable(k, x);
}

@SuppressWarnings("unchecked")
private void siftDownComparable(int k, E x) {
    Comparable<? super E> key = (Comparable<? super E>)x;
    int half = size >>> 1;        // loop while a non-leaf
    while (k < half) { // -- 若大于half则为叶子节点,没有sift down的必要
        int child = (k << 1) + 1; // assume left child is least
        Object c = queue[child];
        int right = child + 1;
        if (right < size && // -- 若右儿子存在且小于左儿子,则将child赋值为右儿子
            ((Comparable<? super E>) c).compareTo((E) queue[right]) > 0)
            c = queue[child = right];
        if (key.compareTo((E) c) <= 0) // 若待插入元素小于左右两个儿子节点,退出循环
            break;
        queue[k] = c; // 将较小的儿子节点上提
        k = child; // 待插入位置修改
    }
    queue[k] = key;
}

@SuppressWarnings("unchecked")
private void siftDownUsingComparator(int k, E x) {
    int half = size >>> 1;
    while (k < half) {
        int child = (k << 1) + 1;
        Object c = queue[child];
        int right = child + 1;
        if (right < size &&
            comparator.compare((E) c, (E) queue[right]) > 0)
            c = queue[child = right];
        if (comparator.compare(x, (E) c) <= 0)
            break;
        queue[k] = c;
        k = child;
    }
    queue[k] = x;
}
```

* 根据是否有比较器,调用`siftDownComparable`或`siftDownUsingComparator`,这两个函数内部逻辑基本相同
* 若待插入位置小于队列元素数量的一半,则待插入位置为叶子节点,直接插入即可
* 拿到左右两个子节点中较小的那个,与待插入元素比较
* 若待插入元素小于左右两个子节点,退出循环
* 若待插入元素大于较小的子节点,将较小的子节点上提,插入位置修改为较小子节点的位子,继续循环

## remove(Object o)

```java
public boolean remove(Object o) {
    int i = indexOf(o);
    if (i == -1)
        return false;
    else {
        removeAt(i);
        return true;
    }
}
private E removeAt(int i) {
    // assert i >= 0 && i < size;
    modCount++;
    int s = --size;
    // -- 若删除的是最后一个元素,不会破坏堆的性质
    if (s == i) // removed last element
        queue[i] = null;
    else {
        E moved = (E) queue[s]; // -- 最后一个元素
        queue[s] = null;
        siftDown(i, moved); // -- 将最后一个元素插入到被删除的位置,试着做siftDown
        if (queue[i] == moved) { // -- 若它没有被siftDown,则可能是需要做siftUp
            siftUp(i, moved);
            if (queue[i] != moved)
                return moved;
        }
    }
    return null;
}
```

* 删除队列中跟 o 相等的某一个元素
* 将最后一个元素填充到被删除的位置
* 试着做 siftDown
* 若该元素没有被 siftDown,则试着做 siftUp (因为被删除的元素不一定是在堆顶,可能需要做 siftUp)
