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



## 参考资料
* **Java并发编程实战 第3章第3节**