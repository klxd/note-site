---
title: leetcode list
date: "2019-12-28T22:40:32.169Z"
path: "/leetcode-list"
tags:
    - algorithm
---

## 138. Copy List with Random Pointer
题意: 链表的节点中有一个random域随机指向链表中的一个节点, 求此链表的深拷贝
解法一: 遍历链表复制节点, 使用hashMap保存原节点与新节点的映射关系, 
再同时遍历新旧两个链表, 设置random域

解法二: 在原来的链表上复制节点,并链接到原节点的后面, 如 `1->2->3` 变为 `1-1-2-2-3-3`,
再次遍历链表,将新节点的random指向旧节点的next节点, 此解法比解法一节省O(n)的额外空间


## 142. Linked List Cycle II
题意：（剑指offer #23） 链表中环的入口节点
解法一：使用快慢指针确认是否有环，再让其重新循环一次得到环的长度，
重置慢指针为链表头，快指针为环的长度，两个指针以同样的速度前进，当他们相遇的时候，
快指针已经绕环走了一圈，此时相遇点就是环的入口
```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }
        ListNode slow = head, fast = head;
        boolean hasCycle = false;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
            if (fast == slow) {
                hasCycle = true;
                break;
            }
        }
        if (!hasCycle) {
            return null;
        }
        int cycleLen = 0;
        do {
            fast = fast.next.next;
            slow = slow.next;
            cycleLen++;
        } while (fast != slow);

        fast = slow = head;
        while (cycleLen-- > 0) {
            fast = fast.next;
        }
        while (fast != slow) {
            fast = fast.next;
            slow = slow.next;
        }
        return fast;
    }
}
```

解法二:
1. 用slower和faster方法判断是否有环
2. 设链表的头节点是head，环的入口节点是entry，slower和faster2个指针相遇的节点是meeting, 
   将slow指针重置为head, 让两个指针以相同的速度前进, 再次相遇的点就是环的入口

证明: 设L1是head到entry的正向距离，L2是entry到meeting的正向距离，C是环的长度，n是faster指针在cycle里遍历的次数(不到一遍算0),
根据上面的定义，可知：
* 当slower和faster相遇时，slower已经走了L1 + L2的距离，也即head和meeting的距离;
* 当slower和faster相遇时，faster已经走了L1 + L2 + n * C的距离;

因为slower步进1，而faster步进2，那么当slower和faster第一次相遇时，faster已经走的距离是slower已经走的距离的两倍，即
 `2 * (L1 + L2) = L1 + L2 + n * C` => `L1 = (n - 1) * C + (C - L2)`

`L1 = (n - 1) * C + (C - L2)` 这个等式表明， head和entry的距离(L1)，等于meeting到entry的正向距离（链表是有遍历方向的）.
这是因为式子中的 (n - 1) * C相当于走n-1个循环，对一个指向meeting的环内指针来说，走(n - 1) * C等于回到起点，所以式子可以简化成 L1 = C - L2。
```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
            if (fast == slow) {
                break;
            }
        }
        if (fast == null || fast.next == null) {
            return null;
        }
        slow = head;
        while (slow != fast) {
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }
}
```


## 148. Sort List
链表排序

解法一: 使用递归式(自顶向下)归并排序, 使用快慢指针找到链表中点, 将其断开为两部分,
分别调用递归排序,再合并两个有序链表;
时间O(NlogN), 空间O(logN)(递归栈空间)


解法二: 非递归(自底向上)归并排序, 初始步长1, 依次链表以步长分割, 两两合并,
将步长乘2, 重复以上步骤, 直到步长大于链表总长.
时间O(NlogN), 空间O(1)
