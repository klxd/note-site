---
title: 双指针
date: "2019-08-06T22:40:32.169Z"
path: "/two-pointer"
tags:
    - algorithm
---

# 132. Palindrome Partitioning II
回文串分割,给出一个普通字符串,将其分割成多个回文串,输出最小的切割数, 如`aab`可分为 `aa,b`, ans=1
解法一: 时间O(n3), 空间O(n), `293 ms` 
使用数组记录前i个字符所需要的切割数, 每增加一个字符, 则尝试遍历前`i-1`个字符是否为回文,如果是则更新`cnt[i]`
```java
class Solution {
    public int minCut(String s) {
        int cnt[] = new int[s.length() + 1];
        cnt[0] = -1;
        for (int i = 0; i < s.length(); i++) {
            cnt[i + 1] = cnt[i] + 1;
            for (int start = 0; start < i; start++) {
                if (isP(s, start, i)) {
                    cnt[i + 1] = Math.min(cnt[i + 1], cnt[start] + 1);
                }
            }
        }
        return cnt[s.length()];
    }

    private boolean isP(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left++) != s.charAt(right--)) {
                return false;
            }
        }
        return true;
    }
}
```
解法二: 时间O(n2), 空间O(n), `8 ms` 
使用`cnt[i]`前`i-1`个字符所需要的切割数,初始化为`i-1`(特别地`cnt[0]=-1`),
对于每个位置i,以它为中心尝试扩展回文串(区分奇数和偶数长度),同时更新cnt数组
```java
class Solution {
    public int minCut(String s) {
        int cnt[] = new int[s.length() + 1];
        for (int i = 0; i <= s.length(); i++) {
            cnt[i] = i - 1;
        }
        for (int i = 0; i < s.length(); i++) {
            for (int j = 0; i - j >= 0 && i + j < s.length() && s.charAt(i - j) == s.charAt(i + j); j++) {
                cnt[i + j + 1] = Math.min(cnt[i + j + 1], cnt[i - j] + 1);
            }
            for (int j = 1; i - j + 1 >= 0 && i + j < s.length() && s.charAt(i - j + 1) == s.charAt(i + j); j++) {
                cnt[i + j + 1] = Math.min(cnt[i + j + 1], cnt[i - j + 1] + 1);
            }
        }
        return cnt[s.length()];
    }
}
```

