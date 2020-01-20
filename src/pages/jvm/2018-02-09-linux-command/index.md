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

## JVM线程数



## JVM实时状态监控

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

## jmap
* `jmap -F -dump:format=b,file=heapDump 1 #1是进程号`, 生成的heapDump文件有将近2个G的大小, 可使用VisualVM分析

## netstat
列出系统上所有的网络套接字连接情况，包括 tcp, udp 以及 unix 套接字，
另外它还能列出处于监听状态（即等待接入请求）的套接字

* -a 列出当前所有连接
* -t 列出tcp协议的连接
* -u 列出udp协议的连接
* -n 禁用方向域名解析（查找IP对应的主机名），加快查找速度
* -p 查看进程信息


# Q & A
* 如何用工具分析jvm状态（visualVM看堆中对象的分配，对象间的引用、是否有内存泄漏，jstack看线程状态、是否死锁等等）
* linux怎么看一个端口被什么进程占用（lsof -i:xxx）
* Linux的磁盘管理
* Linux怎么查看系统负载情况

## 参考
* [Java 命令行工具的使用](http://blog.csdn.net/fenglibing/article/details/6411951)
* [netstat 的10个基本用法](https://linux.cn/article-2434-1.html)