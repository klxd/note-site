---
title: LeetCode特殊解法
date: "2016-01-12T22:40:32.169Z"
path: "/leetcode-special"
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
以数组{2, 3, 6, 5, 4, 1}为例,
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

## 35. Search Insert Position
给出一个数组和一个数字, 找到数字在数组中的下标,若无法找到则给出此数字应该插入的位置
```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + ((right - left) >> 1);
            if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                return mid;
            }
        }
        return left;
    }
}
```

## 41. First Missing Positive
给出一个数组, 找到第一个缺失的正数, 要求时间O(n),空间O(1)
思路:遍历数组,若`nums[i]`在数组长度的区间内且`nums[nums[i-1]]`位置上不是对应的数字,则交换两个位置上的数字,
此方法能保证每个数字最多交换一次,就可以放到正确的位置, 时间复杂度O(n); 再次遍历数组即可找到第一个缺失的正数
```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            while (nums[i] > 0
                   && nums[i] <= nums.length
                   && nums[nums[i] - 1] != nums[i]) {
                int temp = nums[i];
                nums[i] = nums[temp - 1];
                nums[temp - 1] = temp;
            }
        }
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return nums.length + 1;
    }
}
```

## 42. Trapping Rain Water
给出一个高度数组,计算容水量(凹陷的面积)
解法一: 时间O(n), 空间O(n)
开两个长度为n的数组分别记录位置i左边的最大值和右边的最大值,
每个位置的容水高度为`Math.min(maxLeft[i], maxRight[i]) - height[i]`
```java
class Solution {
    public int trap(int[] height) {
        int n = height.length, ans = 0;
        if (n == 0) {
            return ans;
        }
        int maxLeft[] = new int[n], maxRight[] = new int[n];
        maxLeft[0] = height[0];
        for (int i = 1; i < n; i++) {
            maxLeft[i] = Math.max(maxLeft[i - 1], height[i]);
        }
        maxRight[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            maxRight[i] = Math.max(maxRight[i + 1], height[i]);
        }
        for (int i = 0; i < n; i++) {
            ans += Math.min(maxLeft[i], maxRight[i]) - height[i];
        }
        return ans;
    }
}
```
解法二: 时间O(n), 空间O(1)
双指针法,从首尾两端分别遍历,记录下leftMax和rightMax,对于每一个left/right,
若当前有`leftMax < rightMax`, 则left位置的容水量肯定为`leftMax - height[left]`,
因为不管后续rightMax高度怎么变化,此位置的容水量总会受限于当前的leftMax.
同理可得`leftMax >= rightMax`的情况.
```java
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1, ans = 0;
        int leftMax = 0, rightMax = 0;
        while (left <= right) {
            leftMax = Math.max(leftMax, height[left]);
            rightMax = Math.max(rightMax, height[right]);
            if (leftMax < rightMax) {
                ans += leftMax - height[left++];
            } else {
                ans += rightMax - height[right--];
            }
        }
        return ans;
    }
}
```

## 45. Jump Game II
给出一个步长数组,`arr[i]`标识在位置i上能跳的步长,求跳到最后一格的最小步数
时间O(n), 空间O(1)
思路:类似树的层次遍历,记录当前步数所能达到的最远距离
```java
class Solution {
public int jump(int[] A) {
	int jumps = 0, curEnd = 0, curFarthest = 0;
	for (int i = 0; i < A.length - 1; i++) {
		curFarthest = Math.max(curFarthest, i + A[i]);
		if (i == curEnd) {
			jumps++;
			curEnd = curFarthest;
		}
	}
	return jumps;
}
}
```

## 48 Rotate Image
旋转一个方形矩阵90度,要求空间O(1)
解法一: 将矩阵分为多个环,每个环分为4段,每段上的数字交替替换
```java
class Solution {
    public void rotate(int[][] mat) {
        int n = mat.length, k = 0;
        while (k < n >> 1) {
            for (int i = 0; i < n - k - k - 1; i++) {
                int temp = mat[k][k + i];
                mat[k][k + i] = mat[n - k - 1 - i][k];
                mat[n - k - i - 1][k] = mat[n - k - 1][n - k - i - 1];
                mat[n - k - 1][n - k - i - 1] = mat[k + i][n - k - 1];
                mat[k + i][n - k - 1] = temp;
            }   
            k++;
        }
    }
}
```
解法二:对矩阵做如下两个操作: 1.从对角线翻转 2.翻转每一行 (左右翻转)
1  2  3             
4  5  6
7  8  9

1  4  7
2  5  8
3  6  9

7  4  1
8  5  2
9  6  3

解法三: 对矩阵做如下两个操作: 1.逆序交换所有行(上下翻转) 2.从对角线翻转
1  2  3             
4  5  6
7  8  9

7  8  9
4  5  6
1  2  3

