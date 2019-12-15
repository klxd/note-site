---
title: LeetCode特殊解法
date: "2016-01-12T22:40:32.169Z"
path: "/leetcode/"
tags:
    - leetcode
---

## 11. Container With Most Water
题意: 给出一个高度数组a,求两个高度之间所能组成的最大矩形面积
解法: 初始化两个指针0和a.length-1, 计算此矩形的面积, 由于此矩形的宽是理论最长,只能寻找更大的矩形高,
判断两个指针对应的高度,舍弃较小的那个,继续寻找至两个指针相遇
```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1, ans = 0;
        while (left < right) {
            ans = Math.max(ans, (right - left) * Math.min(height[left], height[right]));
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return ans;
    }
}
```

## 22. Generate Parentheses
题意: 生成所有长度为n的括号组合, 如n=2, ans={"()()", "(())"}
解法一: 递归生成, 初始字符串为空串, 尝试增加左括号或者右括号, 递归直到长度为2n
代码, 待补充

解法二: 利用公式
 f(n) = "("f(0)")"f(n-1) , "("f(1)")"f(n-2) "("f(2)")"f(n-3) ... "("f(i)")"f(n-1-i) ... "("f(n-1)")"f(0)
代码如下
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<List<String>> ans = new ArrayList<>();
        ans.add(Collections.singletonList(""));
        for (int i = 1; i <= n; i++) {
            List<String> cur = new ArrayList<>();
            for (int j = 0; j < i; j++) {
                List<String> firstList = ans.get(j);
                List<String> secondList = ans.get(i - j - 1);
                for (String first : firstList) {
                    for (String second : secondList) {
                        cur.add("(" + first + ")" + second);
                    }
                }
            }
            ans.add(cur);
        }
        return ans.get(n);
    }
}
```

## 31 Next Permutation 生成下一个排列
给出一个数组, 求该数组下一个排列
解法: 时间O(n), 空间O(1)
以数组{2, 3, 6, 5, 4, 1}
1. 从右往左, 找到第一个不是递增的数字
2. (1)如果无法找到这样的数字,证明此数组是倒序排列的,已经是'最大'的排列,只要将其翻转即可得到下一个(最小)排列
   (2)若找到了这样的数字, 此例中是3, 我们再从最右往左找到第一个比它大的数字, 这样的数字肯定会存在, 此例中是4
3. 交换数字3和4 (2, 4, 6, 5, 3, 1), 然后翻转4之后的所有数字(2, 4, 1, 3, 5, 6)
* 以上算法也能处理数字重复的情况

```java
class Solution {
    public void nextPermutation(int[] nums) {
        int k = -1;
        for (int i = nums.length - 1; i > 0; i--) {
            if (nums[i] > nums[i - 1]) {
                k = i - 1;
                break;
            }
        }
        if (k == -1) {
            reverse(nums, 0, nums.length - 1);
            return;
        }
        int l = -1;
        for (int i = nums.length - 1; i > k; i--) {
            if (nums[i] > nums[k]) {
                l = i;
                break;
            }
        }

        int temp = nums[k];
        nums[k] = nums[l];
        nums[l] = temp;

        reverse(nums, k + 1, nums.length - 1);
    }

    private void reverse(int[] nums, int left, int right) {
        while (left < right) {
            int temp = nums[left];
            nums[left++] = nums[right];
            nums[right--] = temp;
        }
    }
}
```

## 32. Longest Valid Parentheses
给出由'('和')'组成的字符串, 找到最大的合法串的长度,
")()())" =>　4, "()(()" => 2

## 33. Search in Rotated Sorted Array
给出一个经过旋转的排序数组,从中搜索出目标元素下标,不存在则返回-1

相似题：给出一个经过旋转的数组，返回其中最小的数字