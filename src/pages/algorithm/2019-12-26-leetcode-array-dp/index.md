---
title: leetcode array dp
date: "2019-12-26T22:40:32.169Z"
path: "/leetcode-array-dp"
tags:
    - algorithm
---

## 121. Best Time to Buy and Sell Stock
给出代表股票价格的数组, 只能买卖一次, 求最大获利

解法: 对于每一个值`prices[i]`,找出其左边最小的一个值,即维护一个`leftMin`变量即可
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) {
            return 0;
        }
        int ans = 0, leftMin = prices[0];
        for (int i = 1; i < prices.length; i++) {
            ans = Math.max(ans, prices[i] - leftMin);
            leftMin = Math.min(leftMin, prices[i]);
        }
        return ans;
    }
}
```

## 122. Best Time to Buy and Sell Stock II
给出代表股票价格的数组, 可以交易无限次, 求最大获利

解法: 赚取每一个涨幅, 即若`prices[i] < prices[i+1]`, 最终答案加上此差值

## 123. Best Time to Buy and Sell Stock III
题意: 给出代表股票价格的数组,只能买入和卖出各两次, 求最大获利

思路: 时间O(n), 空间O(1)
第一次最大获利为`money1 = (price[i] - buy1)`,
第二次最大获利为`money2 = (price[i] - buy2) + money1`, 

```java
public class Solution {
        public int MaxProfitDpCompactFinal(int[] prices)  {
            int buy1 = Integer.MIN_VALUE, buy2 = Integer.MIN_VALUE;
            int sell1 = 0, sell2 = 0;

            for (int i = 0; i < prices.Length; i++) {
                buy1 = Math.Min(buy1, prices[i]);
                sell1 = Math.Max(sell1, prices[i] - buy1);
                buy2 = Math.Min(buy2, prices[i] - sell1);
                sell2 = Math.Max(sell2, prices[i] - buy2);
            }

            return sell2;
        }
}
```

```java
public class Solution {
    public int maxProfit(int[] prices) {
        int hold1 = Integer.MIN_VALUE, hold2 = Integer.MIN_VALUE;
        int release1 = 0, release2 = 0;
        for(int i : prices){                              // Assume we only have 0 money at first
            release2 = Math.max(release2, hold2+i);     // The maximum if we've just sold 2nd stock so far.
            hold2    = Math.max(hold2,    release1-i);  // The maximum if we've just buy  2nd stock so far.
            release1 = Math.max(release1, hold1+i);     // The maximum if we've just sold 1nd stock so far.
            hold1    = Math.max(hold1,    -i);          // The maximum if we've just buy  1st stock so far. 
        }
        return release2; ///Since release1 is initiated as 0, so release2 will always higher than release1.
    }
}
```


## 188. Best Time to Buy and Sell Stock IV
题意: 给出代表股票价格的数组, 最多只能买卖k次, 求最大获利


## 689. Maximum Sum of 3 Non-Overlapping Subarrays