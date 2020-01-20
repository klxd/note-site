---
title: 设计模式总结
date: "2018-02-03T22:22:22.169Z"
path:  "/design-pattern"
tags:
   - java
---

## 面向对象六大原则
* 单一职责原则——SRP：让每个类只专心处理自己的方法。
* 开闭原则——OCP：软件中的对象(类，模块，函数等)应该对于扩展是开放的，但是对于修改是关闭的。
* 里式替换原则——LSP：子类可以去扩展父类，但是不能改变父类原有的功能。
* 依赖倒置原则——DIP：应该通过调用接口或抽象类(比较高层)，而不是调用实现类(细节)。
* 接口隔离原则——ISP：把接口分成满足依赖关系的最小接口，实现类中不能有不需要的方法。迪米特原则——LOD：高内聚,低耦合。


## 修饰器模式

## 代理模式
代理模式中通常设计4中角色
* ISubject接口, 被访问资源的抽象
* SubjectImpl, 被访问资源的具体实现
* SubjectProxy, 被访问资源的代理类, 该类持**有一个**SubjectImpl实例, 并且实现了ISubject接口(**是一个**)
* Client, 访问者的抽象, 通过SubjectProxy类访问真正的SubjectImpl实例

## 观察者模式
观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象，这个主题对象在状态上发生变化时，会通知所有观察者对象，让他们能够自动更新自己。

### Java内置的观察者模式框架
* java内置观察者模式框架提供了类Observable与接口Observer
* 被观察者要继承Observable类
* 被观察者通知观察者时，也就是调用notifyObservers方法时一定要先调用setChanged()方法，该方法作用是将对象里面的changed这个boolean变量设为true,因为notifyObservers要首先检查该变量是否为true,如果为false就不执行而直接返回了。

```java
package java.util;
public class Observable {
    private boolean changed = false;
    // 使用同步容器vector存储Observer
    private Vector<Observer> obs;

    public Observable() {
        obs = new Vector<>();
    }

    // 添加观察者
    public synchronized void addObserver(Observer o) {
        if (o == null)
            throw new NullPointerException();
        if (!obs.contains(o)) {
            obs.addElement(o);
        }
    }

    // 删除观察者
    public synchronized void deleteObserver(Observer o) {
        obs.removeElement(o);
    }

    // 不带参数版的通知
    public void notifyObservers() {
        notifyObservers(null);
    }

    // 带参数的通知
    public void notifyObservers(Object arg) {
        /*
         * a temporary array buffer, used as a snapshot of the state of
         * current Observers.
         */
        Object[] arrLocal;

        synchronized (this) {
            if (!changed)
                return;
            arrLocal = obs.toArray();
            clearChanged();
        }

        for (int i = arrLocal.length-1; i>=0; i--)
            ((Observer)arrLocal[i]).update(this, arg);
    }

    public synchronized void deleteObservers() {
        obs.removeAllElements();
    }

    // 表明被观察者是否更改
    protected synchronized void setChanged() {
        changed = true;
    }

    protected synchronized void clearChanged() {
        changed = false;
    }

    public synchronized boolean hasChanged() {
        return changed;
    }

    public synchronized int countObservers() {
        return obs.size();
    }
}
```

```java
public interface Observer {
    /**
     * @param o   被观察者
     * @param arg 被观察者调用通知时传入的参数,可能为null  
     */
    void update(Observable o, Object arg);
}
```

