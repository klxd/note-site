---
title: linux常用命令
date: "2018-02-08T22:22:22.169Z"
path:  "/linux-command"
tags:
   - linux
---

## du命令
du: Disk usage
可以查看文件及文件夹的大小
* -h 表示使用「Human-readable」的输出，也就是在档案系统大小使用 GB、MB 等易读的格式

```bash
du -h ~/Applications 
4.0K	/Users/peng/Applications/Chrome Apps.localized/.localized
368K	/Users/peng/Applications/Chrome Apps.localized
368K	/Users/peng/Applications
```

查找最占据磁盘空间的目录

## df命令
df: disk free 其功能是显示磁盘可用空间数目信息及空间结点信息。
换句话说，就是报告在任何安装的设备或目录中，还剩多少自由的空间

可以查看一级文件夹大小、使用比例、档案系统及其挂入点，但对文件却无能为力

```
Filesystem    512-blocks     Used Available Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   394532824 93385904 297726624    24% 1129328 9223372036853646479    0%   /
devfs                375      375         0   100%     649                   0  100%   /dev
/dev/disk1s4   394532824  2097192 297726624     1%       1 9223372036854775806    0%   /private/var/vm
/dev/disk0s3    95291384 75771232  19520152    80%  162180             9767880    2%   /Volumes/BOOTCAMP
map -hosts             0        0         0   100%       0                   0  100%   /net
map auto_home          0        0         0   100%       0                   0  100%   /home
/dev/disk1s3   394532824  1019704 297726624     1%      14 9223372036854775793    0%   /Volumes/Recovery
```

## Top命令

Linux中的top命令显示系统上正在运行的**进程**.

### 系统运行时间和平均负载

top命令的顶部显示与uptime命令相似的输出。

```
16:00  up 2 days, 16:34, 2 users, load averages: 2.22 2.31 2.23
```
这些字段显示：

* 当前时间
* 系统已运行的时间
* 当前登录用户的数量
* 相应最近5、10和15分钟内的平均负载

### 任务数量

```
Processes: 301 total, 2 running, 299 sleeping, 1414 threads 
```

任务或者进程的总结。进程可以处于不同的状态。这里显示了全部进程的数量。
除此之外，还有正在运行、睡眠、停止、僵尸进程的数量（僵尸是一种进程的状态）

### CPU 状态

这里显示了不同模式下的所占CPU时间的百分比。这些不同的CPU时间表示:

* us, user： 运行(未调整优先级的) 用户进程的CPU时间
* sy，system: 运行内核进程的CPU时间
* ni，niced：运行已调整优先级的用户进程的CPU时间
* wa，IO wait: 用于等待IO完成的CPU时间
* hi：处理硬件中断的CPU时间
* si: 处理软件中断的CPU时间
* st：这个虚拟机被hypervisor偷去的CPU时间
     （译注：如果当前处于一个hypervisor下的vm，实际上hypervisor也是要消耗一部分CPU处理时间的）。


### 内存使用

内存使用率，有点像'**free**'命令。第一行是物理内存使用，第二行是虚拟内存使用(交换空间)。

物理内存显示如下:全部可用内存、已使用内存、空闲内存、缓冲内存。
相似地：交换部分显示的是：全部、已使用、空闲和缓冲交换空间。

### 进程信息

在横向列出的系统属性和状态下面，是以列显示的进程。不同的列代表下面要解释的不同属性。

默认上，top显示这些关于进程的属性：

* PID 进程ID，进程的唯一标识符

* USER 进程所有者的实际用户名。

* PR 进程的调度优先级。这个字段的一些值是'rt'。这意味这这些进程运行在实时态。

* NI 进程的nice值（优先级）。越小的值意味着越高的优先级。

* VIRT 进程使用的虚拟内存。

* RES 驻留内存大小。驻留内存是任务使用的非交换物理内存大小。

* SHR SHR是进程使用的共享内存。

