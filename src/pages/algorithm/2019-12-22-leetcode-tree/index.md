---
title: leetcode树题
date: "2019-12-22T22:40:32.169Z"
path: "/leetcode-tree"
tags:
    - algorithm
---

## 94. Binary Tree Inorder Traversal
给出一个二叉树，求其中序遍历（要求不使用递归）
解法: 使用一个栈存已经处理过左子树的节点, 
* 若当前节点非空, 则当前节点进栈, 将当前节点赋值为其左节点
* 若当前节点为空, 则访问当前节点, 将当前节点赋值为其右节点

```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        List<Integer> ans = new ArrayList<>();
        TreeNode temp = root;
        while (temp != null || !stack.isEmpty()) {
            if (temp != null) {
                stack.offerLast(temp);
                temp = temp.left;
            } else {
                temp = stack.pollLast();
                ans.add(temp.val);
                temp = temp.right;
            }
        }
        return ans;
    }
}
```

## 95. Unique Binary Search Trees II
题意: 生成出所有节点数量为n的二分查找树

## 99. Recover Binary Search Tree
题意: 二分查找树有两个节点错误地交换了位置,将其恢复

## 109. Convert Sorted List to Binary Search Tree
题意:将有序链表转化为二叉平衡树

解法一:递归,每次寻找链表中点,将其左右两边生成为其两个子树, 时间O(NlogN)

解法二:递归,使用全局指针+中序遍历,每次先生成左子树,再生成中间节点(移动指针),再生成右子树,时间O(N)
以下代码利用size作为递归条件, 也可以利用`(left(0), right(size - 1))`作为递归条件
```java
class Solution {
    public TreeNode sortedListToBST(ListNode head) {
        temp = head;
        int cnt = 0;
        while (head != null) {
            cnt++;
            head = head.next;
        }
        return build(cnt);
    }
    
    private ListNode temp;
    
    private TreeNode build(int size) {
        if (size <= 0) {
            return null;
        }
        int rightSize = (size - 1) / 2;
        TreeNode left = build(size - 1 - rightSize);

        TreeNode cur = new TreeNode(temp.val);
        cur.left = left;
        temp = temp.next;

        cur.right = build(rightSize);
        return cur;
    }
}
```

## 117. Populating Next Right Pointers in Each Node II
题意:为一棵普通的二叉树添加next指针,使每个节点的next指向同一层的右边的第一个节点
解法一:层次遍历 时间O(n), 空间O(n)
```java
class Solution {
    public Node connect(Node root) {
        if (root == null) {
            return null;
        }
        List<Node> cur = new ArrayList<>(), next;
        cur.add(root);
        while (!cur.isEmpty()) {
            next = new ArrayList<>();
            for (int i = 0; i < cur.size(); i++) {
                Node node = cur.get(i);
                if (node.left != null) {
                    next.add(node.left);
                }
                if (node.right != null) {
                    next.add(node.right);
                }
                if (i != cur.size() - 1) {
                    node.next = cur.get(i + 1);
                }
            }
            cur = next;
        }
        return root;
    }
}
```
解法二:利用上一层已经连接好的next指针
时间O(n), 空间O(1)
```java
class Solution {
    public Node connect(Node root) {
        Node temp = root, tempChild = new Node();
        while (temp != null) {
            Node currentChild = tempChild;
            while (temp != null) {
                if (temp.left != null) {
                    currentChild.next = temp.left;
                    currentChild = currentChild.next;
                }
                if (temp.right != null) {
                    currentChild.next = temp.right;
                    currentChild = currentChild.next;
                }
                temp = temp.next;
            }
            temp = tempChild.next;
            tempChild.next = null;
        }
        return root;
    }
}
```

## 1305. All Elements in Two Binary Search Trees
题意: 给出两颗二叉搜索树, 求其中所有元素排序后的列表

