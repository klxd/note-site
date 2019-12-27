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