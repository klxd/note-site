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


## 1353. Maximum Number of Events That Can Be Attended
题意: 给出一组时间区间, 每个区间代表一个任务可以被完成的最小时间和最大时间, 最多可能完成多少任务.
思路: 任务按照开始时间排序, 对于开始时间这一个时刻, 最应该先完成结束时间最小的那个任务.
注意: 若按照上面的规则排序后的顺序为任务完成顺序, 则会得到错误答案, 考虑数据`[1,2], [1,2], [1,5], [1,5], [3,3]`,
关键点是, 当时刻为3的时候, 应该考虑当前时刻可能完成的所有任务.

解法一: 优先队列, 直接模拟, 遍历时修改任务的开始时间, 再将其放回队列
时间复杂度: O(n * m * logN), m为时间区间的长度, 因为同一个任务会多次放回队列
```java
class Solution {
    public int maxEvents(int[][] events) {
        PriorityQueue<int[]> q = new PriorityQueue<>(
            (a, b) -> a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]);
        for (int e[] : events) {
            q.offer(e);
        }
        int now = 0, ans = 0;
        while (!q.isEmpty()) {
            int[] first = q.poll();
            if (first[0] > now) {
                ans++;
                now = first[0];
            } else {
                // 若当前任务仍可能被完成, 则修改开始时间并放回
                if (first[1] > now) {
                    first[0] = now + 1;
                    q.offer(first);
                }
            }
        }
        return ans;
    }
}
```

解法二: 任务只按照开始时间排序, 优先队列里面只放结束时间, 确保每个任务只入队一次
时间复杂度: O(NlogN)(排序+优先队列入队) 
```java
class Solution {
    public int maxEvents(int[][] events) {
        Arrays.sort(events, (a, b) -> a[0] - b[0]);
        int now = 0, ans = 0, idx = 0;
        PriorityQueue<Integer> q = new PriorityQueue<>();
        while (!q.isEmpty() || idx < events.length) {
            while(!q.isEmpty() && q.peek() < now) {
                q.poll();
            }
            if (!q.isEmpty()) {
                q.poll();
                ans++;
                now++;
            } else {
                now = idx < events.length ? events[idx][0] : now; 
            }
            while (idx < events.length && events[idx][0] <= now) {
                q.offer(events[idx++][1]);
            }
        }
        return ans;
    }
}
```
大神写法, 思路更清晰
```java
class Solution {
   public int maxEvents(int[][] A) {
        PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
        Arrays.sort(A, (a, b) -> Integer.compare(a[0], b[0]));
        int i = 0, res = 0, d = 0, n = A.length;
        while (!pq.isEmpty() || i < n) {
            if (pq.isEmpty())
                d = A[i][0];
            while (i < n && A[i][0] <= d)
                pq.offer(A[i++][1]);
            pq.poll();
            ++res; ++d;
            while (!pq.isEmpty() && pq.peek() < d)
                pq.poll();
        }
        return res;
    }
}
```