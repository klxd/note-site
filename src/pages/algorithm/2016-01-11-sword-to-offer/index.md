---
title: 剑指offer
date: "2016-01-12T22:40:32.169Z"
path: "/sword-to-offer/"
tags:
    - leetcode
---

## LinkedList

### 从尾到头打印链表

### 15 链表中倒数第k个结点
思路: 快慢指针, 快指针先走k-1步, 注意判断链表长度小于k的情况

### 16 反转链表

### 17 合并两个或k个有序链表
    
### 35 复杂链表的复制
思路: 
1. 在每个节点后面复制一个一样的节点;
2. 新节点的random节点为当前节点的random节点的后一个节点;
3. 拆分链表

### 036-两个链表的第一个公共结点
解法一： 分别求链表长度，长的链表指针先行`len1-len2`步，然后两个指针一起走，若相等则是第一个相遇点

解法二： 分别遍历 `list1 + null + list2`和`list2 + null + list1`, 注意必须走过null节点，防止两个链表不相交而进入死循环
```java
public class Solution {
    public ListNode FindFirstCommonNode(ListNode pHead1, ListNode pHead2) {
        ListNode l1 = pHead1, l2 = pHead2;
        while (l1 != l2) {
            l1 = l1 == null ? pHead2 : l1.next;
            l2 = l2 == null ? pHead1 : l2.next;
        }
        return l1;
    }
}
```
### 055-链表中环的入口结点

### 删除链表中重复的结点

### 13 O(1)时间删除链表节点
思路: 将下一个节点数据复制到当前节点, 删除下一个节点.
注意当节点为最后一个节点, 仍需要遍历链表, 时间复杂度退化.
注意删除节点是头节点的情况.

## Tree

### 重建二叉树    

### 18 树的子结构
思路: 主函数-是否有子结构, 辅助函数-是否是一棵超树 

### 19 二叉树的镜像
交换左右子树

### 23 从上往下打印二叉树
简单层次遍历

### 24 二叉搜索树的后序遍历序列
后序遍历最后一个元素为根节点, 将前面的数字根据是否比根节点大分为两部分, 再递归判断
    
### 34 二叉树中和为某一值的路径
遍历时带上当前路径和

### 36 二叉搜索树与双向链表
原理: 数的中序遍历 
解法一: 辅助函数返回链表的头和尾
```java
public class Solution {
    public TreeNode Convert(TreeNode root) {
        if (root == null) {
            return null;
        }
        return solve(root)[0];
    }
    
    private TreeNode[] solve(TreeNode root) {
        TreeNode[] ret = {root, root};
        
        if (root.left != null) {
            TreeNode[] left = solve(root.left);
            ret[0] = left[0];
            left[1].right = root;
            root.left = left[1];
        }
        if (root.right != null) {
            TreeNode[] right = solve(root.right);
            ret[1].right = right[0];
            right[0].left = ret[1];
            ret[1] = right[1];
        }
        return ret;
    }
}
```
    
### 平衡二叉树
思路: 边遍历边判断
```java
public class Solution {
    public boolean IsBalanced_Solution(TreeNode root) {
        return solve(root) >= 0;
    }
    
    private int solve(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int left = solve(root.left);
        int right = solve(root.right);
        if (left < 0 || right < 0 || Math.abs(left - right) > 1) {
            return -1;
        }
        return Math.max(left, right) + 1;
    }
}
```

### 二叉树的下一个结点
题意:求二叉树中序遍历的下一个节点, 树节点有指向父亲节点的指针
思路: 先看当前节点的右子树, 若存在右子树, 寻找右子树最左的节点;
若没有右子树, 看父亲节点, 当前节点是其父亲节点的左节点, 则输出父亲节点,
否则向上循环找到第一个是父亲节点左节点的父亲节点
```java
public class Solution {
    public TreeLinkNode GetNext(TreeLinkNode root) {
        if (root == null) {
            return null;
        }
        TreeLinkNode right = root.right;
        while (right != null && right.left != null) {
            right = right.left;
        }
        if (right != null) {
            return right;
        }
        TreeLinkNode visited = root;
        while (visited.next != null && visited.next.right == visited) {
            visited = visited.next;
        }
        // 此时visited为根节点 或 第一个是其父亲左节点的祖宗节点
        return visited.next;
    }
}
```
 
