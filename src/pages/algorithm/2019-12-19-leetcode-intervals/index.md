---
title: leetcode区间(interval)
date: "2019-08-06T22:40:32.169Z"
path: "/leetcode-interval"
tags:
    - algorithm
---

## 56. Merge Intervals
合并重叠的区间, `[[1,4],[4,5]]` Output: `[[1,5]]`
根据interval.start排序, 时间O(NLogN), 空间O(n)
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        List<int[]> ans = new ArrayList<>();
        for (int[] interval : intervals) {
            int[] last;
            if (ans.isEmpty() || (last = ans.get(ans.size() - 1))[1] < interval[0]) {
                ans.add(interval);
            } else {
                last[1] = Math.max(last[1], interval[1]);
            }
        }
        return ans.toArray(new int[ans.size()][0]);
    }
}
```

## 57. Insert Interval
给出已经排序的区间列表,插入一个新的区间,若有重叠则合并
Input: intervals = `[[1,3],[6,9]]`, newInterval = `[2,5]`
Output: `[[1,5],[6,9]]`
先插入小于新区间的所有区间, 插入新区间, 然后插入剩下的区间, 插入过程中保持合并操作
```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> ans = new ArrayList<>();
        int i = 0;
        while (i < intervals.length && intervals[i][0] <= newInterval[0]) {
            ans.add(intervals[i++]);
        }
        int[] last;
        if (ans.isEmpty() || (last = ans.get(ans.size() - 1))[1] < newInterval[0]) {
            ans.add(newInterval);
        } else {
            last[1] = Math.max(last[1], newInterval[1]);
        }
        while (i < intervals.length) {
            last = ans.get(ans.size() - 1);
            if (last[1] < intervals[i][0]) {
                ans.add(intervals[i]);
            } else {
                last[1] = Math.max(last[1], intervals[i][1]);
            }
            i++;
        }
        return ans.toArray(new int[ans.size()][]);
    }
}
```
