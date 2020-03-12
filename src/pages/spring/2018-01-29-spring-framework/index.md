---
title: Spring学习笔记
date: "2018-01-29T22:22:22.169Z"
path:  "/spring-framework"
tags:
   - spring
---

## BeanFactoryPostProcessor的作用
BeanFactoryPostProcessor可以对bean的定义（配置元数据）进行处理。也就是说，Spring IoC容器允许
BeanFactoryPostProcessor在容器实际实例化任何其它的bean之前读取配置元数据，并有可能修改它.
bean工厂后置处理器可以手工（如果是BeanFactory）或自动（如果是ApplicationContext）地施加某些变化给定义在容器中的配置元数据。
Spring自带了许多bean工厂后置处理器，比如下面将提到的PropertyResourceConfigurer和PropertyPlaceholderConfigurer以及BeanNameAutoProxyCreator，
它们用于对bean进行事务性包装或者使用其他的proxy进行包装。

spring 容器初始化流程：
* 扫描
* 解析类, 判断类是不是符合标准，是否需要现在实例化（不是抽象，是单例，不是lazyInit，无dependsOn）
* 通过类文件实例化BeanDefinition，放入一个map中
* 新建RootBeanDefinition, 配置好属性（描述Bean：name，scope，beanClass，isLazy）， 放入BeanDefinitionMap中
* invokeBeanFactoryPostProcessor(beanFactory): 执行已经注册的Factory processor
  * 注册自己的BeanFactoryProcessor可参与到BeanFactory的构建过程，例如修改BeanDefinition中的BeanClass，来指定 后续Bean实例化时使用的类
* 注册BeanPostProcessor 
* 验证 -> 推断构造方法 -> 用反射new对象 -> 缓存注解信息 解析合并后的definition对象 
 -> 提前暴露自己工厂
 -> 判断是否需要完成属性注入 `InstantiationAwareBeanPostProcessor.postProcessAfterInstantiation` 
 -> 完成属性注入 
 -> 调用部分Aware beanName beanFactory
 -> 调用生命周期回调方法
 -> 完成aop代理 -> put容器 -> 销毁

## spring bean的生命周期

1. 实例化Bean
  对于BeanFactory容器，当客户向容器请求一个尚未初始化的bean时，或初始化bean的时候需要注入另一个尚未初始化的依赖时，容器就会调用createBean进行实例化。 
  对于ApplicationContext容器，当容器启动结束后，便实例化所有的bean。 
  容器通过获取BeanDefinition对象中的信息进行实例化。并且这一步仅仅是简单的实例化，并未进行依赖注入。 
  实例化对象被包装在BeanWrapper对象中，BeanWrapper提供了设置对象属性的接口，从而避免了使用反射机制设置属性。
  
2. 设置对象属性（依赖注入）
  实例化后的对象被封装在BeanWrapper对象中，并且此时对象仍然是一个原生的状态，并没有进行依赖注入。 
  紧接着，Spring根据BeanDefinition中的信息进行依赖注入,并且通过BeanWrapper提供的设置属性的接口完成依赖注入。
  BeanWrapper对bean的实例操作很方便, 免去了直接使用Java反射API的繁琐.
  
3. 注入Aware接口
  紧接着，Spring会检测该对象是否实现了xxxAware接口，并将相关的xxxAware实例注入给bean。
  * 如果这个Bean实现了BeanNameAware接口，会调用它实现的setBeanName(String beanId)方法，此处传递的是Spring配置文件中Bean的ID
  * 如果这个Bean实现了BeanFactoryAware接口，会调用它实现的setBeanFactory()，传递的是Spring工厂本身（可以用这个方法获取到其他Bean）
  * 如果这个Bean实现了ApplicationContextAware接口，会调用setApplicationContext(ApplicationContext)方法，传入Spring上下文
  
