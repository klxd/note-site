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
* 新建RootBeanDefinition, 配置好属性（描述Bean：name，scope，beanClass，isLazy）， 放入BeanDefinitionMap中
* invokeBeanFactoryPostProcessor(beanFactory): 执行已经注册的Factory processor
  * 注册自己的BeanFactoryProcessor可参与到BeanFactory的构建过程，例如修改BeanDefinition中的BeanClass，来指定 后续Bean实例化时使用的类
* 注册BeanPostProcessor 

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
    @Autowired注解就是通过postProcessBeforeInitialization实现的（AutowiredAnnotationBeanPostProcessor）。
    `@Post`
  * postProcessAfterInitialization( Object bean, String beanName ) 当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。
    这个函数会在InitializingBean完成后执行，因此称为后置处理。注意此方法是在InitializingBean与init-method之后调用, 
    完成spring-aop代理是在此步骤完成， `wrappedBean = applyBeanPostProcessorAfterInitialization(...)`
    
5. InitializingBean与init-method
  当BeanPostProcessor的前置处理完成后就会进入本阶段。 
  * InitializingBean接口只有一个函数：afterPropertiesSet()这一阶段也可以在bean正式构造完成前增加我们自定义的逻辑，但它与前置处理不同，
  由于该函数并不会把当前bean对象传进来，因此在这一步没办法处理对象本身，只能增加一些额外的逻辑。 
  若要使用它，我们需要让bean实现该接口，并把要增加的逻辑写在该函数中。然后Spring会在前置处理完成后检测当前bean是否实现了该接口，并
  执行afterPropertiesSet函数。
  * 当然，Spring为了降低对客户代码的侵入性，给bean的配置提供了init-method属性，该属性指定了在这一阶段需要执行的函数名。
  Spring便会在初始化阶段执行我们设置的函数。init-method本质上仍然使用了InitializingBean接口。
  
6. DisposableBean和destroy-method和init-method一样，通过给destroy-method指定函数，就可以在bean销毁前执行指定的逻辑。

