---
title: leetcode sort
date: "2019-12-29T22:40:32.169Z"
path: "/leetcode-sort"
tags:
    - algorithm
---


## 各类排序算法复杂度比较

| 复杂度\排序 | Merge sort | Quick sort | Insertion sort | Selection sort | Tim sort |
| :-----    | :------    | :------    | :------        | :------        | : -----  |
|  最好时间   | NlogN      | NlogN      |  N             | N2             | N       |
|  平均时间   | NlogN      | NlogN      |  N2            | N2             | NlogN    |
|  最坏时间   | NlogN      | N2         |  N2            | N2             | NlogN     |
|  空间复杂度 | N (辅助空间) | logN(递归栈) | 1             | 1              | N(辅助空间)|

## 冒泡排序
思想是通过无序区中相邻记录关键字间的比较和位置的交换,使关键字最小的记录如气泡一般逐渐往上“漂浮”直至“水面”。 冒泡排序的复杂度，在最好情况下，即正序有序，则只需要比较n次。故，为O(n) ，最坏情况下，即逆序有序，则需要比较(n-1)+(n-2)+……+1，故，为O(n²)。

在冒泡排序中，最大元素的移动速度是最快的，哪怕一开始最大元素处于序列开头，也可以在一轮内层循环之后，移动到序列末尾。而对于最小元素，每一轮内层循环只能向前挪动一位，如果最小元素在序列末尾，就需要 n-1 次交换才能移动到序列开头

```java
class Solution {
    private static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}
```
改进方案:
* 遍历过程中可以检测到整个序列是否排序完成, 进而避免后续循环
* 每次循环之后, 可以确认最后一次发生交换后的元素都是排好序的, 之后的循环不必再去比较
* 最小的元素若在最后, 需要外层n-1次循环将其移动到最前, 可以进行正逆两个循环, 正循环移动大元素到末尾, 逆循环移动小元素到最前, 即**鸡尾酒排序**

## 插入排序
每次只处理一个元素，从后往前查找，找到该元素合适的插入位置，最好的情况下，即正序有序(从小到大)，这样只需要比较n次，不需要移动。因此时间复杂度为O(n) ，最坏的情况下，即逆序有序，这样每一个元素就需要比较n次，共有n个元素，因此实际复杂度为O(n²) 。


## 快速排序
```java
class Solution {
    public void quickSort(int arr[], int left, int right) {
        if (left >= right) {
            return;
        }
        int p = partition(arr, left, right);
        quickSort(arr, left, p - 1);
        quickSort(arr, p + 1, right);
    }

    private int partition(int arr[], int left, int right) {
        int pivot = arr[left];
        int i = left, j = right;
        while (true) {
            while (arr[i] < pivot) {
                i++;
            }
            while (arr[j] > pivot) {
                j--;
            }
            if (i < j) {
                int temp = arr[i];
                arr[i++] = arr[j];
                arr[j--] = temp;
            } else {
                return j;
            }
        }
    }
}
```

## 归并排序
给出一个数组， 求其中逆序对的数量.
思路： 使用归并排序，合并数组时，若从第二个数组往前放数， 则第一个数组中剩余的所有数字为新增的逆序对
```java
public class Solution {
        public int InversePairs(int [] array) {
        temp = new int[array.length + 1];
        solve(array, 0, array.length - 1);
        return ans;
    }

    int ans = 0;
    int temp[];

    private void solve(int[] arr, int left, int right) {
        if (left >= right) {
            return;
        }
        int mid = left + ((right - left) >> 1);
        solve(arr, left, mid);
        solve(arr, mid + 1, right);
        int a = left, b = mid + 1, idx = left;
        while (idx <= right) {
            if (a > mid) {
                temp[idx++] = arr[b++];
            } else if (b > right) {
                temp[idx++] = arr[a++];
            } else {
                if (arr[a] > arr[b]) {
                    temp[idx++] = arr[b++];
                    ans = (ans + (mid - a + 1)) % 1000000007;
                } else {
                    temp[idx++] = arr[a++];
                }
            }
        }
        for (int i = left; i <= right; i++) {
            arr[i] = temp[i];
        }
    }
}
```

### 315. Count of Smaller Numbers After Self
题意: 给出一个数组, 求每个数字右边比它小的数字的个数
思路: 同逆序对, 但是需要求每个数字对应的逆序对的数量
```java
class Solution {
    private void mergeSort(int nodes[][], int left, int right, List<Integer> ans) {
        if (left >= right) {
            return;
        }
        int mid = left + (right - left) / 2;
        mergeSort(nodes, left, mid, ans);
        mergeSort(nodes, mid + 1, right, ans);
        int holder[][] = new int[right - left + 1][], idx1 = left, idx2 = mid + 1, idx = 0;
        while (idx1 <= mid || idx2 <= right) {
            if (idx1 > mid) {
                holder[idx++] = nodes[idx2++];
            } else if (idx2 > right) {
                ans.set(nodes[idx1][1], ans.get(nodes[idx1][1]) + right - mid);
                holder[idx++] = nodes[idx1++];
            } else {
                if (nodes[idx1][0] <= nodes[idx2][0]) {
                    ans.set(nodes[idx1][1], ans.get(nodes[idx1][1]) + idx2 - mid - 1);
                    holder[idx++] = nodes[idx1++];
                } else {
                    holder[idx++] = nodes[idx2++];
                }
            }
        }
        System.arraycopy(holder, 0, nodes, left, holder.length);
    }

    public List<Integer> countSmaller(int[] nums) {
        int nodes[][] = new int[nums.length][2];
        for (int i = 0 ; i < nums.length; i++) {
            nodes[i] = new int[]{nums[i], i};
        }
        List<Integer> ans = new ArrayList<>(nums.length);
        for (int i = 0; i < nums.length; i++) {
            ans.add(0);
        }
        mergeSort(nodes, 0, nums.length - 1, ans);
        return ans;
    }
}
```

## Timsort
* Java中对象排序没有采用快速排序，是因为快速排序是不稳定的.
* JSE7以后对象排序使用的是Timsort实现(之前是Merge sort) 
* Timsort是稳定的算法，当待排序的数组中已经有排序好的数，它的时间复杂度会小于NlogN。
* 其他合并排序一样，Timesrot是稳定的排序算法，最坏时间复杂度是O（NlogN）。
* 在最坏情况下，Timsort算法需要的临时空间是n/2，在最好情况下，它只需要一个很小的临时存储空间

## Q & A
* 已知数据表 A 中每个元素距其最终位置不远 ，为了节省时间，应该采取的算法是 - 直接插入排序

[blog: Timsort原理学习](https://sikasjc.github.io/2018/07/25/timsort/)