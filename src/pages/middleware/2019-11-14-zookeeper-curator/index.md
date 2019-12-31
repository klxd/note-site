---
title: Zookeeper客户端Curator
date: "2019-11-11T22:22:22.169Z"
path:  "/zookeeper-curator-note"
tags:
   - middleware
---


## 简介
Curator是Netflix公司开源的一套zookeeper客户端框架，解决了很多Zookeeper客户端非常底层的细节开发工作，包括连接重连、反复注册Watcher和NodeExistsException异常等等。Patrixck Hunt（Zookeeper）以一句“Guava is to Java that Curator to Zookeeper”给Curator予高度评价。

## zookeeper分布式锁中利用到的特性
1. 有序节点：假如当前有一个父节点为/lock，我们可以在这个父节点下面创建子节点；zookeeper提供了一个可选的有序特性，例如我们可以创建子节点“/lock/node-”并且指明有序，那么zookeeper在生成子节点时会根据当前的子节点数量自动添加整数序号，也就是说如果是第一个创建的子节点，那么生成的子节点为/lock/node-0000000000，下一个节点则为/lock/node-0000000001，依次类推。
2. 临时节点：客户端可以建立一个临时节点，在会话结束或者会话超时后，zookeeper会自动删除该节点。
3. 事件监听：在读取数据时，我们可以同时对节点设置事件监听，当节点数据或结构变化时，zookeeper会通知客户端。当前zookeeper有如下四种事件：1）节点创建；2）节点删除；3）节点数据修改；4）子节点变更。

## 排它锁 (Exclusive Lock, X锁,独占锁)

### 简单实现 (分布式一致性原理与实践6.1.7)

1. 定义锁, 使用zk上的数据节点来表示一个锁, 如/exclusive_lock
2. 获取锁, 客户端尝试在/exclusive_lock节点下创建**临时**子节点/exclusive_lock/lock,
  * 若创建成功, 则成功拿到锁 (zk会保证只有一个客户端能成功)
  * 若创建失败, 则需要使用watcher监听/lock节点的变更情况, 然后再次尝试获取锁
3. 释放锁,由于/exclusive_lock/lock是一个临时节点, 所以有两种情况可能释放锁
  * 客户端机器宕机或异常, zk在链接超时后自动删除节点
  * 正常执行完业务逻辑后, 客户端主动删除节点

缺点: 羊群效应, 非公平?

### 改进实现 (Curator中InterProcessMutex的实现思路)
1. 定义锁, 使用zk上的数据节点来表示一个锁, 如/exclusive_lock
2. 获取锁
  2.1 客户端尝试在/exclusive_lock节点下创建**临时顺序**子节点/exclusive_lock/lock-0001,
  2.2 获取/exclusive_lock下所有的子节点, 并进行判断
    * 若新创建的子节点的序号为子节点中最小的, 则获取成功
    * 若还有更小的子节点, 则监听比自己序号小的最后一个子节点, 然后等待watcher通知重复步骤2.2
3. 释放锁, 同简单实现一样, 即子节点删除

特点: 公平, 按照请求锁的顺序依次获得锁, 没有羊群效应
 
## 共享锁 (Shared Lock, S锁)

### 简单实现

1. 定义锁, 使用zk上的**临时顺序**节点来表示, 如/shared_lock/XXXXX-R-00001,表示一个共享锁
2. 获取锁, 所有客户端都到/shared_lock这个节点下创建一个临时顺序节点
  * 如果是读请求则带R标识, 如/shared_lock/XXXXX-R-00001
  * 如果是写请求则带W标识, 如/shared_lock/XXXXX-W-00001
2.1 获取/shared_lock节点下所有子节点, 并对该节点下注册子节点变更的Watcher监听
2.2 确定自己节点序号在所有子节点中的顺序
2.3 对于读请求, 如果没有比自己序号小的写节点, 则成功获得锁,
    对于写请求, 如果自己是序号最小的子节点, 则成功获得锁
2.4 如果没有成功获得锁, 则进入等到, 接收到Watcher通知后, 重复步骤2.1

3. 释放锁, 同排它锁一样, 即子节点删除

