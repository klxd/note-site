---
title: Java Classloader
date: "2017-09-05T22:22:32.169Z"
path:  "/java-classloader/"
---

###Java中的类加载时机

* 遇到`new` `getstatic` `putstatic` 或者 `invokestatic`这四种字节码指令时，对类进行初始化
  `new`可以认定为一种特殊的静态方法
  
* 使用反射方法对类进行反射调用的时候
* 当初始化一个类的时候，自动初始化其父类
* 当虚拟机启动时，会触发执行主类（包含main方法的那个类）的初始化
* 使用JDK7中的动态语言支持时，若是触发了`java.lang.invoke.MethodHandle`实例的调用，会对相应的类进行初始化
