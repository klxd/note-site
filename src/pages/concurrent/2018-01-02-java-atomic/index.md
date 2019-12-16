---
title: Java中的原子操作类
date: "2017-12-25T22:22:22.169Z"
path:  "/java-atomic"
tags:
   - java
---

## 原子更新基本类型

* AtomicInteger 原子更新整形
* AtomicBoolean 原子更新布尔类型
* AtomicLong 原子更新长整形
* 对于其他基本类型`double`,`float`,`byte`,`char`没有相应的原子更新类,因为其相应的更新类均可以使用以上三个类进行包装得到(AtomicBoolean就是通过包装为int实现),
  如`byte`和`char`可简单包装为整形,
  `float`可以使用`Float.floatToIntBits`转化为整形,
  `double`可以使用`Double.doubleToLongBits`转化为长整形

AtomicInteger

```java
public class AtomicInteger extends Number implements java.io.Serializable {

    public AtomicInteger(int initialValue) {
        value = initialValue;
    }

    public AtomicInteger() {}

    public final int get() {
        return value;
    }

    public final void set(int newValue) {
        value = newValue;
    }

    /**
     * 最终设置成新值,使用lazySet设置值之后,
     * 可能导致其他线程在之后的一小段时间内还是读取旧的值
     */
    public final void lazySet(int newValue) {
        unsafe.putOrderedInt(this, valueOffset, newValue);
    }

    /**
     * 设置新值并返回旧值
     */
    public final int getAndSet(int newValue) {
        return unsafe.getAndSetInt(this, valueOffset, newValue);
    }

    /**
     * 若当前值等于期望值,则设置为新值
     * @return 是否更新成功,即当前值是否等于期望值
     */
    public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }

    /**
     * 过期的方法,实现与compareAndSet相同
     */
    public final boolean weakCompareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }

    /**
     * i++
     */
    public final int getAndIncrement() {
        return unsafe.getAndAddInt(this, valueOffset, 1);
    }

    /**
     * i--
     */
    public final int getAndDecrement() {
        return unsafe.getAndAddInt(this, valueOffset, -1);
    }

    /**
     * i += n, return old i
     */
    public final int getAndAdd(int delta) {
        return unsafe.getAndAddInt(this, valueOffset, delta);
    }

    /**
     * ++i
     */
    public final int incrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
    }

    /**
     * --i
     */
    public final int decrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, -1) - 1;
    }

    /**
     * i += n, return updated i
     */
    public final int addAndGet(int delta) {
        return unsafe.getAndAddInt(this, valueOffset, delta) + delta;
    }

    /**
     * 传入一个函数来更新数值,此函数应该是无副作用的,因为它可能被调用多次
     * @return 旧值
     */
    public final int getAndUpdate(IntUnaryOperator updateFunction) {
        int prev, next;
        do {
            prev = get();
            next = updateFunction.applyAsInt(prev);
        } while (!compareAndSet(prev, next));
        return prev;
    }

    /**
     * 传入一个函数来更新数值,此函数应该是无副作用的,因为它可能被调用多次
     * @return 新值
     */
    public final int updateAndGet(IntUnaryOperator updateFunction) {
        int prev, next;
        do {
            prev = get();
            next = updateFunction.applyAsInt(prev);
        } while (!compareAndSet(prev, next));
        return next;
    }

    /**
     * 传入一个无副作用的,需要两个参数的函数
     * @return 旧值
     */
    public final int getAndAccumulate(int x,
                                      IntBinaryOperator accumulatorFunction) {
        int prev, next;
        do {
            prev = get();
            next = accumulatorFunction.applyAsInt(prev, x);
        } while (!compareAndSet(prev, next));
        return prev;
    }

    /**
     * 传入一个无副作用的,需要两个参数的函数
     * @return 新值
     */
    public final int accumulateAndGet(int x,
                                      IntBinaryOperator accumulatorFunction) {
        int prev, next;
        do {
            prev = get();
            next = accumulatorFunction.applyAsInt(prev, x);
        } while (!compareAndSet(prev, next));
        return next;
    }
}
```

## 原子更新数组

* AtomicIntegerArray: 原子更新整形数组中的元素
* AtomicLongArray: 原子更新长整型数组里的元素
* AtomicReferenceArray: 原子更新引用类型数组里的元素

## 原子更新引用类型

* AtomicReference
原子更新基本类型的AtomicInteger,只能更新一个变量,如果要原子更新多个变量,就需
要使用这个原子更新引用类型提供的类