### 改进版 (避免羊群效应)
思路, 只关心与自己获取锁相关的关键节点
1. 客户端创建相应请求类型的临时顺序节点
2. 获取/shared_lock下的所有子节点, 注意这里不注册任何Watcher
3. 如果无法获取共享锁, 那么调用exist()/getData()来对关键节点注册Watcher
  * 读请求关键节点: 比自己序号小的最后一个写节点
  * 写请求关键节点: 比自己序号小的最后一个节点
4. 等待Watcher通知, 然后进入步骤2


## Curator分布式锁源码解析
Curator中的一些分布式工具位于recipes模块, maven依赖如下
```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>4.0.1</version>
</dependency>
```
### 分布式可重入锁 InterProcessMutex
Curator分布式锁接口

```java
public interface InterProcessLock
{
    /**
     * 获取锁,调用时会阻塞直到获取成功, 同一线程多次获取则必须多次调用释放#release
     * @throws Exception ZK errors, connection interruptions
     */
    public void acquire() throws Exception;

    /**
     * 尝试获取锁, 最多阻塞时间自定, 超时则返回false 
     * @throws Exception ZK errors, connection interruptions
     */
    public boolean acquire(long time, TimeUnit unit) throws Exception;

    /**
     * 释放锁一次
     * @throws Exception ZK errors, interruptions, current thread does not own the lock
     */
    public void release() throws Exception;

    /**
     * 锁是否被当前的JVM持有 (注意不是当前线程)
     * @return true/false
     */
    boolean isAcquiredInThisProcess();
}
```

可重入独占锁实现InterProcessMutex, 总体实现逻辑为上文排他锁的改进实现

```java
public class InterProcessMutex implements InterProcessLock, Revocable<InterProcessMutex> {
    
    @Override
    public void acquire() throws Exception {
        // 过期时间为-1, 即永久阻塞等待锁
        if ( !internalLock(-1, null) )
        {
            throw new IOException("Lost connection while trying to acquire lock: " + basePath);
        }
    }
    
    private boolean internalLock(long time, TimeUnit unit) throws Exception {
        Thread currentThread = Thread.currentThread();

        // 若当前线程正持有锁, 则简单的将lockCount加1, 实现可重入
        LockData lockData = threadData.get(currentThread);
        if ( lockData != null )
        {
            // re-entering
            lockData.lockCount.incrementAndGet();
            return true;
        }

        // 带上最大等待时长去请求锁
        String lockPath = internals.attemptLock(time, unit, getLockNodeBytes());
        if ( lockPath != null )
        {
            // 获得锁之后，记录当前的线程获得锁的信息，在重入时只需在LockData中增加次数统计即可
            LockData newLockData = new LockData(currentThread, lockPath);
            threadData.put(currentThread, newLockData);
            return true;
        }

        return false;
    }
    
}

```

请求锁的具体实现位于LockInternals类中

