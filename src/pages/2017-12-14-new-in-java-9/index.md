---
title: Java 9 中的新特性
date: "2017-12-14T22:22:22.169Z"
path:  "/new-in-java-9"
tags:
   - java
---

## 平台级模块化系统
没有模块化之前Java中存在的问题:
- JDK过于臃肿
- JAR文件(如rt.jar)过于臃肿,无法在小的设备或程序中使用
- 封装不够强大,public修饰符允许任何人访问
- 不同版本的类库交叉依赖,无法确定是否共同依赖了相同的JAR

#### Java SE 9: Jigsaw Project
Java 9的模块化是通过工程Jigsaw引入的  
参考链接 <http://openjdk.java.net/projects/jigsaw/>
>The primary goals of this Project were to:
> - Make it easier for developers to construct and maintain libraries
> - and large applications;
> - Improve the security and maintainability of Java SE Platform Implementations in general, and the JDK in particular;
> - Enable improved application performance; and
> - Enable the Java SE Platform, and the JDK, to scale down for use in small computing devices and dense cloud deployments.

Jigsaw的主体被拆分分以下6个部分:
- [200: The Modular JDK](http://openjdk.java.net/jeps/200)
- [201: Modular Source Code](http://openjdk.java.net/jeps/201)
- [220: Modular Run-Time Images](http://openjdk.java.net/jeps/220)
- [260: Encapsulate Most Internal APIs](http://openjdk.java.net/jeps/260)
- [261: Module System](http://openjdk.java.net/jeps/261)
- [282: jlink: The Java Linker](http://openjdk.java.net/jeps/282)
  
Java 9模块化系统的优点:
- JDK,JRE,JAR等都将被划分为小模块,有利于将Java应用到小的设备或程序
- 易于测试和维护
- 提供更强的封装

***

##接口中的私有方法
参考网址
<https://www.journaldev.com/12850/java-9-private-methods-interfaces>

在Java 7中,接口中只能有两种东西
1. 常量
2. 抽象方法

```java
public interface Java7Interface {
    // 默认省略 public 
    public int constVariable = 0;
    
    // 默认省略 public abstract
     void abstractMethod();
}
```

在Java 8中，接口中可以有默认方法和静态方法,但是这些方法都是公有的,
1. 常量
2. 抽象方法
3. 默认方法
4. 静态方法

```java
public interface Java8Interface {

    // 默认省略 public
    default void defaultMethod() {
        System.out.println("I am a default method");
    }

    // 默认省略 public
    static void staticMethod() {
        System.out.println("I am a static method");
    }

}
```
在Java 9中,允许在接口中使用私有方法
1. 常量
2. 抽象方法
3. 默认方法
4. 静态方法
5. 私有方法
6. 私有静态方法

```java
public interface Java9Interface {

    private void privateMethod() {
        System.out.println("I am a private static");
    }

    private static void privateStaticMethod(){
        System.out.println("I am a private static method");
    }
    
    // 编译错误,只有接口私有方法,没有私有接口变量
    // private int privateVariable = 0; 
}
```

Java 9中,接口私有方法使用规则:
1. 必须用`private`显式声明
   - 接口中所有方法默认是公有的
2. `private`修饰符无法与`abstract`共存,否则会导致编译错误
   - `private`方法表示这个方法已经被接口实现,子类无法继承和覆盖
   - `abstract`方法表示这个这个方法还没有实现,子类必须继承并覆盖
3. 私有方法必须有实现
4. `private`修饰符代表最低的可见性
   - 只有这个在这个接口才能访问到这个方法

为什么需要接口私有方法
Java8中,若接口的默认方法如果有重复的代码,则无法封装重用,因此使用接口私有方法可以:
1. 实现代码复用
2. 仅暴露公有方法给客户端

***

## Java 9 REPL (JShell)
Java 9提供了一个交互式的编程环境, REPL(Read Evaluate Print Loop).可以从控制台启动JShell来使用
```bash
G:\>jshell
|  Welcome to JShell -- Version 9-ea
|  For an introduction type: /help intro


jshell> int a = 10
a ==> 10

jshell> System.out.println("a value = " + a )
a value = 10
```
***

## 集合的工厂方法
Java 9中引入了一些便捷的方法用来创建**不可修改**的List,Set,Map和Map.Entry.
```java
List immutableList = List.of();
List immutableList = List.of("one","two","three");

```

## 改进的Stream API
Java 9中Stream接口增加了有些便捷的方法,如**dropWhile**和**takeWhile**

## try-with-resource的改进
<https://www.journaldev.com/12940/javase9-try-with-resources-improvements>

Java 7中的try-with-resource
```java
void testARM_Before_Java9() throws IOException{
 BufferedReader reader1 = new BufferedReader(new FileReader("journaldev.txt"));
 try (BufferedReader reader2 = reader1) {
   System.out.println(reader2.readLine());
 }
}
```
Java 9中的try-with-resource
```java
void testARM_Java9() throws IOException{
 BufferedReader reader1 = new BufferedReader(new FileReader("journaldev.txt"));
 try (reader1) {
   System.out.println(reader1.readLine());
 }
}
```