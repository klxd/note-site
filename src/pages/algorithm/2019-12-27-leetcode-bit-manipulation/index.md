---
title: leetcode bit manipulation
date: "2019-12-26T22:40:32.169Z"
path: "/leetcode-bit-manipulation"
tags:
    - algorithm
---


## 137. Single Number II
一个数组中,一个数字出现了1次, 其他都出现3次, 找出这个数字
推广: 这个思路也可推广到任意参数为k,p问题：输入数组每个元素都出现了k次，只有一个只出现了p`(p >= 1, p % k != 0)`次，求那个只出现p次的数。

## 260. Single Number III
一个数组中有两个数字只出现一次, 其他数字都出现2次, 求找出这两个数字
解法: 将所有数字亦或, 得到的值为两个目标数字的亦或值, 找到此值二进制的某一个1, 按照此1将所有数字分为两组, 整租分别亦或即可
```java
class Solution {
    public int[] singleNumber(int[] nums) {
        int xor = 0;
        for (int num : nums) {
            xor ^= num;
        }
        int diff = 1;
        while ((diff & xor) == 0) {
            diff <<= 1;
        }
        int ans[] = new int[2];
        for (int num : nums) {
            if ((num & diff) == 0) {
                ans[0] ^= num;
            } else {
                ans[1] ^= num;
            }
        }
        return ans;
    }
}
```

## 不用加减乘除做加法
```java
public class Solution {
    public int Add(int num1,int num2) {
        while (num2 != 0) {
            int temp = num1 ^ num2; // 忽略进位的结果
            num2 = (num1 & num2) << 1; // 需要进位的结果
            num1 = temp;
        }
        return num1;
    }
}
```