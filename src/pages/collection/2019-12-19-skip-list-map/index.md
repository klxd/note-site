---
title: Skip list
date: "2017-09-12T22:22:22.169Z"
path:  "/skip-list"
tags:
   - java
---


## redis中的跳表

```c
/* ZSETs use a specialized version of Skiplists */
typedef struct zskiplistNode {
    sds ele;
    double score;
    struct zskiplistNode *backward;
    struct zskiplistLevel {
        struct zskiplistNode *forward;
        unsigned long span;
    } level[];
} zskiplistNode;

typedef struct zskiplist {
    struct zskiplistNode *header, *tail;
    unsigned long length;
    int level;
} zskiplist;

typedef struct zset {
    dict *dict;
    zskiplist *zsl;
} zset;
```

redis 是把 skiplist 跳表用在 zset 里，zset 是个有序的集合，可以看到 zskiplist 就是个跳表的结构，里面用 header 保存跳表的表头，tail 保存表尾，还有长度和最大层级，具体的跳表节点元素使用 zskiplistNode 表示，里面包含了 sds 类型的元素值，double 类型的分值，用来排序，一个 backward 后向指针和一个 zskiplistLevel 数组，每个 level 包含了一个前向指针，和一个 span，span 表示的是跳表前向指针的跨度，这里再补充一点，前面说了为了灵活这个跳表的新增修改，redis 使用了随机层高的方式插入新节点，但是如果所有节点都随机到很高的层级或者所有都很低的话，跳表的效率优势就会减小，redis以1/4的概率增加层次

```c
#define ZSKIPLIST_P 0.25      /* Skiplist P = 1/4 */
int zslRandomLevel(void) {
    int level = 1;
    while ((random()&0xFFFF) < (ZSKIPLIST_P * 0xFFFF))
        level += 1;
    return (level<ZSKIPLIST_MAXLEVEL) ? level : ZSKIPLIST_MAXLEVEL;
}
```

当随机值跟0xFFFF进行与操作小于ZSKIPLIST_P 0xFFFF时才会增大 level 的值，因此保持了一个相对递减的概率
可以简单分析下，当 random() 的值小于 0xFFFF 的 1/4,才会 level + 1，就意味着当有 1 - 1/4也就是3/4的概率是直接跳出，所以一层的概率是3/4,也就是 1-P，二层的概率是 P(1-P),三层的概率是 P² * (1-P) 依次递推。