### 对称的二叉树
### 按之字形顺序打印二叉树
### 把二叉树打印成多行
### 37 序列化二叉树
思路一: 递归法. 前序遍历二叉树(注意不能用中序或后序), 
序列化时遇到空节点输出特殊字符,
反序列化时也用递归, 记录当前遍历字符的指针
```java
public class Solution {
    String Serialize(TreeNode root) {
        if (root == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        serialize(root, sb);
        sb.deleteCharAt(sb.length() - 1);
        return sb.toString();
    }
    
    private void serialize(TreeNode root, StringBuilder sb) {
        if (root == null) {
            sb.append("#,");
            return;
        }
        sb.append(root.val);
        sb.append(',');
        serialize(root.left, sb);
        serialize(root.right, sb);
    }

    TreeNode Deserialize(String str) {
       if (str == null || str.length() == 0) {
           return null;
       }
       String[] strings = str.split(",");
       return deserialize(strings, new int[]{0});
    }
    
    private TreeNode deserialize(String[] strings, int[] idx) {
        if (idx[0] >= strings.length) {
            return null;
        }
        String str = strings[idx[0]++];
        if ("#".equals(str)) {
            return null;
        }
        TreeNode ret = new TreeNode(Integer.valueOf(str));
        ret.left = deserialize(strings, idx);
        ret.right = deserialize(strings, idx);
        return ret;
    }
}
```

思路二: 层次遍历, 遍历时不管当前节点的左右节点是否为空, 都加入队列
```java
public class Solution {
    String Serialize(TreeNode root) {
        if (root == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
                TreeNode node = q.poll();
                if (node == null) {
                    sb.append("#,");
                } else {
                    sb.append(node.val);
                    sb.append(',');
                    q.offer(node.left);
                    q.offer(node.right);
                }
        }
        sb.deleteCharAt(sb.length() -1);
        return sb.toString();
    }
    TreeNode Deserialize(String str) {
        if (str == null || str.length() == 0) {
            return null;
        }
        String[] strings = str.split(",");
        TreeNode root = new TreeNode(Integer.valueOf(strings[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int idx = 1;
        while (idx < strings.length) {
            TreeNode node = q.poll();
            String left = strings[idx++];
            String right = strings[idx++];
            if (!"#".equals(left)) {
                node.left = new TreeNode(Integer.valueOf(left));
                q.offer(node.left);
            }
            if (!"#".equals(right)) {
                node.right = new TreeNode(Integer.valueOf(right));
                q.offer(node.right);
            }
        }
        return root;
    }
}
```

### 二叉搜索树的第k个结点
思路: 中序遍历+全局下标
```java
public class Solution {
    TreeNode KthNode(TreeNode root, int k) {
        if (root == null) {
            return null;
        }
        TreeNode ans = KthNode(root.left, k);
        if (ans != null) {
            return ans;
        }
        if (++cnt == k) {
            return root;
        }
        return KthNode(root.right, k);
    }
    
    private int cnt = 0;
}
```

### 68 树中两个节点的最低公共祖先
二叉搜索树: 根据节点大小递归判断
带父亲指针的数: 转化为链表第一个公共节点
普通二叉树: 
思路一: O(n)的辅助空间记录两条路径, 转化为链表公共节点问题
思路二: DFS, 遍历的时候直接用指针判断
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left == null && right == null) {
            return null;
        }
        if (left != null && right != null) {
            return root;
        }
        return left == null ? right : left;
    }
}
```
思路三: DFS+全局变量, 遍历的时候用数量判断
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        find(root, p, q);
        return ans;
    }
    
    private TreeNode ans = null;
    
    private int find(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) {
            return 0;
        }
        int cur = (root.val == p.val || root.val == q.val) ? 1 : 0;
        int l = find(root.left, p, q);
        int r = find(root.right, p, q);
        if (l == 1 && r == 1 || cur == 1 && l + r == 1) {
            ans = root;
        }
        return l + r + cur;
    }
}
```
## Stack & Queue

### 用两个栈实现队列
思路: 入队栈, 正常push元素,
出队栈, 当出队栈为空, 将入队栈所有元素一次弹出推到入队栈, 不为空则按序弹出即可

