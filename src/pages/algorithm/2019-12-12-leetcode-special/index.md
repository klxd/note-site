---
title: LeetCode特殊解法
date: "2016-01-12T22:40:32.169Z"
path: "/leetcode/"
tags:
    - leetcode
---

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
