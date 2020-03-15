---
title: Java Classloader
date: "2017-09-05T22:22:32.169Z"
path:  "/java-classloader/"
tags:
    - java
    - jvm
---

##Java 中的类加载时机

Java 中类的生命周期包括以下 7 个阶段:
加载 验证 准备 解析 初始化 使用 卸载

### 初始化时机

* 遇到`new` `getstatic` `putstatic` 或者 `invokestatic`这四种字节码指令时，对类进行初始化
  `new`可以认定为一种特殊的静态方法
  * 读取类的被 final 修饰的静态字段,不会触发类的初始化(已在编译期把结果放入常量池) [代码实例](InitialTest.java)
* 使用反射方法对类进行反射调用的时候
* 当初始化一个类的时候，自动初始化其父类 [代码]
* 当虚拟机启动时，会触发执行主类（包含 main 方法的那个类）的初始化
* 使用 JDK7 中的动态语言支持时，若是触发了`java.lang.invoke.MethodHandle`实例的调用，会对相应的类进行初始化

### 类加载的过程

* 加载
   * 加载是**类加载**(Class Loading)过程的第一步
   * 在加载阶段,虚拟机需要完成以下 3 件事情
      1. 通过一个类的全限定名来获取定义此类的二进制字节流
      2. 将这个字节流锁代表的静态存储结构转化为方法区的运行时结构
      3. 在内存中生成一个`java.lang.Class`对象,作为类的各种数据的访问入口
  * 加载阶段中开发人员可以通过定义自己的类加载器去控制字节流的获取方式
* 验证
  * 连接阶段的第一步
  * 确保 Class 文件的字节流中包含的信息符合当前虚拟机的要求
* 准备
  * 为类变量(被 static 修饰的变量)分配内存并设置变量**初始值**(零值,如 int 为 0, boolean 为 false)
  * 若类变量为 ConstantValue(被 final 修饰的常量),那么在准备阶段就会初始化为常量值
* 解析
  * 将常量池内的符号引用替换为直接引用
* 初始化
  * 初始化是**类加载**(Class Loading)过程的最后一步
  * 根据程序员的代码取初始化*类变量*和其他资源

### 类加载器

作用: 通过一个类的全限定名来获取描述此类的二进制字节流任意一个类,都需要由加载它的类加载器和这个类本身一同确立其在 Java 虚拟机中的**唯一性**

* 启动类加载器(Bootstrap ClassLoader)
  * 在 HotSpot 虚拟机中由 C++语言实,是虚拟机自身的一部分
  * 负责加载`<JAVA_HOME>\lib目录中的`,或者被`-Xbootclasspath`参数所指定的路径中的,
    并且是虚拟机实现的类库
  * 无法被 Java 程序直接引用
* 扩展类加载器(Extension ClassLoader)
  * 由`sun.misc.Launcher$ExtClassLoader`实现
  * 负责加载`<JAVA_HOME>\lib\ext`目录中的所有类库
  * 负责加载被`java.ext.dirs`系统变量锁指定的路径中的所有类库
  * 开发者可以直接使用扩展类加载器
* 应用程序类加载器(Application ClassLoader)
  * 由`sun.misc.Launcher$AppClassLoader`实现
  * 是`getSystemClassLoader()`方法的返回值,也称*系统类加载器*
  * 负责加载用户类路径(ClassPath)上所指定的类库
  * 是程序中默认的类加载器(没有自定义自己的类加载器的时候)

### 双亲委派模型 (Parents Delegation Model)

* 双亲委派模型要求除了顶层的启动类加载器外,其余的类加载器都应该有自己的父类加载器
* 加载器之间的父子关系不会以继承(Inheritance)的关系实现,而是使用组合(Composition)关系
* 工作过程:
  1. 如果一个类加载器收到了类加载的请求,它首先不会自己尝试加载这个类,而是先把请求委派给父类加载器取完成
  2. 只有当父类加载器反馈自己无法完成加载请求时候,子加载器才会尝试自己去加载
* 优点: Java 类随着它的类加载器一起具备了一种带有优先级的**层次关系**

实现双亲委派模型的代码都集中在`java.lang.ClassLoader#loadClass`中,

```java
public abstract class ClassLoader {
    protected Class<?> loadClass(String name, boolean resolve)
            throws ClassNotFoundException
        {
            // 同名的类加载时竞争同一把锁(用ConcurrentHashMap管理)
            synchronized (getClassLoadingLock(name)) {
                // First, check if the class has already been loaded
                Class<?> c = findLoadedClass(name);
                if (c == null) {
                    long t0 = System.nanoTime();
                    try {
                        // 尝试用父亲加载器加载
                        if (parent != null) {
                            c = parent.loadClass(name, false);
                        } else {
                            c = findBootstrapClassOrNull(name);
                        }
                    } catch (ClassNotFoundException e) {
                        // ClassNotFoundException thrown if class not found
                        // from the non-null parent class loader
                    }
    
                    if (c == null) {
                        // -- 在父亲加载器无法加载的时候, 调用本身的findClass方法来加载
                        // If still not found, then invoke findClass in order
                        // to find the class.
                        long t1 = System.nanoTime();
                        c = findClass(name);
    
                        // this is the defining class loader; record the stats
                        sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                        sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                        sun.misc.PerfCounter.getFindClasses().increment();
                    }
                }
                if (resolve) {
                    resolveClass(c);
                }
                return c;
            }
        }
}
```

### 打破双亲委派 ?
双亲委派模型不是一个强制性的约束模型,而是Java设计者推荐给开发者的一种类加载器的实现方式.
实现双亲委派模型的代码都集中在`java.lang.ClassLoader#loadClass`中, 
JDK1.2之后不提倡用户再去覆盖loadClass方法,而应该把自己的类加载逻辑写到findClass()方法中,
这样可以保证写出来的加载器符合双亲委派规则.
所以, 不按照JVM的约束, 实现自己的loadClass方法即可以打破双亲委派

双亲委派3次**被破坏**
* JDK1.2以前没有findClass方法, 实现自己的类加载器的时候均重写了loadClass
* JNDI服务, 线程上下文类加载器, 父亲类加载器请求子类加载器去完成加载, Java中涉及SPI的加载动作基本都采用这种方式
* 代码热替换, 模块热部署, OSGi中, 每更换一个Bundle时, 把Bundle连同类加载器一起换掉以实现代码的热替换
* tomcat： 同一个jvm下可能部署了多个war包，war包中可能有同一个类的多个版本，tomcat为了实现隔离定义了自己的类加载器
*Jdbc

### Question:

* Java 类加载器都有哪些
* JVM 如何加载字节码文件
* JDBC和双亲委派模型关系