* S 这个是进程的状态。它有以下不同的值:
   * D - 不可中断的睡眠态。
   * R – 运行态
   * S – 睡眠态
   * T – 被跟踪或已停止
   * Z – 僵尸态

* %CPU 自从上一次更新时到现在任务所使用的CPU时间百分比。

* %MEM 进程使用的可用物理内存百分比。

* TIME+ 任务启动后到现在所使用的全部CPU时间，精确到百分之一秒。

* COMMAND 运行进程所使用的命令。




## chmod, chgrp, chown

* 权限控制：`drwxrwxrwx`
   * 1：`-`表示正常文件，`d`表示目录
   * 2 - 4：文件所有者的权限
   * 5 - 7：同组的用户权限
   * 8 - 10：其他用户的权限


* chmod: 修改文件权限
   * 用法


* chown: 修改文件所有者
   * 用法：`chown [-Rcfv] newowner filenames/directory` 
   * 只有root用户能操作

* chgrp: 修改文件所在组
   * 用法：`chgrp [-Rcfv] groupname foo.txt`

## wc (word count) 命令
统计指定文件中的字节数、字数、行数，并将统计结果显示输出

用法：`wc [-clmw] [file ...]`

* -l 统计行数
* -w 统计字数
* -c 统计字节数
* -m 统计字符数

统计文件数量
`ls -l | wc -l`

## netstat
列出系统上所有的网络套接字连接情况，包括 tcp, udp 以及 unix 套接字，
另外它还能列出处于监听状态（即等待接入请求）的套接字

* -a 列出当前所有连接
* -t 列出tcp协议的连接
* -u 列出udp协议的连接
* -n 禁用方向域名解析（查找IP对应的主机名），加快查找速度
* -p 查看进程信息


## JVM线程数


## JVM实时状态监控

### jinfo


### jstack
jstack用于打印出给定的java进程ID或core file或远程调试服务的Java**堆栈信息**

* 用法:
    * `jstack [-l] <pid>`
        (to connect to running process)
    * `jstack -F [-m] [-l] <pid>`
        (to connect to a hung process)
    * `jstack [-m] [-l] <executable> <core>`
        (to connect to a core file)
    * `jstack [-m] [-l] [server_id@]<remote server IP or hostname>`
        (to connect to a remote debug server)

* 参数
    * -F  当`jstack [-l] pid`没有响应(进程被挂起)的时候, 强制打印栈信息
    * -m  打印java虚拟机栈和本地方法栈的信息
    * -l  打印出关于锁的附加信息

* 线程的状态
  * Runnable: 该状态表示线程具备所有运行条件，在运行队列中准备操作系统的调度，或者正在运行。
  * Wait on condition: 该状态出现在线程等待某个条件的发生。最常见的情况是线程在等待网络的读写, 也有可能是线程在sleep
  * Waiting for monitor entry 和 in Object.wait(): 等待锁或者调用Object.wait()
* 死锁自动检测, 线程Dump中可以直接报告出Java级别的死锁
```
Found one Java-level deadlock:

=============================

"Thread-1":

waiting to lock monitor 0x0003f334 (object 0x22c19f18, a java.lang.Object),

which is held by "Thread-0"

"Thread-0":

waiting to lock monitor 0x0003f314 (object 0x22c19f20, a java.lang.Object),

which is held by "Thread-1"

```


### jstat (Java Virtual Machine Statistics Monitoring Tool)
语法`jstat [ generalOption | outputOptions vmid [interval[s|ms] [count]]]`
例子 `jstat -gcutil 8443 2s 10`: 查看pid为8443的进程的gc信息, 每2s一次, 打印10次;
堆的使用情况进行实时的命令行的统计，使用jstat我们可以对指定的JVM做如下监控：

- 类的加载及卸载情况
- 查看新生代、老生代及持久代的容量及使用情况
- 查看新生代、老生代及持久代的垃圾收集情况，包括垃圾回收的次数及垃圾回收所占用的时间
- 查看新生代中Eden区及Survior区中容量及分配情况

