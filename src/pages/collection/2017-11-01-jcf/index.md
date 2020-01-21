---
title: Java Collection Framework
date: "2017-09-12T22:22:22.169Z"
path:  "/java-collection-framework"
tags:
   - java
   - java collection framework
---

## 概览

* List
   * [ArrayList](/java-array-list)
   * [LinkedList](/java-linked-list)
* Map
   * [HashMap](/java-hash-map)
   * [TreeMap](/java-tree-map)
   * [LinkedHashMap](/java-linked-hash-map)
   * [HashTable](/java-hash-table)
   * [ConcurrentHashMap](java-concurrent-hash-map)
* Set
   * [HashSet](/java-hash-map#hash-set)
   * [BitSet](/java-bit-set)


## interface Queue

```java
public interface Queue<E> extends Collection<E> {
    /** 向队尾插入元素,失败则抛出异常 */
    boolean add(E e);

    /** 向队尾插入元素,失败返回false */
    boolean offer(E e);

    /** 获取并删除队首元素,失败则抛出异常 */
    E remove();

    /** 获取并删除队首元素,失败则返回null */
    E poll();

    /** 获取但不删除队首元素,失败则抛出异常 */
    E element();

    /** 获取但不删除队首元素,失败则返回null */
    E peek();
}
```

## interface

## 工具类 Arrays

```java
public class Arrays {

    // Suppresses default constructor, ensuring non-instantiability.
    private Arrays() {}
    /**
     * @serial include
     */
}
```

* 静态工具类,无法实例化
* 内嵌一个ArrayList类,

### Arrays.asList(T...a)

```java
{
    @SafeVarargs
    @SuppressWarnings("varargs")
    public static <T> List<T> asList(T... a) {
        return new ArrayList<>(a);
    }

    private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable
    {
        private static final long serialVersionUID = -2764017481108945198L;
        private final E[] a;

        // -- 直接使用传入的数组作为底层容器
        ArrayList(E[] array) {
            a = Objects.requireNonNull(array);
        }

        @Override
        public int size() {
            return a.length;
        }

        @Override
        public Object[] toArray() {
            return a.clone();
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T[] toArray(T[] a) {
            int size = size();
            if (a.length < size)
                return Arrays.copyOf(this.a, size,
                                     (Class<? extends T[]>) a.getClass());
            System.arraycopy(this.a, 0, a, 0, size);
            if (a.length > size)
                a[size] = null;
            return a;
        }

        @Override
        public E get(int index) {
            return a[index];
        }

        @Override
        public E set(int index, E element) {
            E oldValue = a[index];
            a[index] = element;
            return oldValue;
        }

        @Override
        public int indexOf(Object o) {
            E[] a = this.a;
            if (o == null) {
                for (int i = 0; i < a.length; i++)
                    if (a[i] == null)
                        return i;
            } else {
                for (int i = 0; i < a.length; i++)
                    if (o.equals(a[i]))
                        return i;
            }
            return -1;
        }

        @Override
        public boolean contains(Object o) {
            return indexOf(o) != -1;
        }

        @Override
        public Spliterator<E> spliterator() {
            return Spliterators.spliterator(a, Spliterator.ORDERED);
        }

        @Override
        public void forEach(Consumer<? super E> action) {
            Objects.requireNonNull(action);
            for (E e : a) {
                action.accept(e);
            }
        }

        @Override
        public void replaceAll(UnaryOperator<E> operator) {
            Objects.requireNonNull(operator);
            E[] a = this.a;
            for (int i = 0; i < a.length; i++) {
                a[i] = operator.apply(a[i]);
            }
        }

        @Override
        public void sort(Comparator<? super E> c) {
            Arrays.sort(a, c);
        }
    }
}
```

* 返回 Arrays 的内部类 ArrayList 的实例
* Arrays.ArrayList 直接将传入的数组作为底层容器
* Arrays.ArrayList 没有实现`add`和`remove`等函数,若调用会直接抛出异常

## Java集合类中的Iterator和ListIterator的区别对
List来说，你也可以通过listIterator()取得其迭代器，两种迭代器在有些时候是不能通用的，Iterator和ListIterator主要区别在以下方面：
* iterator()方法在set和list接口中都有定义，但是ListIterator()仅存在于list接口中（或实现类中）；
* ListIterator有add()方法，可以向List中添加对象，而Iterator不能ListIterator和Iterator都有hasNext()和next()方法，可以实现顺序向后遍历，
  但是ListIterator有hasPrevious()和previous()方法，可以实现逆向（顺序向前）遍历。Iterator就不可以。
* ListIterator可以定位当前的索引位置，nextIndex()和previousIndex()可以实现。Iterator没有此功能。
* 都可实现删除对象，但是ListIterator可以实现对象的修改，set()方法可以实现。Iierator仅能遍历，不能修改。
   

## Q

* Array 和 ArrayList 有什么区别？
* 数组有没有 length()这个方法? String 有没有 length()这个方法
* 简述 ConcurrentLinkedQueue 和 LinkedBlockingQueue 的用处和不同之处