解法一:
分别中序遍历得到两个有序列表, 再使用归并排序得到答案
时间O(N), `15ms`(一次遍历+排序), 空间O(N).
注意:`Collections#sort`中使用了Timsort,底层思想类似于merge-sort,
所以对于两个大段排序好的集合,排序时间复杂度O(n)
```java
class Solution {
    public List<Integer> getAllElements(TreeNode root1, TreeNode root2) {
        List<Integer> ans = new ArrayList<>();
        travel(ans, root1);
        travel(ans, root2);
        Collections.sort(ans);
        return ans;
    }
    
    private void travel(List<Integer> ans, TreeNode root) {
        if (root == null) {
            return;
        }
        travel(ans, root.left);
        ans.add(root.val);
        travel(ans, root.right);
    }
    
}
```

解法二:
借鉴二叉树的非递归中序遍历, 使用一个栈储存已经处理过左子树的节点,
由于有两棵树, 需要递归地初始化好两个栈, 之后每一步中比较两个栈顶的元素大小,
利用归并排序依次处理, 再将其右子树继续递归的插入栈中.
时间复杂度: O(n), `18ms`, 两次遍历(进栈&出栈), 空间: O(n)
```java
class Solution {
    public List<Integer> getAllElements(TreeNode root1, TreeNode root2) {
        Deque<TreeNode> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();
        pushLeft(root1, s1);
        pushLeft(root2, s2);
        List<Integer> ans = new ArrayList<>();
        while (!s1.isEmpty() || !s2.isEmpty()) {
            Deque<TreeNode> s = s1.isEmpty() ? s2 : 
                (s2.isEmpty() ? s1 : (s1.peekLast().val < s2.peekLast().val ? s1 : s2));
            TreeNode cur = s.pollLast();
            ans.add(cur.val);
            pushLeft(cur.right, s);
        }
        return ans;
    }
    
    private void pushLeft(TreeNode node, Deque<TreeNode> stack) {
        if (node == null) {
            return;
        }
        stack.offerLast(node);
        pushLeft(node.left, stack);
    }
}
```

## 144. Binary Tree Preorder Traversal
二叉树的前序遍历, 要求不使用递归
解法一: 将左右子树分别进栈
```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        if (root == null) {
            return ans;
        }
        Deque<TreeNode> stack = new LinkedList<>();
        stack.offerLast(root);
        while (!stack.isEmpty()) {
            TreeNode temp = stack.pollLast();
            ans.add(temp.val);
            if (temp.right != null) {
                stack.offerLast(temp.right);
            }
            if (temp.left != null) {
                stack.offerLast(temp.left);
            }
        }
        return ans;
    }
}
```

解法二: 只将右子树进栈
```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        Deque<TreeNode> stack = new LinkedList<>();
        List<Integer> ans = new ArrayList<>();
        while (root != null || !stack.isEmpty()) {
            root = root == null ? stack.pollLast() : root;
            ans.add(root.val);
            if (root.right != null) {
                stack.offerLast(root.right);
            }
            root = root.left;
        }
        return ans;
    }
}
```

## 145. Binary Tree Postorder Traversal
二叉树后序遍历,要求不使用递归
思路: 递归时, 后序遍历的栈中需要存储当前节点的所有祖先;
考虑非递归时用Deque模拟栈调用, 每当从栈顶弹出一个元素, 
无法直接判定是需要访问它, 还是访问它的子节点; 
考虑后序遍历时, 每当访问一个节点, 其前一个被访问的节点一定是它的儿子节点(叶子节点除外),
所以利用一个变量`lastVisit`来确定是直接访问此节点, 还是先访问其儿子节点.
```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        if (root == null) {
            return ans;
        }
        Deque<TreeNode> stack = new LinkedList<>();
        TreeNode lastVisit = root;
        stack.offerLast(root);
        while (!stack.isEmpty()) {
            TreeNode temp = stack.peekLast();
            if ((temp.left == null && temp.right == null)
                || temp.left == lastVisit || temp.right == lastVisit) {
                ans.add(stack.pollLast().val);
                lastVisit = temp;
            } else {
                if (temp.right != null) {
                    stack.offerLast(temp.right);
                }
                if (temp.left != null) {
                    stack.offerLast(temp.left);
                }
            }
        }
        return ans;
    }
}
```