### 两个队列实现栈
正常压入其中一个队列的对尾, 当需要弹出时, 将一个队列的所有元素出队压入另一个队列, 留下最后的一个元素为弹出元素,
弹出复杂度为O(n)

### 30 包含min函数的栈
思路: 入栈:判断元素是否小于等于min栈顶, 满足则也入min栈;
出栈:判断元素是否等于min栈顶, 满足则min栈顶也出栈

### 22 栈的压入、弹出序列
思路: 模拟法, 若当前元素不为出栈序列则入栈, 若压入序列已用完且栈顶不为弹出序列的下一个, 则失败

### 滑动窗口的最大值
思路: 双端队列, 队列中存有可能成为答案的下标,
每次窗口右移, 加入一个新下标时, 保证前面的每一个数字都比它大, 否则前面的数字从尾部出队,
当队首下标小于`end-size`时, 队首出队, 每次移动后, 队首的数字即当前最大值
注: 此思路也可用于解决问题 - **队列的最大值**
```java
public class Solution {
    public ArrayList<Integer> maxInWindows(int [] num, int k) {
        ArrayList<Integer> ans = new ArrayList<>();
        if (k == 0) {
            return ans;
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < num.length; i++) {
            while (!q.isEmpty() && num[q.peekLast()] < num[i]) {
                q.pollLast();
            }
            q.offer(i);
            if (q.peekFirst() < i - k + 1) {
                q.pollFirst();
            }
            if (i >= k - 1) {
                ans.add(num[q.peekFirst()]);
            }
        }
        return ans;
    }
}
```

Heap

### 30 最小的K个数
思路一: 基于partition函数的思路, 时间O(1), 需要修改原数组, 不适用于数据流
思路二: 最小堆, 时间O(NlogK), 适用于数据流

### 41 数据流中的中位数
思路: 理论上用AVL数也可以实现O(logN)插入, O(1)查询, 但是没现成的数据结构,
考虑用最大堆和最小堆实现
```java
public class Solution {

    private PriorityQueue<Integer> max = new PriorityQueue<>((a, b) -> b - a);
    private PriorityQueue<Integer> min = new PriorityQueue<>();
    
    public void Insert(Integer num) {
        if (max.size() > min.size()) {
            min.offer(num);
        } else {
            max.offer(num);
        }
        // 此处用if即可, 每次只插入一个数字, 最多只有一个数字不满足
        if (!min.isEmpty() && !max.isEmpty()
               && min.peek() < max.peek()) {
            min.offer(max.poll());
            max.offer(min.poll());
        }
    }

    public Double GetMedian() {
        return max.size() > min.size() ? (double)max.peek() : ((double)max.peek() + min.peek()) / 2;
    }
}
```

## Hash Table

### 50 第一个只出现一次的字符
解法一：使用hashMap或者int数组存储对应字符出现的次数，第一次遍历字符串得每个字符出现的次数，
第二次再遍历字符串，找出现字符次数为1的第一个字符， 时间复杂度 O(n+n).

解法二：使用hashMap或int数组存储对应字符出现的下标，若不存在则存-1，出现超过一次则存储-2，
这样第二次遍历可用O(256)=O(1)的时间得到最小的下标


### 50 变形题：在字符流中找到第一个只出现一次的字符
解法一：同原题解法二， 每次获取字符时， 遍历hashMap或int数组，
读取字符流时间复杂度O(1)，查找第一个出现一次的字符时间复杂度O(256)

解法二：用hashMap或int数组存每个字符出现的次数，使用一个队列，读取字符流时，若此字符是第一个出现，则将其入队，
并循环判断队列头字符出现的次数，如果大于一次，则将其出队。 由于每种字符最多入队一次，队列最大长度等于hashMap大小，空间复杂度不变。
此算法可将查找复杂度优化为O(1)

## 具体算法类题目

007-斐波拉契数列    
008-跳台阶    
009-变态跳台阶   
010-矩形覆盖搜索算法
001-二维数组查找
006-旋转数组的最小数字（二分查找）