outputOptions -一个或多个输出选项，由单个的statOption选项组成，可以和-t, -h, and -J等选项配合使用。

* class	用于查看类加载情况的统计
* compiler	用于查看HotSpot中即时编译器编译情况的统计
* gc	用于查看JVM中堆的垃圾收集情况的统计
* gccapacity	用于查看新生代、老生代及持久代的存储容量情况
* gccause	用于查看垃圾收集的统计情况（这个和-gcutil选项一样），如果有发生垃圾收集，它还会显示最后一次及当前正在发生垃圾收集的原因。
* gcnew	用于查看新生代垃圾收集的情况
* gcnewcapacity	用于查看新生代的存储容量情况
* gcold	用于查看老生代及持久代发生GC的情况
* gcoldcapacity	用于查看老生代的容量
* gcpermcapacity	用于查看持久代的容量
* gcutil	用于查看新生代、老生代及持代垃圾收集的情况
* printcompilation	HotSpot编译方法的统计

#### gcutil
* S0	Heap上的 Survivor space 0 区已使用空间的百分比
* S1	Heap上的 Survivor space 1 区已使用空间的百分比
* E	    Heap上的 Eden space 区已使用空间的百分比
* O	    Heap上的 Old space 区已使用空间的百分比
* M     Metaspace utilization(元空间)已使用空间的百分比.
* P	    Perm space 区已使用空间的百分比 (java1.8之后已废弃, 无此列)
* YGC	从应用程序启动到采样时发生 Young GC 的次数
* YGCT	从应用程序启动到采样时 Young GC 所用的时间(单位秒)
* FGC	从应用程序启动到采样时发生 Full GC 的次数
* FGCT	从应用程序启动到采样时 Full GC 所用的时间(单位秒)
* GCT	从应用程序启动到采样时用于垃圾回收的总时间(单位秒)，它的值等于YGC+FGC

```
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT   
  1.12   0.00  14.86  49.30  95.12  92.59 305592 2411.072   206   26.933 2438.005
  1.12   0.00  38.48  49.30  95.12  92.59 305592 2411.072   206   26.933 2438.005
  1.12   0.00  66.03  49.30  95.12  92.59 305592 2411.072   206   26.933 2438.005
  1.12   0.00  87.06  49.30  95.12  92.59 305592 2411.072   206   26.933 2438.005
  0.00   1.26   7.89  49.30  95.12  92.59 305593 2411.079   206   26.933 2438.013
  0.00   1.26  33.05  49.30  95.12  92.59 305593 2411.079   206   26.933 2438.013
  0.00   1.26  54.24  49.30  95.12  92.59 305593 2411.079   206   26.933 2438.013
  0.00   1.26  85.42  49.30  95.12  92.59 305593 2411.079   206   26.933 2438.013
  0.82   0.00  22.25  49.32  95.12  92.59 305594 2411.087   206   26.933 2438.020
  0.82   0.00  39.81  49.32  95.12  92.59 305594 2411.087   206   26.933 2438.020
```

```
# ps -p 16 -o etime
    ELAPSED
46-07:14:21
```
* 容器运行46天7小时, 发生206次FGC(每五个小时发生一次), 总时长26.933秒(每次131ms)
* 每13秒一次YGC(每分钟4.5次), 总时长2411.072秒, 每次7.8ms