## 
```java
public abstract class AbstractBeanFactory extends FactoryBeanRegistrySupport implements ConfigurableBeanFactory {
protected <T> T doGetBean(
			final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)
			throws BeansException {

        final String beanName = transformedBeanName(name);
		Object bean;

        // 初次调用getSingleton
		// Eagerly check singleton cache for manually registered singletons.
		Object sharedInstance = getSingleton(beanName);
		if (sharedInstance != null && args == null) {
			if (logger.isDebugEnabled()) {
				if (isSingletonCurrentlyInCreation(beanName)) {
					logger.debug("Returning eagerly cached instance of singleton bean '" + beanName +
							"' that is not fully initialized yet - a consequence of a circular reference");
				}
				else {
					logger.debug("Returning cached instance of singleton bean '" + beanName + "'");
				}
			}
			bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
		}

		else {
		    // 判断这个类是不是正在创建过程中 -> 构造函数循环依赖 -> 抛异常
			// Fail if we're already creating this bean instance:
			// We're assumably within a circular reference.
			if (isPrototypeCurrentlyInCreation(beanName)) {
				throw new BeanCurrentlyInCreationException(beanName);
			}

			// Check if bean definition exists in this factory.
			BeanFactory parentBeanFactory = getParentBeanFactory();
			if (parentBeanFactory != null && !containsBeanDefinition(beanName)) {
                // 方法注入?
				// Not found -> check parent.
				String nameToLookup = originalBeanName(name);
				if (args != null) {
					// Delegation to parent with explicit args.
					return (T) parentBeanFactory.getBean(nameToLookup, args);
				}
				else {
					// No args -> delegate to standard getBean method.
					return parentBeanFactory.getBean(nameToLookup, requiredType);
				}
			}

			if (!typeCheckOnly) {
				markBeanAsCreated(beanName);
			}

			try {
				final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
				checkMergedBeanDefinition(mbd, beanName, args);

				// Guarantee initialization of beans that the current bean depends on.
				String[] dependsOn = mbd.getDependsOn();
				if (dependsOn != null) {
					for (String dep : dependsOn) {
						if (isDependent(beanName, dep)) {
							throw new BeanCreationException(mbd.getResourceDescription(), beanName,
									"Circular depends-on relationship between '" + beanName + "' and '" + dep + "'");
						}
						registerDependentBean(dep, beanName);
						getBean(dep);
					}
				}

				// Create bean instance.
				if (mbd.isSingleton()) {
                    // 二次调用getSingleton(重载,和第一次调用并不是同一个方法)
					sharedInstance = getSingleton(beanName, new ObjectFactory<Object>() {
						@Override
						public Object getObject() throws BeansException {
							try {
                                // 完成对象的创建, 如果需要代理还完成了代理
								return createBean(beanName, mbd, args);
							}
							catch (BeansException ex) {
								// Explicitly remove instance from singleton cache: It might have been put there
								// eagerly by the creation process, to allow for circular reference resolution.
								// Also remove any beans that received a temporary reference to the bean.
								destroySingleton(beanName);
								throw ex;
							}
						}
					});
					bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
				}

				else if (mbd.isPrototype()) {
					// It's a prototype -> create a new instance.
					Object prototypeInstance = null;
					try {
						beforePrototypeCreation(beanName);
						prototypeInstance = createBean(beanName, mbd, args);
					}
					finally {
						afterPrototypeCreation(beanName);
					}
					bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
				}

				else {
					String scopeName = mbd.getScope();
					final Scope scope = this.scopes.get(scopeName);
					if (scope == null) {
						throw new IllegalStateException("No Scope registered for scope name '" + scopeName + "'");
					}
					try {
						Object scopedInstance = scope.get(beanName, new ObjectFactory<Object>() {
							@Override
							public Object getObject() throws BeansException {
								beforePrototypeCreation(beanName);
								try {
									return createBean(beanName, mbd, args);
								}
								finally {
									afterPrototypeCreation(beanName);
								}
							}
						});
						bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
					}
					catch (IllegalStateException ex) {
						throw new BeanCreationException(beanName,
								"Scope '" + scopeName + "' is not active for the current thread; consider " +
								"defining a scoped proxy for this bean if you intend to refer to it from a singleton",
								ex);
					}
				}
			}
			catch (BeansException ex) {
				cleanupAfterBeanCreationFailure(beanName);
				throw ex;
			}
		}

		// Check if required type matches the type of the actual bean instance.
		if (requiredType != null && bean != null && !requiredType.isAssignableFrom(bean.getClass())) {
			try {
				return getTypeConverter().convertIfNecessary(bean, requiredType);
			}
			catch (TypeMismatchException ex) {
				if (logger.isDebugEnabled()) {
					logger.debug("Failed to convert bean '" + name + "' to required type '" +
							ClassUtils.getQualifiedName(requiredType) + "'", ex);
				}
				throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());
			}
		}
		return (T) bean;
	}
}
```