### 38 字符串的排列
若不考虑字符重复的情况, 简单递归法即可,
若考虑重复字符, 则先排序, 然后利用boolean数组记录使用过的字符.
```java
public class Solution {
    public ArrayList<String> Permutation(String str) {
        char ch[] = str.toCharArray();
        Arrays.sort(ch);
        ArrayList<String> ans = new ArrayList<>();
        solve(ch, new boolean[str.length()], 0, new char[str.length()], ans);
        return ans;
    }
    
    private void solve(char[] ch, boolean[] used, int cur, char[] temp, ArrayList<String> ans) {
        if (cur == ch.length && cur > 0) {
            ans.add(String.valueOf(temp));
        }
        char pre = '#';
        for (int i = 0; i < used.length; i++) {
            if (!used[i] && ch[i] != pre) {
                pre = ch[i];
                used[i] = true;
                temp[cur] = ch[i];
                solve(ch, used, cur + 1,temp, ans);
                used[i] = false;
            }
        }
    }
}
```


## 动态规划
### 42 连续子数组的最大和
思路: 前缀和小于0则抛弃

### 46 数字翻译成字符串
题意: 0-a, 1-b, .. 11-l, .. 25-z, 其中25也可以翻译成'cf',
求一个数字有多少种不同的翻译方法

思路: 一维动态规划

### 47 礼物最大价值
题意: 数字矩阵, 每次只能向左或向下, 求最大路径
思路: 简单二维动态规划

### 正则表达式匹配


## 排序

### 51 数组中的逆序对
归并排序

### 最小的K个数
堆排序, partition    

### 33 把数组排成最小的数
思路: 数字排序, 比较函数: 分别合并两个字符串为一个数字, 小的排前面

### 11 数值的整数次方
`double power(double base, int exponent)`
1. 注意判断base和exponent都是0的情况(double值比较)
2. 注意exponent为负数的情况
3. 计算多次幂时, 可用递归或者循环减少计算次数 

040-数组中只出现一次的数字

## 滑动窗口

### 48 最长不含重复字符的子串
思路一: 简单滑动窗口, cnt数组记录字符出现的次数, 当遇到次数大于1, 挪动(每次+1)窗口起始位置直到此次数等于1,
可适用于最多容忍k次重复或仅含父串内容的题目

思路二: cnt数组记录字符出现的下标, 当第二次遇到此字符, 直接跳动窗口起始位置到`pre+1`的位置,
下次遇到小于窗口起始位置的下标字符时直接忽略

### 57 和为S的连续正数序列
```java
public class Solution {
    public ArrayList<ArrayList<Integer> > FindContinuousSequence(int sum) {
        int left = 1, right = (int)Math.sqrt(sum * 2), cur = (right * (right + 1)) >> 1;
        ArrayList<ArrayList<Integer>> ans = new ArrayList<>();
        while (right <= sum) {
            if (cur == sum) {
                if (left < right) {
                    ArrayList<Integer> list = new ArrayList<>();
                    for (int i = left; i <= right; i++) {
                        list.add(i);
                    }
                    ans.add(list);
                }
                cur -= left++;
            }
            else if (cur < sum) {
                cur += ++right;
            } else {
                cur -= left++;
            }
        }
        return ans;
    }
}
```

## 其他算法

### 14 013-调整数组顺序使奇数位于偶数前面
思路: 类似快排中的partition函数, 两个指针分别指向偶数和奇数, 直到相遇

028-数组中出现次数超过一半的数字


### 43 从1到n整数中1出现的次数
思路:
从 1 至 10，在它们的个位数中，任意的 X 都出现了 1 次。
从 1 至 100，在它们的十位数中，任意的 X 都出现了 10 次。
从 1 至 1000，在它们的百位数中，任意的 X 都出现了 100 次。

设i为1所在的位数(个位, 十位, 百位100), 则1出现的周期为`div = i * 10`,
完整区间中1的个数为 `n / (i * 10) * i`;
考虑最后一个区间(周期可能不完整), 区间长度`k = n % (i * 10)`,
该区间中1的个数为
```
i         (k > (i * 2 - 1))
k - i + 1 (k > i && k < (i * 2 - 1))
0         (k < i)
```
只考虑`k-i+1`在`[0, i]`区间内, 可以简化为`min(max((n mod (i*10))−i+1,0),i)`;
   

```java
public class Solution {
    public int NumberOf1Between1AndN_Solution(int n) {
        if (n == 0) {
            return 0;
        }
        int ans = 0;
        for (long i = 1; i <= n; i *= 10) {
            long div = i * 10;
            ans += (n / div * i) + Math.min(i,
                                           Math.max(n % div - i + 1, 0));
        }
        return ans;
    }
}
``` 