## jmap (Java Memory Map)
打印出某个java进程（使用pid）内存内的，所有‘对象’的情况（如：产生那些对象，及其数量）。
* 直接使用
```
# jmap 16
Attaching to process ID 16, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.201-b09
0x0000000000400000      8K      /usr/java/jdk1.8.0_201-amd64/jre/bin/java
0x00007f5025baa000      88K     /lib64/libgcc_s-4.4.7-20120601.so.1
0x00007f5025dc0000      276K    /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libsunec.so
0x00007f5092cdd000      108K    /lib64/libresolv-2.12.so
0x00007f5092ef7000      26K     /lib64/libnss_dns-2.12.so
0x00007f50d8d1c000      91K     /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libnio.so
0x00007f50d8f2e000      114K    /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libnet.so
0x00007f50d9146000      50K     /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libmanagement.so
0x00007f50ff0a8000      124K    /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libzip.so
0x00007f50ff2c4000      64K     /lib64/libnss_files-2.12.so
0x00007f50ff4d2000      226K    /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libjava.so
0x00007f50ff701000      64K     /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/libverify.so
0x00007f50ff910000      42K     /lib64/librt-2.12.so
0x00007f50ffb18000      582K    /lib64/libm-2.12.so
0x00007f50ffd9c000      16645K  /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/server/libjvm.so
0x00007f5100d85000      1875K   /lib64/libc-2.12.so
0x00007f5101119000      19K     /lib64/libdl-2.12.so
0x00007f510131d000      106K    /usr/java/jdk1.8.0_201-amd64/jre/lib/amd64/jli/libjli.so
0x00007f5101535000      139K    /lib64/libpthread-2.12.so
0x00007f5101752000      151K    /lib64/ld-2.12.so
```
* `jmap -dump:<dump-options>`: 以hprof二进制格式转储Java堆到指定filename的文件中(为了保证dump的信息是可靠的,所以会暂停应用,线上系统慎用)。
  live子选项是可选的。如果指定了live子选项, 堆中只有活动的对象会被转储。想要浏览heap dump，你可以使用jhat(Java堆分析工具)读取生成的文件。
  示例: `jmap -F -dump:format=b,file=heapDump 1 #1是进程号`, 生成的heapDump文件有将近2个G的大小, 可使用VisualVM分析
  * -F 强迫.在pid没有相应的时候使用-dump或者-histo参数. 在这个模式下,live子参数无效.

* -heap: 打印一个堆的摘要信息，包括使用的GC算法、堆配置信息和各内存区域内存使用信息

```
# jmap -heap 16
Attaching to process ID 16, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.201-b09

using parallel threads in the new generation.
using thread-local object allocation.
Concurrent Mark-Sweep GC

Heap Configuration:
   MinHeapFreeRatio         = 40
   MaxHeapFreeRatio         = 70
   MaxHeapSize              = 2147483648 (2048.0MB)
   NewSize                  = 805306368 (768.0MB)
   MaxNewSize               = 805306368 (768.0MB)
   OldSize                  = 1342177280 (1280.0MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 268435456 (256.0MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
New Generation (Eden + 1 Survivor Space):
   capacity = 724828160 (691.25MB)
   used     = 251852944 (240.18568420410156MB)
   free     = 472975216 (451.06431579589844MB)
   34.74657276008703% used
Eden Space:
   capacity = 644349952 (614.5MB)
   used     = 250814512 (239.1953582763672MB)
   free     = 393535440 (375.3046417236328MB)
   38.925200695910036% used
From Space:
   capacity = 80478208 (76.75MB)
   used     = 1038432 (0.990325927734375MB)
   free     = 79439776 (75.75967407226562MB)
   1.2903269416734529% used
To Space:
   capacity = 80478208 (76.75MB)
   used     = 0 (0.0MB)
   free     = 80478208 (76.75MB)
   0.0% used
concurrent mark-sweep generation:
   capacity = 1342177280 (1280.0MB)
   used     = 550666560 (525.1565551757812MB)
   free     = 791510720 (754.8434448242188MB)
   41.02785587310791% used

42154 interned Strings occupying 5627216 bytes.
```
* `jmap -histo:live pid`: 显示堆中对象的统计信息
   其中包括每个Java类、对象数量、内存大小(单位：字节)、完全限定的类名。打印的虚拟机内部的类名称将会带有一个’*’前缀。如果指定了live子选项，则只计算活动的对象。
   如果连用SHELL `jmap -histo pid>a.log`可以将其保存到文本中去，在一段时间后，使用文本对比工具，可以对比出GC回收了哪些对象
