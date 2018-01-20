---
title: Java枚举详解
date: "2018-01-19T22:22:22.169Z"
path:  "/java-enum"
tags:
   - java
---


## Enum
```java
public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable {
    public final String name() {
        return name;
    }
    
    public final int ordinal() {
        return ordinal;
    }
    // ...
    
    public static <T extends Enum<T>> T valueOf(Class<T> enumType,
                                                String name) {
        T result = enumType.enumConstantDirectory().get(name);
        if (result != null)
            return result;
        if (name == null)
            throw new NullPointerException("Name is null");
        throw new IllegalArgumentException(
            "No enum constant " + enumType.getCanonicalName() + "." + name);
    }
}
```
* 创建enum时,编译器会自动生成一个相关的类
* Java中所有的枚举类型其实都继承了类```java.lang.Enum```,
  由于Java只支持单继承,所以自定义的枚举类型不能再继承其他类
* 默认有两个字段 -- ```name```(声明时的名字)与```ordinal```(声明时的顺序)
* 编译器会为枚举类型自动添加```valueOf(String)```函数,其实都是调用了父类中同名的静态方法,
  后者需要两个参数(Class与String)
* ```valueOf```函数返回对应的同名枚举实例,**区分大小写**
* 编译器会还会自动添加```values()```方法,用于返回所有实例;
  父类Enum并没有values方法,所以向上转型之后此方法无法使用;
  不过Class中有一个```T[] getEnumConstants()```方法,可以拿到一样的结果

## Enum语法
Q: 写一个**通用**静态函数用于得到枚举实例的ordinal
```java
public static int ordinal(Enum<? extends Enum> enumInstance) {
    return enumInstance.ordinal();
}
```

Q: 写一个**通用**静态方法用于获得枚举类型的所有实例
```java
public static <T extends Enum<T>> T[] values(Class<T> clazz) {
    return clazz.getEnumConstants();
}
```
* ```<T extends Enum<T>>```表示T是一个enum实例

## EnumSet
enum类型可以认为是一种特殊Set,不过由于运行期间无法向其加入元素,所以它只能算一个不太有用的集合.
如果需要使用enum实例构成的Set,创建普通的HashSet虽然可能完成需求,但是其时间和空间效率并不高,
因为基于enum的特性,其实例总数是确定的,因此使用int或long类型上的位操作就可以实现一个高效的Set.
基于这个实现思路,Java 5引入了EnumSet,相比传统的位标志,它有高效和类型安全等优势.
```java
public abstract class EnumSet<E extends Enum<E>> extends AbstractSet<E>
    implements Cloneable, java.io.Serializable
{
    public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
        Enum<?>[] universe = getUniverse(elementType);
        if (universe == null)
            throw new ClassCastException(elementType + " not an enum");

        if (universe.length <= 64)
            return new RegularEnumSet<>(elementType, universe);
        else
            return new JumboEnumSet<>(elementType, universe);
    }
}
```
* EnumSet从Java5引入,用于代替传统的基于int的```位标志```实现
* EnumSet 是一个抽象类,只能通过其静态方法返回其实现实例
* 所有的静态方法都会先调用```noneOf```函数来得到实现实例,
   - 若枚举实例数量小于64,则返回RegularEnumSet实例,内部用一个long存储数据
   - 若枚举实例数量大于等于64,则返回JumboEnumSet实例,内部用long数组存储数据

## 参考
* Thinking in Java 19章 枚举类型
