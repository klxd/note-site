---
title: Java Serialization
date: "2017-11-16T22:22:22.169Z"
path:  "/java-serialization"
tags:
   - java
---

# Java Serialization

**详阅<<thinking in java>>18章12节**

> Java 提供了一种对象序列化的机制，该机制中，一个对象可以被表示为一个字节序列，该字节序列包括该对象的数据、有关对象的类型的信息和存储在对象中数据的类型。
>  将序列化对象写入文件之后，可以从文件中读取出来，并且对它进行反序列化，也就是说，对象的类型信息、对象的数据，还有对象中的数据类型可以用来在内存中新建对象。
>  整个过程都是 Java 虚拟机（JVM）独立的，也就是说，在一个平台上序列化的对象可以在另一个完全不同的平台上反序列化该对象。

* 序列化的是目标是对象而不是类,所以静态变量不会被序列化
* 反序列化过程一般不调用类的构造函数

## Serializable接口 
```java
public interface Serializable {
}
```
* 没有任何成员函数,是一个语义化的接口(Marker Interface)
* 父类实现了Serializable接口,子类自动实现序列化,不需要再显示声明
* 子类实现了Serializable接口,父类没有实现此接口
    1. 若想让父类序列化,则需让父类对象实现此接口
    2. 若不想让父类对象序列化,则父类必须要有无参构造函数(可在此函数中为父类成员变量设置初始值)

## serialVersionUID

* 序列化ID不一致,即使类的成员变量都一致,也无法反序列化成功
* 实现了Serializable接口的类,如果不显式声明serialVersionUID
   1. 编译器会根据类名、接口名和成员变量(名字,类型,访问控制符)等信息自动生成
   2. 此时如果此类有新的改动,会导致反序列化失败
* 通过更新序列化ID可以控制类的版本更新


## transient 关键字
* 声明为transient的域不会被序列化,反序列化之后为该类型的初始值

## writeObject()方法 & readObject()方法

```java
public class Person implements Serializable {
    
    transient private Integer age = null;
    

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        out.writeInt(age);
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        age = in.readInt();
    }
}
```
* 可以利用此方法可以自定义序列化的内容,比如将标记为transient的域也写入
* 序列化过程中,虚拟机会试图调用对象类的writeObject()方法和readObject()方法
* 此方法为私有方法,利用虚拟机反射调用
* 此方法设置为私有方法可以避免被继承或者覆盖
* 如果父类实现了Serializable接口,而子类不想实现序列化,可以实现此方法并抛出NotSerializableException异常



## ObjectOutputStream & ObjectInputStream

```java
public class ObjectOutputStream
    extends OutputStream implements ObjectOutput, ObjectStreamConstants
{
    // -- 序列化的关键函数
    private void writeObject0(Object obj, boolean unshared)
        throws IOException {
        // ......
        // remaining cases
        if (obj instanceof String) {
            writeString((String) obj, unshared);
        } else if (cl.isArray()) {
            writeArray(obj, desc, unshared);
        } else if (obj instanceof Enum) {
            writeEnum((Enum<?>) obj, desc, unshared);
        } else if (obj instanceof Serializable) {
            writeOrdinaryObject(obj, desc, unshared);
        } else {
            if (extendedDebugInfo) {
                throw new NotSerializableException(
                    cl.getName() + "\n" + debugInfoStack.toString());
            } else {
                throw new NotSerializableException(cl.getName());
            }
        }
        // ......
    }
}
```
* String,Array,Enum和实现了Serializable的对象才可以序列化,否则报异常


## Externalizable 接口
```java
public interface Externalizable extends java.io.Serializable {
    /**
     * The object implements the writeExternal method to save its contents
     * by calling the methods of DataOutput for its primitive values or
     * calling the writeObject method of ObjectOutput for objects, strings,
     * and arrays.
     *
     * @serialData Overriding methods should use this tag to describe
     *             the data layout of this Externalizable object.
     *             List the sequence of element types and, if possible,
     *             relate the element to a public/protected field and/or
     *             method of this Externalizable class.
     *
     */
    void writeExternal(ObjectOutput out) throws IOException;

    /**
     * The object implements the readExternal method to restore its
     * contents by calling the methods of DataInput for primitive
     * types and readObject for objects, strings and arrays.  The
     * readExternal method must read the values in the same sequence
     * and with the same types as were written by writeExternal.
     *
     * @param in the stream to read data from in order to restore the object
     * @exception IOException if I/O errors occur
     * @exception ClassNotFoundException If the class for an object being
     *              restored cannot be found.
     */
    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```
* 扩展了Serializable接口,实现此接口可以自定义序列化过程,JVM默认的序列化不会生效
* 有两个方法,对应了普通序列化的`writeObject`和`readObject`
* 实现此接口的类在反序列化过程中,会调用类的无参构造函数,而实现Serializable接口则不会
* 序列化的细节都需要程序员去完成

## readResolve()方法
```java
public class Person implements Serializable {

    private static class InstanceHolder {
        private static final Person instance = new Person("John", 31, Gender.MALE);
    }

    public static Person getInstance() {
        return InstanceHolder.instance;
    }
    private String name = null;
    private Integer age = null;
    private Gender gender = null;
    // 永远返回同一个实例对象
    private Object readResolve() throws ObjectStreamException {
        return InstanceHolder.instance;
    }
    
}
```
* 因为普通反序列化过程中不需要使用构造函数,导致单例(singleton)的特性可能被破坏,利用此函数可以解决这个问题
* 无论是实现Serializable接口，或是Externalizable接口，当从I/O流中读取对象时，readResolve()方法都会被调用到


[Top 10 Java Serialization Interview Questions and Answers](http://javarevisited.blogspot.sg/2011/04/top-10-java-serialization-interview.html)
[理解Java对象序列化](http://www.blogjava.net/jiangshachina/archive/2012/02/13/369898.html)