```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
	/**
	 * Return the (raw) singleton object registered under the given name.
	 * <p>Checks already instantiated singletons and also allows for an early
	 * reference to a currently created singleton (resolving a circular reference).
	 * @param beanName the name of the bean to look for
	 * @param allowEarlyReference whether early references should be created or not
	 * @return the registered singleton object, or {@code null} if none found
	 */
	protected Object getSingleton(String beanName, boolean allowEarlyReference) {
		Object singletonObject = this.singletonObjects.get(beanName);
        // 单例池中拿不到, 判断是否是正在创建中的bean
		if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
			synchronized (this.singletonObjects) {
				singletonObject = this.earlySingletonObjects.get(beanName);
				if (singletonObject == null && allowEarlyReference) {
					ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
					if (singletonFactory != null) {
						singletonObject = singletonFactory.getObject();
						this.earlySingletonObjects.put(beanName, singletonObject);
						this.singletonFactories.remove(beanName);
					}
				}
			}
		}
		return (singletonObject != NULL_OBJECT ? singletonObject : null);
	}
}
```

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory
		implements AutowireCapableBeanFactory {
	/**
	 * Central method of this class: creates a bean instance,
	 * populates the bean instance, applies post-processors, etc.
	 * @see #doCreateBean
	 */
	@Override
	protected Object createBean(String beanName, RootBeanDefinition mbd, Object[] args) throws BeanCreationException {
		if (logger.isDebugEnabled()) {
			logger.debug("Creating instance of bean '" + beanName + "'");
		}
		RootBeanDefinition mbdToUse = mbd;

        // 返回bean对应的class
		// Make sure bean class is actually resolved at this point, and
		// clone the bean definition in case of a dynamically resolved Class
		// which cannot be stored in the shared merged bean definition.
		Class<?> resolvedClass = resolveBeanClass(mbd, beanName);
		if (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {
			mbdToUse = new RootBeanDefinition(mbd);
			mbdToUse.setBeanClass(resolvedClass);
		}

		// Prepare method overrides.
		try {
			mbdToUse.prepareMethodOverrides();
		}
		catch (BeanDefinitionValidationException ex) {
			throw new BeanDefinitionStoreException(mbdToUse.getResourceDescription(),
					beanName, "Validation of method overrides failed", ex);
		}

		try {
            // 第一次调用后置处理器
			// Give BeanPostProcessors a chance to return a proxy instead of the target bean instance.
			Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
			if (bean != null) {
				return bean;
			}
		}
		catch (Throwable ex) {
			throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName,
					"BeanPostProcessor before instantiation of bean failed", ex);
		}

        // 实例化bean
		Object beanInstance = doCreateBean(beanName, mbdToUse, args);
		if (logger.isDebugEnabled()) {
			logger.debug("Finished creating instance of bean '" + beanName + "'");
		}
		return beanInstance;
	}

    /**
	 * Actually create the specified bean. Pre-creation processing has already happened
	 * at this point, e.g. checking {@code postProcessBeforeInstantiation} callbacks.
	 * <p>Differentiates between default bean instantiation, use of a
	 * factory method, and autowiring a constructor.
	 * @param beanName the name of the bean
	 * @param mbd the merged bean definition for the bean
	 * @param args explicit arguments to use for constructor or factory method invocation
	 * @return a new instance of the bean
	 * @throws BeanCreationException if the bean could not be created
	 * @see #instantiateBean
	 * @see #instantiateUsingFactoryMethod
	 * @see #autowireConstructor
	 */
	protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final Object[] args)
			throws BeanCreationException {

		// Instantiate the bean.
		BeanWrapper instanceWrapper = null;
		if (mbd.isSingleton()) {
		    // todo: 理解factoryBean的作用
			instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);
		}
		if (instanceWrapper == null) {
            // 实例化, 里面第二次调用后置处理器
			instanceWrapper = createBeanInstance(beanName, mbd, args);
		}
		final Object bean = (instanceWrapper != null ? instanceWrapper.getWrappedInstance() : null);
		Class<?> beanType = (instanceWrapper != null ? instanceWrapper.getWrappedClass() : null);
		mbd.resolvedTargetType = beanType;

		// Allow post-processors to modify the merged bean definition.
		synchronized (mbd.postProcessingLock) {
			if (!mbd.postProcessed) {
				try {
                    // 第三次调用后置处理器
					applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
				}
				catch (Throwable ex) {
					throw new BeanCreationException(mbd.getResourceDescription(), beanName,
							"Post-processing of merged bean definition failed", ex);
				}
				mbd.postProcessed = true;
			}
		}

		// 判断是否允许循环依赖
		// Eagerly cache singletons to be able to resolve circular references
		// even when triggered by lifecycle interfaces like BeanFactoryAware.
		boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
				isSingletonCurrentlyInCreation(beanName));
		if (earlySingletonExposure) {
			if (logger.isDebugEnabled()) {
				logger.debug("Eagerly caching bean '" + beanName +
						"' to allow for resolving potential circular references");
			}
			// 把bean工厂加入到正在创建的bean工厂集合中
            // 第四次调用后置处理器, 判断是否需要aop
			addSingletonFactory(beanName, new ObjectFactory<Object>() {
				@Override
				public Object getObject() throws BeansException {
					return getEarlyBeanReference(beanName, mbd, bean);
				}
			});
		}

		// Initialize the bean instance.
		Object exposedObject = bean;
		try {
            // 填充bean, 即自动注入, 里面完成第五次和第六次后置处理器的调用
			populateBean(beanName, mbd, instanceWrapper);
			if (exposedObject != null) {
                // 初始化spring?, 里面完成第七次和第八期后置处理的调用
				exposedObject = initializeBean(beanName, exposedObject, mbd);
			}
		}
		catch (Throwable ex) {
			if (ex instanceof BeanCreationException && beanName.equals(((BeanCreationException) ex).getBeanName())) {
				throw (BeanCreationException) ex;
			}
			else {
				throw new BeanCreationException(
						mbd.getResourceDescription(), beanName, "Initialization of bean failed", ex);
			}
		}

		if (earlySingletonExposure) {
			Object earlySingletonReference = getSingleton(beanName, false);
			if (earlySingletonReference != null) {
				if (exposedObject == bean) {
					exposedObject = earlySingletonReference;
				}
				else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {
					String[] dependentBeans = getDependentBeans(beanName);
					Set<String> actualDependentBeans = new LinkedHashSet<String>(dependentBeans.length);
					for (String dependentBean : dependentBeans) {
						if (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {
							actualDependentBeans.add(dependentBean);
						}
					}
					if (!actualDependentBeans.isEmpty()) {
						throw new BeanCurrentlyInCreationException(beanName,
								"Bean with name '" + beanName + "' has been injected into other beans [" +
								StringUtils.collectionToCommaDelimitedString(actualDependentBeans) +
								"] in its raw version as part of a circular reference, but has eventually been " +
								"wrapped. This means that said other beans do not use the final version of the " +
								"bean. This is often the result of over-eager type matching - consider using " +
								"'getBeanNamesOfType' with the 'allowEagerInit' flag turned off, for example.");
					}
				}
			}
		}

		// Register bean as disposable.
		try {
			registerDisposableBeanIfNecessary(beanName, bean, mbd);
		}
		catch (BeanDefinitionValidationException ex) {
			throw new BeanCreationException(
					mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);
		}

		return exposedObject;
	}

	/**
	 * Create a new instance for the specified bean, using an appropriate instantiation strategy:
	 * factory method, constructor autowiring, or simple instantiation.
	 * @param beanName the name of the bean
	 * @param mbd the bean definition for the bean
	 * @param args explicit arguments to use for constructor or factory method invocation
	 * @return BeanWrapper for the new instance
	 * @see #instantiateUsingFactoryMethod
	 * @see #autowireConstructor
	 * @see #instantiateBean
	 */
	protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, Object[] args) {
		// Make sure bean class is actually resolved at this point.
		Class<?> beanClass = resolveBeanClass(mbd, beanName);

		if (beanClass != null && !Modifier.isPublic(beanClass.getModifiers()) && !mbd.isNonPublicAccessAllowed()) {
			throw new BeanCreationException(mbd.getResourceDescription(), beanName,
					"Bean class isn't public, and non-public access not allowed: " + beanClass.getName());
		}

		if (mbd.getFactoryMethodName() != null)  {
			return instantiateUsingFactoryMethod(beanName, mbd, args);
		}

		// Shortcut when re-creating the same bean...
		boolean resolved = false;
		boolean autowireNecessary = false;
		if (args == null) {
			synchronized (mbd.constructorArgumentLock) {
				if (mbd.resolvedConstructorOrFactoryMethod != null) {
					resolved = true;
					autowireNecessary = mbd.constructorArgumentsResolved;
				}
			}
		}
		if (resolved) {
			if (autowireNecessary) {
				return autowireConstructor(beanName, mbd, null, null);
			}
			else {
				return instantiateBean(beanName, mbd);
			}
		}
		// 二次调用后置处理器,推断构造方法
		// Need to determine the constructor...
		Constructor<?>[] ctors = determineConstructorsFromBeanPostProcessors(beanClass, beanName);
		if (ctors != null ||
				mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_CONSTRUCTOR ||
				mbd.hasConstructorArgumentValues() || !ObjectUtils.isEmpty(args))  {
			return autowireConstructor(beanName, mbd, ctors, args);
		}

		// No special handling: simply use no-arg constructor.
		return instantiateBean(beanName, mbd);
	}

}