7  4  1
8  5  2
9  6  3
```java
class Solution {
public void rotate(int[][] matrix) {
    int s = 0, e = matrix.length - 1;
    while(s < e){
        int[] temp = matrix[s];
        matrix[s] = matrix[e];
        matrix[e] = temp;
        s++; e--;
    }

    for(int i = 0; i < matrix.length; i++){
        for(int j = i+1; j < matrix[i].length; j++){
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
}
}
```

## 2个有序数组，找2个数组合并的第K大数字，O(1)空间

## 60. Permutation Sequence
求集合`[1,2,3,...,n]`的第k个排列
解法一: 递归求解,对于位置i,计算剩余`n-i`个数字的排列数量`base=(n-1)!`,
取商为当前位置应该放置的数的排位,取模为剩余的排列序号
```java
class Solution {
    public String getPermutation(int n, int k) {
        char[] ans = new char[n];
        boolean used[] = new boolean[n];
        find(ans, 0, used, k - 1); // 注意k应为0下标开始
        return String.valueOf(ans);
    }

    private int calc(int n) {
        if (n <= 0) {
            return 1;
        }
        return n * calc(n - 1);
    }

    private void find(char[] ans, int curSize, boolean[] used, int k) {
        if (curSize == ans.length) {
            return;
        }
        int base = calc(ans.length - curSize - 1);
        int curIdx = k / base;
        for (int i = 0; i < used.length; i++) {
            if (!used[i]) {
                if (curIdx-- == 0) {
                    used[i] = true;
                    ans[curSize] = (char)('0' + i + 1);
                    find(ans, curSize + 1, used, k % base);
                }
            }
        }
    }
}
```

解法二: 使用循环优化上述递归解法, 使用StringBuilder代替char[], 
使用LinkedList代替boolean[], 阶乘应只计算一次,后续使用除法得到.


## 69. Sqrt(x)
二分求int的开平方
```java
class Solution {
    public int mySqrt(int x) {
        int left = 0, right = x;
        while (left <= right) {
            int mid = left + ((right - left) >> 1);
            long multi = (long) mid * mid;

            if (multi > x || multi < 0) {
                right = mid - 1;
            } else if (multi < x){
                left = mid + 1;
            } else {
                return mid;
            }
        }
        return left - 1;
    }
}
```

## 74. Search a 2D Matrix
给出一个每行依次递增的矩阵,从中搜索元素
O(log(n * m)), 当成有序数组处理,二分搜索
```java
class Solution {
    public boolean searchMatrix(int[][] mat, int target) {
        if (mat.length == 0) {
            return false;
        }
        int n = mat.length, m = mat[0].length;
        int left = 0, right = n * m - 1;
        while (left <= right) {
            int mid = left + ((right - left) >> 1);
            int x = mid / m, y = mid % m;
            if (mat[x][y] > target) {
                right = mid - 1;
            } else if (mat[x][y] < target) {
                left = mid + 1;
            } else {
                return true;
            }
        }
        return false;
    }
}
```

## 240. Search a 2D Matrix II
给出一个行列分别递增的矩阵,从中搜索元素
O(n+m), 从右上开始搜索,每次排除一行或者一列
```java
class Solution {
    public boolean searchMatrix(int[][] mat, int target) {
        if (mat.length == 0) {
            return false;
        }
        int x = 0, y = mat[0].length - 1;
        while (x < mat.length && y >= 0) {
            if (mat[x][y] > target) {
                y--;
            } else if (mat[x][y] < target) {
                x++;
            } else {
                return true;
            }
        }
        return false;
    }
}
```


## 81. Search in Rotated Sorted Array II
todo


## 128. Longest Consecutive Sequence
题意: 给出一个无序数组, 找到其中最长的连续数字, 如`[100, 4, 200, 1, 3, 2]`, ans = 4;
解法一: 使用HashMap记录数字i上的最长连续数字, 时间O(n), 空间O(n)
```java
class Solution {
    public int longestConsecutive(int[] nums) {
        int ans = 0;
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            if (map.containsKey(num)) {
                continue;
            }
            int preLen = map.getOrDefault(num - 1, 0);
            int nextLen = map.getOrDefault(num + 1, 0);
            int sum = preLen + nextLen + 1;
            ans = Math.max(ans, sum);

            // prevent re-calculate
            map.put(num, sum);
            if (preLen > 0) {
                map.put(num - preLen, sum);
            }
            if (nextLen > 0) {
                map.put(num + nextLen, sum);
            }

        }
        return ans;
    }
}
```

解法二: 使用HashSet记录所有数字, 如果`num - 1`不存在, 则向右找到所有连续数字, 时间O(n)
```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }
        int ans = 0;
        for (int num : nums) {
            if (!set.contains(num - 1)) {
                int cnt = 1, next = num + 1;
                while (set.contains(next++)) {
                    cnt++;
                }
                ans = Math.max(ans, cnt);
            }
        }
        return ans;
    }
}
```
