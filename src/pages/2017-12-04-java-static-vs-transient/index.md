---
title: Java中的序列化时对static字段的处理
date: "2017-11-29T22:22:22.169Z"
path:  "/java-static-vs-transient"
tags:
   - java
   - serialization
---

## 起因
今天工作时遇到一个Java序列化对象中带有static字段的问题,
一时无法确定Java默认的序列化机制会怎么处理静态域,
Google的时候发现[以下文章](http://javabeginnerstutorial.com/core-java-tutorial/transient-vs-static-variable-java/)
此文将static和transient两个关键字做对比,初看时觉得不错,
但是仔细看时发现文章得出的结论和我的印象中的Java序列化有大出入,
于是自己动手写代码验证一下.


## static域会不会被序列化
改文章中的第二部分通过一段代码得出以下*结论*:
> 1. Static variables value can be stored 
> while serializing if the same is provided while initialization.
> 2.If variable is defined as Static and Transient both, 
>　than static modifier will govern the behavior of variable and not Transient.

该文作者认为: 
1. 如果序列化时静态域的值等于初始化时候的值，那么静态域就会被序列化
2. 如果一个域同时拥有static和transient关键字,那么这个域也会被序列化
其实以上这个两个结论都是不对的

[实例代码](TestSerialization.java)

```java
import java.io.*;

class SuperEmployee implements Serializable {
    public String superField;
    public static String superStaticField;
}

class Employee extends SuperEmployee {
    public String simpleField;
    public static String staticField = "defaultStatic01";
    public transient String transientField = "defaultTransientField01";
    public static transient String staticTransientField;
}

public class TestSerialization {

    private static void serialization() {
        System.out.println("Serialization start...");
        Employee employee = new Employee();
        employee.superField = "superFieldValue";
        employee.superStaticField = "superStaticFieldValue";
        employee.simpleField = "simpleFieldValue";
        // employee.staticField = "staticFieldValue";
        employee.transientField = "transientFieldValue";
        employee.staticTransientField = "staticTransientFieldValue";
        try (
                FileOutputStream fileOutputStream = new FileOutputStream("./employee.dat");
                ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        ) {
            objectOutputStream.writeObject(employee);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Serialization finished");
        showEmployee(employee);
    }

    private static void deserialization() {
        System.out.println("Deserialization start...");
        Employee employee = null;
        try (
                FileInputStream fileInputStream = new FileInputStream("./employee.dat");
                ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
        ) {
            employee = (Employee) objectInputStream.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        System.out.println("Deserialization finished");
        showEmployee(employee);
    }

    private static void showEmployee(Employee employee) {
        System.out.println("Employee:");
        System.out.println("employee.superField = " + employee.superField);
        System.out.println("employee.superStaticField = " + employee.superStaticField);
        System.out.println("employee.simpleField = " + employee.simpleField);
        System.out.println("employee.staticField = " + employee.staticField);
        System.out.println("employee.staticTransientField = " + employee.staticTransientField);
    }


    public static void main(String[] args) {
        //serialization();
        deserialization();
    }
}
```

代码运行方法:
1. 调用serialization方法,生成出employee.dat文件
2. 修改`staticField`和`staticTransientField`的初始值
3. 调用deserialization方法

可以看出所有static字段其实并没有被序列化,都会等于`代码`中的值,
其实*类变量*(静态域)的赋值是在类的初始化过程中发生的,
序列化的是目标是*对象*而不是类,所以静态变量不会被序列化.

## 如何实现static域的序列化
Java默认的serialization机制不会序列化static的域,但是Java允许程序员自定义
序列化的对象,以下两种方法都可以实现序列化static域(或者transient域)
1. 重写writeObject()方法和readObject()方法[代码实例](TestCustomSerialization.java)
2. 实现Externalizable接口

```java
import java.io.*;
class CustomObject implements Serializable {
    
    public static String staticField = "defaultStaticValue";
    public transient String transientField = "defaultTransientValue";
    public static transient String staticTransientField = "defaultStaticTransientValue";

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        out.writeObject(staticField);
        out.writeObject(transientField);
        out.writeObject(staticTransientField);
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        staticField = (String) in.readObject();
        transientField = (String) in.readObject();
        staticTransientField = (String) in.readObject();
    }
}
public class TestCustomSerialization {

    private static void serialization() {
        System.out.println("Serialization start...");
        CustomObject customObject = new CustomObject();
        customObject.staticField = "staticFieldValue";
        customObject.transientField = "transientFieldValue";
        customObject.staticTransientField = "staticTransientFieldValue";
        try (
                FileOutputStream fileOutputStream = new FileOutputStream("./customObject.dat");
                ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        ) {
            objectOutputStream.writeObject(customObject);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Serialization finished");
        showEmployee(customObject);
    }

    private static void deserialization() {
        System.out.println("Deserialization start...");
        CustomObject customObject = null;
        try (
                FileInputStream fileInputStream = new FileInputStream("./customObject.dat");
                ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
        ) {
            customObject = (CustomObject) objectInputStream.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        System.out.println("Deserialization finished");
        showEmployee(customObject);
    }
    
    private static void showEmployee(CustomObject customObject) {
        System.out.println("CustomObject:");
        System.out.println("CustomObject.staticField = " + customObject.staticField);
        System.out.println("CustomObject.transientField = " + customObject.transientField);
        System.out.println("CustomObject.staticTransientField = " + customObject.staticTransientField);
    }
    
    public static void main(String[] args) {
        // serialization();
        deserialization();
    }
}
```