4. BeanPostProcessor
  当经过上述几个步骤后，bean对象已经被正确构造，但如果你想要对象被使用前再进行一些自定义的处理，就可以通过BeanPostProcessor接口实现。 该接口提供了两个函数：
  * postProcessBeforeInitialization( Object bean, String beanName ) 当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。
    这个函数会先于InitializingBean执行，因此称为前置处理。 所有Aware接口的注入就是在这一步完成的。
    `@PostConstruct`注解在此步骤实现方法调用
    `@Autowired`注解就是通过postProcessBeforeInitialization实现的（AutowiredAnnotationBeanPostProcessor）。
    `@Resource`注解通过`CommonAnnotationBeanPostProcessor`实现
  * postProcessAfterInitialization( Object bean, String beanName ) 当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。
    这个函数会在InitializingBean完成后执行，因此称为后置处理。注意此方法是在InitializingBean与init-method之后调用, 
    完成spring-aop代理是在此步骤完成， `wrappedBean = applyBeanPostProcessorAfterInitialization(...)`；
    相关处理类： `AnnotationAwareAspectJAutoProxyCreator`
    
5. InitializingBean与init-method
  当BeanPostProcessor的前置处理完成后就会进入本阶段。 
  * InitializingBean接口只有一个函数：afterPropertiesSet()这一阶段也可以在bean正式构造完成前增加我们自定义的逻辑，但它与前置处理不同，
  由于该函数并不会把当前bean对象传进来，因此在这一步没办法处理对象本身，只能增加一些额外的逻辑。 
  若要使用它，我们需要让bean实现该接口，并把要增加的逻辑写在该函数中。然后Spring会在前置处理完成后检测当前bean是否实现了该接口，并
  执行afterPropertiesSet函数。
  * 当然，Spring为了降低对客户代码的侵入性，给bean的配置提供了init-method属性，该属性指定了在这一阶段需要执行的函数名。
  Spring便会在初始化阶段执行我们设置的函数。init-method本质上仍然使用了InitializingBean接口。
  
6. DisposableBean和destroy-method和init-method一样，通过给destroy-method指定函数，就可以在bean销毁前执行指定的逻辑。


## @Autowired 和 @Resource
* @Resource 使用`CommonAnnotationBeanPostProcessor`完成注入
* @Autowired 使用 `AutowiredAnnotationBeanPostProcessor`完成注入

## spring循环依赖
* 单例才支持循环依赖， 若是prototype，可利用lookup method

## 方法注入 lookup method
通常情况下将一个bean定义为另一个bean的property值就完成注入(不管是单例还是原型), 对于具有不同生命周期的bean来说这样做就会有问题了，
比如在调用一个singleton类型bean A的某个方法时，需要引用另一个非singleton（prototype）类型的bean B，对于bean A来说，
容器只会创建一次，这样就没法在需要的时候每次让容器为bean A提供一个新的的bean B实例。
* 一个解决办法就是放弃控制反转, 通过实现BeanFactoryAware接口, 取得BeanFactory自己构造bean
* 另一个方法即**方法注入**, Lookup方法注入利用了容器的覆盖受容器管理的bean方法的能力，从而返回指定名字的bean实例, 
Lookup方法注入的内部机制是Spring利用了CGLIB库在运行时生成二进制代码功能，通过动态创建Lookup方法bean的子类而达到复写Lookup方法的目的。

```java
@Component
public class A {

    public A() {
        System.out.println("a construct");
    }

    public void test() {
        // 每次调用时, 会根据find函数的返回值, 确定bean的类型, 然后
        // 调用factory.getBean()函数拿到所需要的bean, 如果构造bean时需要构造参数,
        // 则可以通过find函数的参数传入
        // 注: Bean b的类型不一定是prototype, 也可以是singleton, 只是此时构造参数无效
        B b1 = find("1111");
        System.out.println(b1);

        B b2 = find ("2222");
        System.out.println(b2);
    }

    @Lookup
    public B find(String time) {
        // 此方法体不会被调用, 会被cglib生成方法覆盖
        System.out.println("find");
        return null;
    }
}
```

