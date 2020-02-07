---
title: leetcode math
date: "2020-01-02T22:40:32.169Z"
path: "/leetcode-math"
tags:
    - algorithm
---


## 172. Factorial Trailing Zeroes
题意: 求阶乘末尾零的个数

分析: 末尾零的个数=分解因子10的个数=分解因子5的个数(2的数量大于5),
考虑n=51, 先找出第一层有5为因子的数`5, 10, 15, ...50`, 数量为`n/5`,
此时由于有25这些有多个因子5的数, 可模拟将上面的数全部除以5, 变成`1, 2, 3 .. 10`,
变成求trailingZeroes(n / 5), 可用递归非递归两种解法.

```java
class Solution {
    public int trailingZeroes(int n) {
        int ans = 0;
        while (n > 0) {
            ans += n / 5;
            n /= 5;
        }
        return ans;
    }
}
```

## 把数组排成最小的数
例如输入数组{3，32，321}，则打印出这三个数字能排成的最小数字为321323。
思路：数字转为字符串，然后按照如下规则排序，对于两个字符串，通过正序和逆序分别合并，比较合并后的字符串，
然后按序依次拼接即可。
```java
public class Solution {
    public String PrintMinNumber(int [] numbers) {
        List<String> list = new ArrayList<>();
        for (int num : numbers) {
            list.add(String.valueOf(num));
        }
        list.sort((a, b) -> {
            String s1 = a + b;
            String s2 = b + a;
            return s1.compareTo(s2);
        });
        StringBuilder sb = new StringBuilder();
        for (String str : list) {
            sb.append(str);
        }
        return sb.toString();
    }
}
```