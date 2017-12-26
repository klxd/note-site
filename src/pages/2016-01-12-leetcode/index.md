---
title: LeetCode 题解
date: "2016-01-12T22:40:32.169Z"
path: "/leetcode/"
tags:
    - leetcode
---

# 1.two sum

给出一个无序数组,从中找出和为某一固定值的两个数字,返回其数组下标

hint

* 不能直接排序,否则下标关系消失

solution 1: time O(n) space O(n)

1. 新建一个 HashMap,存放 value->index
2. 遍历数组,从 HashMap 中查看是否存在值等于`target-arr[n]`
3. 若存在则返回,否则将 value->index 放入 HashMap 中

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(target - nums[i])) {
                int[] ret = new int[2];
                ret[0] = map.get(target - nums[i]);
                ret[1] = i;
                return ret;
            }
            map.put(nums[i], i);
        }
        return null;
    }
}
```

# 167. Two Sum II - Input array is sorted

给出一个有序数组,从中找出和为某一固定值的两个数字,返回其数组下标(not zero-based)

solution: time O(n), space O(1)

```java
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                return new int[]{left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[2];
    }
}
```

# 653. Two Sum IV - Input is a BST

给出一棵二叉查找树,确定其中是否**存在**和为某一固定值的两个数字

solution 1: time O(n), space O(n)  
遍历树,利用 HashMap 记录访问过的节点的值

solution 2: time O(n), space O(n)  
把树转化为有序数组,然后采用头尾遍历

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean findTarget(TreeNode root, int k) {
        Set<Integer> set = new HashSet<>();
        return search(set, root, k);
    }


    private boolean search(Set<Integer> set, TreeNode root, int k) {
        if (root == null) {
            return false;
        }
        if (set.contains(k - root.val)) {
            return true;
        }
        set.add(root.val);
        return search(set, root.left, k) || search(set, root.right, k);
    }
}
```

# 15. 3Sum

给出一个无序数组,从中找出所有满足 a+b+c=target 的三元组(不可重复)

solution: 时间复杂度 O(n^2)

1. 数组排序
2. 遍历数组,对`arr[a]`找出所有满足`arr[b]+arr[c]=target-arr[a]`的元组

```java
public List<List<Integer>> threeSum(int[] num) {
    Arrays.sort(num);
    List<List<Integer>> res = new LinkedList<>();
    for (int i = 0; i < num.length-2; i++) {
        if (i == 0 || (i > 0 && num[i] != num[i-1])) {
            int lo = i+1, hi = num.length-1, sum = 0 - num[i];
            while (lo < hi) {
                if (num[lo] + num[hi] == sum) {
                    res.add(Arrays.asList(num[i], num[lo], num[hi]));
                    while (lo < hi && num[lo] == num[lo+1]) lo++;
                    while (lo < hi && num[hi] == num[hi-1]) hi--;
                    lo++; hi--;
                } else if (num[lo] + num[hi] < sum) lo++;
                else hi--;
           }
        }
    }
    return res;
}
```

# 16. 3Sum Closest

给出一个无序数组,找出一个**和**最接近给定 target 的三元组

solution: O(n^2)

1. 数组排序
2. 遍历数组,对于`arr[i]`,计算`sum=num[i]+num[start]+num[end]`
3. 根据 sum 与 target 的大小关系决定是 start++还是 end--(确保 O(n)遍历)
4. 对于每个 sum,记录下其中最接近 target 的一个

```java
public class Solution {
    public int threeSumClosest(int[] num, int target) {
        int result = num[0] + num[1] + num[num.length - 1];
        Arrays.sort(num);
        for (int i = 0; i < num.length - 2; i++) {
            int start = i + 1, end = num.length - 1;
            while (start < end) {
                int sum = num[i] + num[start] + num[end];
                if (sum > target) {
                    end--;
                } else {
                    start++;
                }
                if (Math.abs(sum - target) < Math.abs(result - target)) {
                    result = sum;
                }
            }
        }
        return result;
    }
}
```