### 44 数字序列中某一位的数字
题意: 数字序列`012456789101112..`, 求第n位的数字
思路: 1位数10个, 2位数90个, 3位数900个..., n依次减去这些数字位,
确定到第n位是几位数, 然后取模得第几个数字, 再简单计算得到答案 


### 34 丑数
题意: 因子中只有2,3,5的数字为丑数, 求第N个丑数
思路: 按序生产丑数, 每个新丑数都是都前面的丑数乘以2,3,5得到的,维护三个指针,
每次从这三个指针对应的丑数中生成新的丑数, 选最小的一个, 移动指针该指针(可能同时多个) 


### 圆圈中最后剩下的数(约瑟夫环)
题意: n个孩子(从0开始编号), 轮流报数(从0到m-1), 报到m-1的孩子出列, 求最后一个孩子
思路一: 使用linkedList模拟, 空间O(n), 时间O(n)
```java
public class Solution {
    public int LastRemaining_Solution(int n, int m) {
        if (n == 0) {
            return -1;
        }
        LinkedList<Integer> list = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            list.add(i);
        }
        int curCnt = 0;
        while (list.size() > 1) {
            curCnt = (curCnt + m - 1) % list.size();
            list.remove(curCnt);
        }
        return list.get(0);
    }
}
```

思路二: 寻找递推公式, 
考虑n个人的情况下, 首次出圈的人为`k=(m-1)%n`, 剩下`n-1`个人组成新的圈, 将下标映射成`0~n-2`,
```
k+1  0
k+2  1
...
n-1  n-k-2
0    n-k-1
...
k-1  n-2 (k-1-(k+1)%n = -2%n = n - 1
```
所以从f(n,m)时的下标变化到f(n-1,m)时的变化函数是`p(x)=(x-k-1)%n`, 对应逆变换为`p*(x)=(x+k+1)%n`, 
代入`k=(m-1)%n`得到下标变化函数为`p*(x)=(x+m)%n`,考虑f(n,m)与f(n-1,m)的关系, 可以得到
`f(n,m)=[f(n-1,m) + m] % n`;
递归解法:
```java
public class Solution {
    public int LastRemaining_Solution(int n, int m) {
        if (n == 0 || m == 0) {
            return -1;
        }
        if (n == 1) {
            return 0;
        }
        return (LastRemaining_Solution(n - 1, m) + m) % n;
    }
}
```

循环解法:
```java
public class Solution {
    public int LastRemaining_Solution(int n, int m) {
        if (n == 0 || m == 0) {
            return -1;
        }
        int last = 0;
        for (int i = 2; i <= n; i++) {
            last = (last + m) % i;
        }
        return last;
    }
}
```


###　011-二进制中1的个数

### 20 顺时针打印矩阵

### 60 n个骰子的点数
题意: n个骰子点数和为s, 求s所以值出现的概率
思路一: 求n个数字`1-6`的排列, 对每个排列计算点数和, 然后统计概率
时间复杂度O(6的N次幂)

思路二: 考虑n个骰子, 每个s的概率为n-1个骰子时出现`s-1, s-2, ... s-6`的概率总和,
可用循环实现, 模拟直到n个骰子.


### 不用if else求1+2+..n
思路: 利用逻辑断路+递归
```java
public class Solution {
    public int Sum_Solution(int n) {
        int ans = 0;
        boolean flag = (n > 0 && (ans += (n + Sum_Solution(n - 1))) > 0);
        return ans;
    }
}
```

### 不使用除法构建乘积数组
思路: 从左往右, 记录前n-1个数的乘积, 再从右往左, 乘上后面的乘积
```java
public class Solution {
    public int[] multiply(int[] a) {
        int b [] = new int[a.length];
        if (a.length == 0) {
            return b;
        }
        b[0] = 1;
        for (int i = 1, cur = 1; i < a.length; i++) {
            cur *= a[i - 1];
            b[i] = cur;
        }
        for (int i = a.length - 2, cur = 1; i >= 0; i--) {
            cur *= a[i + 1];
            b[i] *= cur;
        }
        return b;
    }
}
```
