---
title: leetcode binary search
date: "2020-02-02T22:40:32.169Z"
path: "/leetcode-binary-search"
tags:
    - algorithm
---

## 数字在排序数组中出现的次数
思路一: 由于原数组都是整数, 找分别找`k+0.5`和`k-0.5`相关的下标(第一个...最后一个...均可)
```java
public class Solution {
    public int GetNumberOfK(int [] array , int k) {
       return indexOf(array, k + 0.5) - indexOf(array, k - 0.5);
    }
    private int indexOf(int[] arr, double k) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] > k) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // 返回left或right都可以
        return left;
    }
}
```

思路二: 找到第一个大于等于的下标, 最后一个小于等于的下标, 相减+1即可 
```java
public class Solution {
    public int GetNumberOfK(int [] arr , int k) {
       return lastEqualSmaller(arr, k) - firstEqualGreater(arr, k) + 1;
    }
    
    private int firstEqualGreater(int arr[], int k) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + ((right - left) >>> 1);
            if (arr[mid] >= k) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
    
    private int lastEqualSmaller(int arr[], int k) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + ((right - left) >>> 1);
            if (arr[mid] <= k) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return right;
    }
}
```

## 查找第一个与key相等的元素
```java
static int findFirstEqual(int[] array, int key) {
    int left = 0;
    int right = array.length - 1;

    // 这里必须是 <=
    while (left <= right) {
        int mid = (left + right) / 2;
        if (array[mid] >= key) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }
    if (left < array.length && array[left] == key) {
        return left;
    }
    
    return -1;
}
```

## 查找最后一个与key相等的元素
```java
// 查找最后一个相等的元素
static int findLastEqual(int[] array, int key) {
    int left = 0;
    int right = array.length - 1;

    // 这里必须是 <=
    while (left <= right) {
        int mid = (left + right) / 2;
        if (array[mid] <= key) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    if (right >= 0 && array[right] == key) {
        return right;
    }

    return -1;
}
```

## 查找最后一个等于或者小于key的元素
```java
static int findLastEqualSmaller(int[] array, int key) {
    int left = 0;
    int right = array.length - 1;

    // 这里必须是 <=
    while (left <= right) {
        int mid = (left + right) / 2;
        if (array[mid] > key) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }
    return right;
}
```

## 查找最后一个小于key的元素
```java
// 查找最后一个小于key的元素
static int findLastSmaller(int[] array, int key) {
    int left = 0;
    int right = array.length - 1;

    // 这里必须是 <=
    while (left <= right) {
        int mid = (left + right) / 2;
        if (array[mid] >= key) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }
    return right;
}

```

## 查找第一个等于或者大于key的元素
```java
static int findFirstEqualLarger(int[] array, int key) {
    int left = 0;
    int right = array.length - 1;

    // 这里必须是 <=
    while (left <= right) {
        int mid = (left + right) / 2;
        if (array[mid] >= key) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }
    return left;
}
```

## 查找第一个大于key的元素
```java
static int findFirstLarger(int[] array, int key) {
    int left = 0;
    int right = array.length - 1;

    // 这里必须是 <=
    while (left <= right) {
        int mid = (left + right) / 2;
        if (array[mid] > key) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }
    return left;
}
```

## 二分查找变种总结
1. 首先判断出是返回left，还是返回right, 
最后跳出while (left <= right)循环条件是right < left，且right = left - 1。最后right和left一定是卡在"边界值"的左右两边，
如果是比较值为key，查找小于等于（或者是小于）key的元素，则边界值就是等于key的所有元素的最左边那个，其实应该返回left。

2. 判断出比较符号
如果是查找小于等于key的元素，则知道应该使用判断符号>=，因为是要返回left，所以如果`array[mid]`等于或者大于key，就应该使用>=