```java
public class LockInternals {
    
    String attemptLock(long time, TimeUnit unit, byte[] lockNodeBytes) throws Exception {
        final long      startMillis = System.currentTimeMillis();
        final Long      millisToWait = (unit != null) ? unit.toMillis(time) : null;
        final byte[]    localLockNodeBytes = (revocable.get() != null) ? new byte[0] : lockNodeBytes;
        int             retryCount = 0;

        String          ourPath = null;
        boolean         hasTheLock = false;
        boolean         isDone = false;
        
        // 此循环是判定session过期时重试使用
        while ( !isDone )
        {
            isDone = true;

            try
            {
                // 在锁空间下创建临时顺序子节点
                ourPath = driver.createsTheLock(client, path, localLockNodeBytes);
                // 判断是否获得锁（子节点序号最小），获得锁则直接返回，否则阻塞等待前一个子节点删除通知
                hasTheLock = internalLockLoop(startMillis, millisToWait, ourPath);
            }
            catch ( KeeperException.NoNodeException e )
            {
                // -- 当捕捉到NoNodeException时,由于有可能是因为session过期导致的,
                // 这里需要根据重试策略进行重试
                // gets thrown by StandardLockInternalsDriver when it can't find the lock node
                // this can happen when the session expires, etc. So, if the retry allows, just try it all again
                if ( client.getZookeeperClient().getRetryPolicy().allowRetry(retryCount++, System.currentTimeMillis() - startMillis, RetryLoop.getDefaultRetrySleeper()) )
                {
                    isDone = false;
                }
                else
                {
                    throw e;
                }
            }
        }

        if ( hasTheLock )
        {
            return ourPath;
        }

        return null;
    }
    
    private boolean internalLockLoop(long startMillis, Long millisToWait, String ourPath) throws Exception {
        boolean     haveTheLock = false;
        boolean     doDelete = false;
        try
        {
            if ( revocable.get() != null )
            {
                client.getData().usingWatcher(revocableWatcher).forPath(ourPath);
            }
            
            // 此循环是接收到notify后重试获取锁时使用, 即自旋
            while ( (client.getState() == CuratorFrameworkState.STARTED) && !haveTheLock )
            {
                // 获取所有子节点列表, 并且按照从小到大排序
                List<String>        children = getSortedChildren();
                
                // 判断当前子节点是否是最小子节点
                String              sequenceNodeName = ourPath.substring(basePath.length() + 1); // +1 to include the slash
                PredicateResults    predicateResults = driver.getsTheLock(client, children, sequenceNodeName, maxLeases);
                if ( predicateResults.getsTheLock() )
                {
                    //如果为最小子节点则认为获得锁 
                    haveTheLock = true;
                }
                else
                {
                    //否则获取前一个子节点作为监视对象
                    String  previousSequencePath = basePath + "/" + predicateResults.getPathToWatch();

                    // 这里使用对象监视器做线程同步，当获取不到锁时监听前一个子节点删除消息并且进行wait()，
                    // 当前一个子节点删除（也就是锁释放）时，回调会通过notifyAll唤醒此线程，此线程继续自旋判断是否获得锁
                    synchronized(this)
                    {
                        try 
                        {
                            // use getData() instead of exists() to avoid leaving unneeded watchers which is a type of resource leak
                            // 这里使用getData()接口而不是checkExists()是因为，如果前一个子节点已经被删除了那么会抛出异常而且不会设置事件监听器，
                            // 而checkExists虽然也可以获取到节点是否存在的信息但是同时设置了监听器，这个监听器其实永远不会触发，对于zookeeper来说属于资源泄露
                            client.getData().usingWatcher(watcher).forPath(previousSequencePath);
                            
                            // 如果设置了阻塞等待的时间
                            if ( millisToWait != null )
                            {
                                millisToWait -= (System.currentTimeMillis() - startMillis);
                                startMillis = System.currentTimeMillis();
                                if ( millisToWait <= 0 )
                                {
                                    doDelete = true;    // timed out - delete our node
                                    break;
                                }

                                // 等待相应的时间
                                wait(millisToWait);
                            }
                            else
                            {
                                // 永远等待
                                wait();
                            }
                        }
                        catch ( KeeperException.NoNodeException e ) 
                        {
                            // it has been deleted (i.e. lock released). Try to acquire again
                            // 上面使用getData来设置监听器时，如果前一个子节点已经被删除那么会抛出NoNodeException，只需要自旋一次即可，无需额外处理
                        }
                    }
                }
            }
        }
        catch ( Exception e )
        {
            ThreadUtils.checkInterrupted(e);
            doDelete = true;
            throw e;
        }
        finally
        {
            if ( doDelete )
            {
                deleteOurPath(ourPath);
            }
        }
        return haveTheLock;
    }
    
    // Watch回调事件定义
    private final Watcher watcher = new Watcher()
    {
        @Override
        public void process(WatchedEvent event)
        {
            notifyFromWatcher();
        }
    };
    private synchronized void notifyFromWatcher()
    {
        // 唤醒线程
        notifyAll();
    }
}
```


## 参考
* [Zookeeper客户端Curator使用详解](http://www.throwable.club/2018/12/16/zookeeper-curator-usage/)
* [基于Zookeeper的分布式锁](http://www.dengshenyu.com/java/%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F/2017/10/23/zookeeper-distributed-lock.html)
* [七张图彻底讲清楚ZooKeeper分布式锁的实现原理](https://juejin.im/post/5c01532ef265da61362232ed)
* [秋雨霏霏Curator系列文章](https://my.oschina.net/roccn?tab=newest&catalogId=5647769)