```java
public class AtomicReference<V> implements java.io.Serializable {

    private volatile V value;

    /**
     * 构造函数,附带初始值
     */
    public AtomicReference(V initialValue) {
        value = initialValue;
    }

    /**
     * 构造函数,初始值为null
     */
    public AtomicReference() {
    }

    /**
     * 返回当前值
     */
    public final V get() {
        return value;
    }

    /**
     * 设置新值
     */
    public final void set(V newValue) {
        value = newValue;
    }

    /**
     * 最终设置为新值,之前有一段时间可能为旧值
     */
    public final void lazySet(V newValue) {
        unsafe.putOrderedObject(this, valueOffset, newValue);
    }

    /**
     * CAS,注意期望值必须{@code ==}当前值,若只是{@code equals}将会判定为不等
     * @return 是否成功
     */
    public final boolean compareAndSet(V expect, V update) {
        return unsafe.compareAndSwapObject(this, valueOffset, expect, update);
    }

    /**
     * 过期函数,实现与CAS相同
     */
    public final boolean weakCompareAndSet(V expect, V update) {
        return unsafe.compareAndSwapObject(this, valueOffset, expect, update);
    }

    /**
     * 设置新值,返回旧值
     */
    @SuppressWarnings("unchecked")
    public final V getAndSet(V newValue) {
        return (V)unsafe.getAndSetObject(this, valueOffset, newValue);
    }

    /**
     * 传入一个无副作用的函数,修改当前值为新值
     * @return 旧值
     */
    public final V getAndUpdate(UnaryOperator<V> updateFunction) {
        V prev, next;
        do {
            prev = get();
            next = updateFunction.apply(prev);
        } while (!compareAndSet(prev, next));
        return prev;
    }

    /**
     * 传入一个无副作用的函数,修改当前值为新值
     * @return 新值
     */
    public final V updateAndGet(UnaryOperator<V> updateFunction) {
        V prev, next;
        do {
            prev = get();
            next = updateFunction.apply(prev);
        } while (!compareAndSet(prev, next));
        return next;
    }

    /**
     * 传入一个操作值和一个二元操作函数,计算得到新值
     * @return 旧值
     */
    public final V getAndAccumulate(V x,
                                    BinaryOperator<V> accumulatorFunction) {
        V prev, next;
        do {
            prev = get();
            next = accumulatorFunction.apply(prev, x);
        } while (!compareAndSet(prev, next));
        return prev;
    }

    /**
     * 传入一个操作值和一个二元操作函数,计算得到新值
     * @return 新值
     */
    public final V accumulateAndGet(V x,
                                    BinaryOperator<V> accumulatorFunction) {
        V prev, next;
        do {
            prev = get();
            next = accumulatorFunction.apply(prev, x);
        } while (!compareAndSet(prev, next));
        return next;
    }
}
```

### 代码示例

```java
import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceTest {

    private static AtomicReference<User> userAtomicReference = new AtomicReference<>();

    static class User {
        private String name;
        private int id;
        public User(String name, int id) {
            this.name = name;
            this.id = id;
        }

        @Override
        public String toString() {
            return String.format("User[name: %s, id: %s]", name, id);
        }

        @Override
        public boolean equals(Object obj) {
            if (!(obj instanceof User)) {
                return false;
            }
            User o = (User) obj;
            return o.hashCode() == hashCode() && o.name.equals(name) && o.id == id;
        }

        @Override
        public int hashCode() {
            return name.hashCode() * 53 + id;
        }
    }

    public static void main(String[] args) {
        User user1 = new User("u1", 10);
        User user2 = new User("u2", 12);
        User user3 = new User("u1", 10);

        userAtomicReference.set(user1);

        System.out.println(userAtomicReference.get() == user1); // true
        System.out.println(userAtomicReference.get() == user3); // false
        System.out.println(userAtomicReference.get().equals(user3)); // true

        // 使用user3做CAS,更新失败
        userAtomicReference.compareAndSet(user3, user2);
        System.out.println(userAtomicReference.get());

        // 使用user1做CAS,更新成功
        userAtomicReference.compareAndSet(user1, user2);
        System.out.println(userAtomicReference.get());
    }
}
```

输出为

```
true
false
true
User[name: u1, id: 10]
User[name: u2, id: 12]
```

## 原子更新字段

* AtomicIntegerFieldUpdater: 原子更新整型的字段的更新器
* AtomicLongFieldUpdater: 原子更新长整型字段的更新器
* AtomicStampedReference: 原子更新带有版本号的引用类型.该类将整数值与引用关联起来,可用于原子的更新数据和数据的版本号,
  可以解决使用CAS进行原子更新时可能出现的 ABA 问题

