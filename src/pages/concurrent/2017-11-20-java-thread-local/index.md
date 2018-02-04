---
title: Java Thread Local
date: "2017-11-20T22:22:22.169Z"
path:  "/java-thread-local"
tags:
   - java
---



## 线程封闭

当访问共享的可变数据时,通常需要使用同步.一种避免使用同步的方式就是不共享数据,如果仅在单线程内访问数据,
就不需要同步,这种数据被称为**线程封闭**(Thread Confinement)

线程封闭的一种常见的应用是JDBC(Java Database Connectivity)的Connect对象.JDBC的规范并不要求
Connection对象必须是线程安全的,在典型的服务器应用程序中,线程从连接池获得一个Connection对象,
并用该对象来处理请求,使用完之后再将对象返还给连接池.由于大多数请求都是由单个线程采用同步的方式来处理,
并且在Connection对象返回之前,连接池不会将它分配给其他线程.因此,这种连接管理模式在处理请求时**隐含**
地将对象封闭在线程中.

## ThreadLocal 类

维持线程封闭性的一种规范方法是使用 ThreadLocal,这个类能使线程中的某个值与保存值的对象关联起来.
ThreadLocal提供了get和set等访问接口或方法,由于ThreadLocal在每个线程都存有一份独立的副本,
因此get总是返回当前执行线程在调用set是设置的最新值.

ThreadLocal通常用于防止对可变的单例变量或者全局变量进行共享.

```java
public class ThreadLocal<T> {
    public static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier) {
        return new SuppliedThreadLocal<>(supplier);
    }
    public ThreadLocal() {
    }

    /**
     * 返回此ThreadLocal在当前线程中的值,若还没有设置则会调用
     * {@link #initialValue}来设置初始值
     */
    public T get() {
        // ...
    }

    /**
     * Sets the current thread's copy of this thread-local variable
     * to the specified value.  Most subclasses will have no need to
     * override this method, relying solely on the {@link #initialValue}
     * method to set the values of thread-locals.
     * 设置此ThreadLocal在当前线程中的值,一般来说可以依靠{@link #initialValue}
     * 设置初始值,而不是通过调用此方法
     */
    public void set(T value) {
        // ...
    }

    /**
     * 删除此ThreadLocal在当前线程中的值,如果接下来本线程继续调用get方法(且没调用set方法),
     * 将会触发{@link #initialValue}的调用
     * @since 1.5
     */
    public void remove() {
        // ...
    }
}
```

## 实现原理


ThreadLocal中的静态类
```java
/**
 * 底层实现类似HashMap，Key为ThreadLocal本身，Value为对应的值
 */
static class ThreadLocalMap {

    /**
     * 使用弱引用保证ThreadLocal本身不会内存泄漏，即使没有手动删除，ThreadLocal本身也会被删除，
     * 下一次调用ThreadLocalMap的get、set和remove函数会将value回收
     */
    static class Entry extends WeakReference<ThreadLocal<?>> {
        /** The value associated with this ThreadLocal. */
        Object value;

        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }

    /**
     * The initial capacity -- MUST be a power of two.
     */
    private static final int INITIAL_CAPACITY = 16;

    /**
     * The table, resized as necessary.
     * table.length MUST always be a power of two.
     */
    private Entry[] table;

    /**
     * The number of entries in the table.
     */
    private int size = 0;

    /**
     * The next size value at which to resize.
     */
    private int threshold; // Default to 0
    
    // ...

}
```

Thread中的Map实例
```java
public
class Thread implements Runnable {
    /** 
     * ThreadLocal的内部静态类，这个不是private域，包内共享，可以被ThreadLocal类直接访问
     * 由于其生命周期与Thread一样，如果没有手动删除其中key为null的value，就会导致内存泄漏
     */
    ThreadLocal.ThreadLocalMap threadLocals = null;
}
```

Thread中的Map的初始化时机 -- 其中某个ThreadLocal实例首次调用init或者set函数
```java
public class ThreadLocal<T> {
    private T setInitialValue() {
        T value = initialValue();
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
        return value;
    }
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }
    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }
}
```

* 在每个线程中，都维护了一个threadlocals对象，在没有ThreadLocal变量的时候是null的。
* 一旦在ThreadLocal的createMap函数中初始化之后，这个threadlocals就初始化了。
* 这个映射表的 key 是 ThreadLocal实例本身，value 是真正需要存储的 Object
* 以后每次那个ThreadLocal对象想要访问变量的时候，比如set函数和get函数，都是先通过getMap(t)函数，
  先将线程的map取出，然后再从这个在线程（Thread）中维护的map中取出数据

## ThreadLocal导致的内存泄漏

底层实现分析：
* ThreadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value。
* 值得注意的是图中的虚线，表示 ThreadLocalMap 是使用 ThreadLocal 的弱引用作为 Key 的，
  弱引用的对象在 GC 时会被回收。
  
内存泄漏产生情景：  
* 如果一个ThreadLocal没有外部强引用来引用它，那么系统 GC 的时候，这个ThreadLocal势必会被回收，
  这样一来，ThreadLocalMap中就会出现key为null的Entry，就没有办法访问这些key为null的Entry的value。
* 如果当前线程再迟迟不结束的话，这些key为null的Entry的value就会一直存在一条强引用链：
  Thread Ref -> Thread -> ThreaLocalMap -> Entry -> value  

预防手段：
* ThreadLocalMap的设计中已经考虑到这种情况，也加上了一些防护措施：
   在ThreadLocal的get(),set(),remove()的时候都会清除线程ThreadLocalMap里所有key为null的value。

预防措施并不能保证不会内存泄漏：
* 使用static的ThreadLocal，延长了ThreadLocal的生命周期，可能导致的内存泄漏
* 分配使用了ThreadLocal又不再调用get(),set(),remove()方法，那么就会导致内存泄漏


## 参考资料
* **Java并发编程实战 第3章第3节**
* [深入分析 ThreadLocal 内存泄漏问题](http://www.importnew.com/22039.html)