```

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
mLookup方法注入的内部机制是Spring利用了CGLIB库在运行时生成二进制代码功能，通过动态创建Lookup方法bean的子类而达到复写Lookup方法的目的。

## Spring Bean 作用域
* singleton	该作用域将 bean 的定义的限制在每一个 Spring IoC 容器中的一个单一实例(默认)。
* prototype	该作用域将单一 bean 的定义限制在任意数量的对象实例。请求方自己负责对象后继的生命周期管理工作
* request	该作用域将 bean 的定义限制为 HTTP 请求。只在 web-aware Spring ApplicationContext 的上下文中有效。
* session	该作用域将 bean 的定义限制为 HTTP 会话。 只在web-aware Spring ApplicationContext的上下文中有效。
* global-session 该作用域将 bean 的定义限制为全局 HTTP 会话。只在 web-aware Spring ApplicationContext 的上下文中有效。
* 自定义作用域, 利用CustomScopeConfigurer类(BeanFactoryPostProcessor接口的实现之一)

## Spring IoC 容器
* BeanFactory: 基础类型IoC容器, 默认采用延迟初始化(lazy-load)
* ApplicationContext: 继承自BeanFactory, 相对高级的容器实现, 包含事件发布, 国际化信息支持等

## AOP的相关概念
* 切面/方面（Aspect）：AOP核心就是切面，它将多个类的通用行为封装成可重用的模块，该模块含有一组API提供横切功能。
  如，一个日志模块可以被称作日志的AOP切面。根据需求的不同，一个应用程序可以有若干切面。在SpringAOP中，切面通过带有@Aspect注解的类实现。
* 连接点（Joinpoint）：程序执行过程中明确的点，如方法的调用或特定的异常被抛出, 对应拦截方法的传入参数`JoinPoint/ProceedingJoinPoint`。
* 通知/增强（Advice）：在切入点上，可以应用的增强包括：around、before和throws。许多AOP框架包括Spring都是以拦截器做通知模型，
  维护一个“围绕”连接点的拦截器链。Spring中定义了四个advice:BeforeAdvice, AfterAdvice, ThrowAdvice和DynamicIntroductionAdvice。
* 切入点（Pointcut）：将被增强（Advice）应用的连接点的集合（通常是Method集合）。对应拦截方法的`execution(public *.*)` 
  Spring定义了Pointcut接口，用来组合MethodMatcher和ClassFilter，可以通过名字很清楚的理解，
  MethodMatcher是用来检查目标类的方法是否可以被应用此通知，而ClassFilter是用来检查Pointcut是否应该应用到目标类上。
* 目标对象（TargetObject）：被通知（Advice）或被代理对象。
* AOP代理（AOP Proxy）：AOP框架创建的对象，包含通知（Advice）。在Spring中，AOP代理可以是JDK动态代理或者CGLIB代理。


## Spring AOP 实现
* 静态AOP, AspectJ(不同于Spring AOP的一种AOP实现), 通过编译器将Java字节码注入到Java类中, 每次改动需要重新编译, 灵活性不足;
  注意, spring 2.0之后集成了AspectJ的相关注解`@Aspect`, 但底层还是spring原先的实现体系
* 动态代理, Spring AOP默认的实现方式, [InvocationHandler](./DynamicProxy.java),
  所有横切关注点类都得实现相应的接口, 因为Java动态代理机制只针对接口有效
* 动态字节码增强, SpringAOP无法采用动态代理机制实现AOP的时候, 就会采用CGLIB(Code Generation Library)库的动态字节码增强来实现
  让程序在运行期间使用动态生成的子类, 即使没有实现相应接口也可以扩展; 注意如果类以及类中的实例方法声明为final的话则无法对其进行子类化的扩展.
  
## Spring中有哪些不同的advice类型
通知(advice)是你在你的程序中想要应用在其他模块中的横切关注点的实现。Advice主要有以下5种类型。
   
* 前置通知(Before Advice): 在连接点之前执行的Advice，不过除非它抛出异常，否则没有能力中断执行流。使用 @Before注解使用这个Advice。
* 返回之后通知(After Retuning Advice): 在连接点正常结束之后执行的Advice。例如，如果一个方法没有抛出异常正常返回。通过 @AfterReturning`关注使用它。
* 抛出（异常）后执行通知(After Throwing Advice): 如果一个方法通过抛出异常来退出的话，这个Advice就会被执行。通用 @AfterThrowing`注解来使用。
* 后置通知(After Advice): 无论连接点是通过什么方式退出的(正常返回或者抛出异常)都会执行在结束后执行这些Advice。通过@After注解使用。
* 围绕通知(Around Advice): 围绕连接点执行的Advice，这是最强大的Advice, 通常说的拦截器类型的advice。通过 @Around注解使用,
  如作用于controller上的Advice`@Around("execution(public * com.company.web.controller.*Controller.*(..))")`

## 扩展Spring的几种方式
容器扩展点
* BeanPostProcessor
* BeanFactoryPostProcessor
* FactoryBean 定制实例化逻辑

基于XML配置的扩展 1.定义schema 2.创建NamespaceHandler 3.注册Spring handler和Spring schema

基于Java配置的扩展
自定义注解
自定义ImportBeanDefinitionRegistrar实现
[扩展Spring的几种方式](https://blog.csdn.net/liyantianmin/article/details/81049579)

### FactoryBean和BeanFactory的区别 
* 实例化时机， 单例池
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

### autowire 类型
 
* no	
不使用自动装配。必须通过ref元素指定依赖，这是默认设置。由于显式指定协作者可以使配置更灵活、更清晰，因此对于较大的部署配置，推荐采用该设置。而且在某种程度上，它也是系统架构的一种文档形式。

* byName	
根据属性名自动装配。此选项将检查容器并根据名字查找与属性完全一致的bean，并将其与属性自动装配。例如，在bean定义中将autowire设置为by name，而该bean包含master属性（同时提供setMaster(..)方法），Spring就会查找名为master的bean定义，并用它来装配给master属性。

* byType	
如果容器中存在一个与指定属性类型相同的bean，那么将与该属性自动装配。如果存在多个该类型的bean，那么将会抛出异常，并指出不能使用byType方式进行自动装配。若没有找到相匹配的bean，则什么事都不发生，属性也不会被设置。如果你不希望这样，那么可以通过设置dependency-check="objects"让Spring抛出异常。

* constructor	
与byType的方式类似，不同之处在于它应用于构造器参数。如果在容器中没有找到与构造器参数类型一致的bean，那么将会抛出异常。

* autodetect	(3.0之后不推荐使用)
通过bean类的自省机制（introspection）来决定是使用constructor还是byType方式进行自动装配。如果发现默认的构造器，那么将使用byType方式。

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