```java
public abstract class AtomicIntegerFieldUpdater<T> {
    /**
     * 静态方法,用于构建一个更新器对象
     * @param tclass 需要被更新的类
     * @param fieldName 需要被更新的字段
     */
    @CallerSensitive
    public static <U> AtomicIntegerFieldUpdater<U> newUpdater(Class<U> tclass,
                                                              String fieldName) {
        return new AtomicIntegerFieldUpdaterImpl<U>
            (tclass, fieldName, Reflection.getCallerClass());
    }

    /**
     * CAS
     * @param obj An object whose field to conditionally set
     * @param expect the expected value
     * @param update the new value
     * @return 是否更新成功
     */
    public abstract boolean compareAndSet(T obj, int expect, int update);

    /**
     * 过期方法,作用同CAS
     */
    public abstract boolean weakCompareAndSet(T obj, int expect, int update);

    /**
     * 设置新值
     */
    public abstract void set(T obj, int newValue);

    /**
     * 最终设置为新值
     */
    public abstract void lazySet(T obj, int newValue);

    /**
     * 获得值
     */
    public abstract int get(T obj);

    /**
     * 设置新值,返回旧值
     */
    public int getAndSet(T obj, int newValue) {
        int prev;
        do {
            prev = get(obj);
        } while (!compareAndSet(obj, prev, newValue));
        return prev;
    }

    /**
     * i++
     */
    public int getAndIncrement(T obj) {
        int prev, next;
        do {
            prev = get(obj);
            next = prev + 1;
        } while (!compareAndSet(obj, prev, next));
        return prev;
    }

    /**
     * i--
     */
    public int getAndDecrement(T obj) {
        int prev, next;
        do {
            prev = get(obj);
            next = prev - 1;
        } while (!compareAndSet(obj, prev, next));
        return prev;
    }

    /**
     * i += n, 返回旧值
     */
    public int getAndAdd(T obj, int delta) {
        int prev, next;
        do {
            prev = get(obj);
            next = prev + delta;
        } while (!compareAndSet(obj, prev, next));
        return prev;
    }

    /**
     * ++i
     */
    public int incrementAndGet(T obj) {
        int prev, next;
        do {
            prev = get(obj);
            next = prev + 1;
        } while (!compareAndSet(obj, prev, next));
        return next;
    }

    /**
     * --i
     */
    public int decrementAndGet(T obj) {
        int prev, next;
        do {
            prev = get(obj);
            next = prev - 1;
        } while (!compareAndSet(obj, prev, next));
        return next;
    }

    /**
     * i += n, 返回新值
     */
    public int addAndGet(T obj, int delta) {
        int prev, next;
        do {
            prev = get(obj);
            next = prev + delta;
        } while (!compareAndSet(obj, prev, next));
        return next;
    }

    /**
     * 传入一个无副作用的函数用于更新值
     * @return 旧值
     */
    public final int getAndUpdate(T obj, IntUnaryOperator updateFunction) {
        int prev, next;
        do {
            prev = get(obj);
            next = updateFunction.applyAsInt(prev);
        } while (!compareAndSet(obj, prev, next));
        return prev;
    }

    /**
     * 传入一个无副作用的函数用于更新值
     * @return 新值
     */
    public final int updateAndGet(T obj, IntUnaryOperator updateFunction) {
        int prev, next;
        do {
            prev = get(obj);
            next = updateFunction.applyAsInt(prev);
        } while (!compareAndSet(obj, prev, next));
        return next;
    }

    /**
     * 传入一个操作数和二元操作函数用于计算新值
     * @return 旧值
     */
    public final int getAndAccumulate(T obj, int x,
                                      IntBinaryOperator accumulatorFunction) {
        int prev, next;
        do {
            prev = get(obj);
            next = accumulatorFunction.applyAsInt(prev, x);
        } while (!compareAndSet(obj, prev, next));
        return prev;
    }

    /**
     * 传入一个操作数和二元操作函数用于计算新值
     * @return 新值
     */
    public final int accumulateAndGet(T obj, int x,
                                      IntBinaryOperator accumulatorFunction) {
        int prev, next;
        do {
            prev = get(obj);
            next = accumulatorFunction.applyAsInt(prev, x);
        } while (!compareAndSet(obj, prev, next));
        return next;
    }
}
```

### 代码示例

```java
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;

public class AtomicIntegerFieldUpdaterTest {
    private static AtomicIntegerFieldUpdater<User> a = AtomicIntegerFieldUpdater.newUpdater(User.class, "id");
    static class User {
        private String name;
        volatile int id;
        public User(String name, int id) {
            this.name = name;
            this.id = id;
        }

        @Override
        public String toString() {
            return String.format("User[name: %s, id: %s]", name, id);
        }

        @Override
        public boolean equals(Object obj) {
            if (!(obj instanceof User)) {
                return false;
            }
            User o = (User) obj;
            return o.hashCode() == hashCode() && o.name.equals(name) && o.id == id;
        }

        @Override
        public int hashCode() {
            return name.hashCode() * 53 + id;
        }
    }

    public static void main(String[] args) {
        User user1 = new User("u1", 10);
        System.out.println(a.getAndIncrement(user1));
        System.out.println(a.get(user1));
    }
}
```

代码输出:

```
10
11
```
