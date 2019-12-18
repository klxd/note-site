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
    * -F  当`jstack [-l] pid`没有相应(进程被挂起)的时候, 强制打印栈信息
    * -m  打印java虚拟机栈和本地方法栈的信息
    * -l  打印出关于锁的附加信息

### jstat
堆的使用情况进行实时的命令行的统计，使用jstat我们可以对指定的JVM做如下监控：

- 类的加载及卸载情况

- 查看新生代、老生代及持久代的容量及使用情况

- 查看新生代、老生代及持久代的垃圾收集情况，包括垃圾回收的次数及垃圾回收所占用的时间

- 查看新生代中Eden区及Survior区中容量及分配情况

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

## 参考
* [Java 命令行工具的使用](http://blog.csdn.net/fenglibing/article/details/6411951)
* [netstat 的10个基本用法](https://linux.cn/article-2434-1.html)