## 方法替换 Method Replacement
spring允许我们替换bean中的方法(很少使用), 原理与lookup方法类似, 均使用了cglib生成子类.
需要实现MethodReplacer接口来实现新代码
```java
/** meant to be used to override the existing computeValue
    implementation in MyValueCalculator */
public class ReplacementComputeValue implements MethodReplacer {

    public Object reimplement(Object o, Method m, Object[] args) throws Throwable {
        // get the input value, work with it, and return a computed result
        String input = (String) args[0];
        return null;
    }
}
```
注意方法替换只能使用xml配置, 使用`replaced-method`标签
```xml
<bean id="myValueCalculator" class="x.y.z.MyValueCalculator">
    <!-- arbitrary method replacement -->
    <replaced-method name="computeValue" replacer="replacementComputeValue">
        <arg-type>String</arg-type>
    </replaced-method>
</bean>

<bean id="replacementComputeValue" class="a.b.c.ReplacementComputeValue"/>
```

## Spring Bean 作用域
* singleton	该作用域将 bean 的定义的限制在每一个 Spring IoC 容器中的一个单一实例(默认)。
* prototype	该作用域将单一 bean 的定义限制在任意数量的对象实例。请求方自己负责对象后继的生命周期管理工作
* request	该作用域将 bean 的定义限制为 HTTP 请求。只在 web-aware Spring ApplicationContext 的上下文中有效。
* session	该作用域将 bean 的定义限制为 HTTP 会话。 只在web-aware Spring ApplicationContext的上下文中有效。
* global-session 该作用域将 bean 的定义限制为全局 HTTP 会话。只在 web-aware Spring ApplicationContext 的上下文中有效。
* 自定义作用域, 利用CustomScopeConfigurer类(BeanFactoryPostProcessor接口的实现之一)


## 扩展Spring的几种方式
容器扩展点
* BeanPostProcessor
* BeanFactoryPostProcessor
* FactoryBean 定制实例化逻辑
* ImportBeanDefinitionRegistrar

基于XML配置的扩展 1.定义schema 2.创建NamespaceHandler 3.注册Spring handler和Spring schema

