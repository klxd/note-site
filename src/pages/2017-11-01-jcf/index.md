---
title: Java Collection Framework
date: "2017-09-12T22:22:22.169Z"
path:  "/java-collection-framework"
tags:
   - java
   - java collection framework
---

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
* 内嵌一个 ArrayList 类,

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

## Q

* 怎么打印数组？ 怎样打印数组中的重复元素
* Array 和 ArrayList 有什么区别？
* 什么时候应该使用 Array 而不是 ArrayList
* 数组和链表数据结构描述，各自的时间复杂度
* 数组有没有 length()这个方法? String 有没有 length()这个方法
* 队列和栈是什么，列出它们的区别
* BlockingQueue 是什么
* 简述 ConcurrentLinkedQueue 和 LinkedBlockingQueue 的用处和不同之处