```
#jmap -histo:live 16

 num     #instances         #bytes  class name
----------------------------------------------
   1:        348055       55798856  [C
   2:         39739       52493232  [B
   3:        222390       14232960  com.mysql.jdbc.ConnectionPropertiesImpl$BooleanConnectionProperty
   4:        320557       10257824  java.util.Hashtable$Entry
   5:        344560        8269440  java.lang.String
   6:         17009        5410464  [Ljava.util.HashMap$Node;
   7:         81190        5196160  com.mysql.jdbc.ConnectionPropertiesImpl$StringConnectionProperty
   8:         61335        4039000  [Ljava.lang.Object;
   9:         52950        3388800  com.mysql.jdbc.ConnectionPropertiesImpl$IntegerConnectionProperty
  10:        100025        3200800  java.util.HashMap$Node
  11:          2999        2825728  [Ljava.util.Hashtable$Entry;
  12:         29751        2618088  java.lang.reflect.Method
  13:         81364        2603648  java.util.concurrent.ConcurrentHashMap$Node
  14:         20946        2360872  [I
  15:         19851        2230216  java.lang.Class
  16:          1765        2174480  com.mysql.jdbc.JDBC4Connection
  17:        103851        1661616  java.lang.Object
  18:         33104        1588992  org.apache.tomcat.util.buf.ByteChunk
  19:         32300        1550400  org.apache.tomcat.util.buf.CharChunk
  20:         32100        1540800  org.apache.tomcat.util.buf.MessageBytes
  21:         34527        1381080  java.util.LinkedHashMap$Entry
  22:         51927        1246248  java.util.ArrayList
  23:         10611        1188432  java.net.SocksSocketImpl
  24:         15839         886984  java.util.LinkedHashMap
  25:           542         884976  [Ljava.util.concurrent.ConcurrentHashMap$Node;
  26:           200         818304  [Ljava.nio.ByteBuffer;
  27:         20156         806240  java.lang.ref.SoftReference
  28:         12407         595536  java.util.HashMap
  29:         22498         539952  java.util.LinkedList$Node
  30:         12294         511864  [Ljava.lang.String;
  31:         23544         509176  [Ljava.lang.Class;
  32:         10604         508992  java.net.SocketInputStream
  33:         10604         508992  java.net.SocketOutputStream
  34:         15269         488608  java.util.LinkedList
  35:          4153         465136  java.util.GregorianCalendar
  36:         10988         439520  java.lang.ref.Finalizer
  37:          4154         398784  sun.util.calendar.Gregorian$Date
  38:          5295         381240  com.mysql.jdbc.ConnectionPropertiesImpl$MemorySizeConnectionProperty
  39:         23379         374064  java.lang.Integer
  40:         11139         356448  java.lang.ref.WeakReference
  41:         11131         356192  java.io.FileDescriptor
  42:         10607         339424  java.net.Socket
  43:          8052         322080  io.shardingsphere.core.parsing.parser.context.orderby.OrderItem
  44:          4998         319872  com.google.protobuf.DescriptorProtos$FieldDescriptorProto
  45:          3928         314240  java.lang.reflect.Constructor
  46:          9294         297408  org.antlr.v4.runtime.atn.ATNConfig
  ...
  Total       2786540      216239448
```

# Q & A
* 如何用工具分析jvm状态（visualVM看堆中对象的分配，对象间的引用、是否有内存泄漏，jstack看线程状态、是否死锁等等）
* linux怎么看一个端口被什么进程占用（lsof -i:xxx）
* Linux的磁盘管理
* Linux怎么查看系统负载情况
* 图形化调试工具, 
   * jconsole: JVM中内存，线程,类,JVM摘要,MBeans等信息
   * jvisualvm, 可以直接查看heap dump, 类实例内存占用比; 也能直接查看thread dump
   * MAT(Memory Analyzer Tool,一个基于Eclipse的内存分析工具)

## 参考
* [Java 命令行工具的使用](http://blog.csdn.net/fenglibing/article/details/6411951)
* [netstat 的10个基本用法](https://linux.cn/article-2434-1.html)