基于Java配置的扩展
自定义注解
自定义ImportBeanDefinitionRegistrar实现
[扩展Spring的几种方式](https://blog.csdn.net/liyantianmin/article/details/81049579)

### FactoryBean和BeanFactory的区别 
* FactoryBean定制实例化逻辑, FactoryBean接口是插入到Spring IoC容器用来定制实例化逻辑的一个接口点。如果你有一些复杂的初始化代码用Java可以更好来表示，
  而不是用(可能)冗长的XML，那么你就可以创建你自己的FactoryBean，并在那个类中写入复杂的初始化动作，然后把你定制的FactoryBean插入容器中。
* FactoryBean接口提供三个方法：
  * Object getObject()：返回一个由这个工厂创建的对象实例。这个实例可能被共享（取决于isSingleton()的返回值是singleton或prototype）。
  * boolean isSingleton()：如果要让这个FactoryBean创建的对象实例为singleton则返回true，否则返回false。
  * Class getObjectType()：返回通过getObject()方法返回的对象类型，如果该类型无法预料则返回null。
* 最后，有时需要向容器请求一个真实的FactoryBean实例本身，而不是它创建的bean。这可以通过在FactoryBean（包括ApplicationContext）调用getBean方法时
  在bean id前加'&'(没有单引号)来完成。因此对于一个假定id为myBean的FactoryBean，在容器上调用getBean("myBean")将返回FactoryBean创建的bean实例，
  但是调用getBean("&myBean")将返回FactoryBean本身的实例。

* FactoryBean的使用场景: 使用实例工厂方法实例化, 用来进行实例化的实例工厂方法位于另外一个已有的bean中，容器将调用该bean的工厂方法来创建一个新的bean实例,
为使用此机制，class属性必须为空，而factory-bean属性必须指定为当前(或其祖先)容器中包含工厂方法的bean的名称，而该工厂bean的工厂方法本身必须通过factory-method属性来设定(参看以下的例子)。
```xml
<!-- the factory bean, which contains a method called createInstance() -->
<bean id="myFactoryBean" class="...">
  ...
</bean>
  <!-- the bean to be created via the factory bean -->
<bean id="exampleBean"
      factory-bean="myFactoryBean"
      factory-method="createInstance"/>
```

### 依赖注入方式
* 构造函数注入
* setter注入 (域上调用反射也属于这种)

### 自动注入模型 (autowiring modes)
注意在代码中加上`@Autowired`注解属于手动注入, 和自动注入模型没有关系;
自动注入模型是beanDefinition上的一个属性, 也可以通过xml配置这个属性 
 
* no 不使用自动装配。必须通过ref元素指定依赖，这是默认设置。由于显式指定协作者可以使配置更灵活、更清晰，因此对于较大的部署配置，推荐采用该设置。
  而且在某种程度上，它也是系统架构的一种文档形式。

* byName 根据属性名自动装配。此选项将检查容器并根据名字查找与属性完全一致的bean，并将其与属性自动装配。例如，
  在bean定义中将autowire设置为by name，而该bean包含master属性（同时提供setMaster(..)方法），
  Spring就会查找名为master的bean定义，并用它来装配给master属性。

* byType 如果容器中存在一个与指定属性类型相同的bean，那么将与该属性自动装配。如果存在多个该类型的bean，
  那么将会抛出异常，并指出不能使用byType方式进行自动装配。若没有找到相匹配的bean，则什么事都不发生，属性也不会被设置。
  如果你不希望这样，那么可以通过设置dependency-check="objects"让Spring抛出异常。

* constructor 与byType的方式类似，不同之处在于它应用于构造器参数。如果在容器中没有找到与构造器参数类型一致的bean，那么将会抛出异常。

* autodetect (3.0之后不推荐使用) 通过bean类的自省机制（introspection）来决定是使用constructor还是byType方式进行自动装配。
  如果发现默认的构造器，那么将使用byType方式。
  
## @Configuration为什么可以不加，底层为什么使用cglib
* @Configuration可以确保该类中@Bean产生的对象是单例， 底层原理是动态代理

## 如何把自己产生的对象交给spring管理
* @Bean
* ConfigurableListableBeanFactory.registerSingleton(beanName, object)
* FactoryBean
* Factory Method

## 值得探索的问题

* AOP的实现方法 - 动态代理
* 控制反转的实现 IoC的理解
* Spring事务处理机制
* Spring事务的传播属性

* Springmvc 中DispatcherServlet初始化过程

* 一个HTTP请求怎么被分发到方法上

* 一个查询用户信息的URL输入在浏览器地址框以后按下回车以后，经历了什么

* Tomcat reloadable实现原理（这个没答出来，后来看是直接替换了ClassLoader，当时猜得是替换classLoader里面的已加载类

 Tomcat接收用户数据的IO原理（就是NIO，我就提了一下NIO三个字，面试官就说可以了。本来还想讲讲Reactor模式和Proactor模式来着）
 
* 过滤器和拦截器的区别 
 
* spring sort for list 的应用

IoC
* spring中有哪些扩展点开源来修改beanDefinition
* BeanDefinitionRegistry的作用
* BeanNameGenerator如何改变beanName的生成策略
* BeanDefinitionRegistryPostProcessor和BeanFactoryPostProcessor的关系
* ConfigurationClassPostProcessor这个类如何完成bean的扫描
* @Import的三种类型，spring在底层源码当中如何来解析这三种import
* 如何利用importSelector来完成对spring的扩展
* @Configuration为什么可以不加，底层为什么使用cglib
* @Bean是如何保证单例的，为什么需要这么配置
* FactoryBean和BeanFactory的区别，有哪些经典应用场景
* ImportBeanDefinitionRegistrar接口的作用

