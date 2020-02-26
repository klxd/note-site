---
title: Java Integer源码
date: "2019-12-06T22:22:22.169Z"
path:  "/java-integer"
tags:
   - java
---

## Integer.parseInt源码解析

```java
public class Integer {
    public static int parseInt(String s, int radix)
                throws NumberFormatException {
        /*
         * WARNING: This method may be invoked early during VM initialization
         * before IntegerCache is initialized. Care must be taken to not use
         * the valueOf method.
         */

        if (s == null) {
            throw new NumberFormatException("null");
        }

        // - 最小进制2
        if (radix < Character.MIN_RADIX) {
            throw new NumberFormatException("radix " + radix +
                                            " less than Character.MIN_RADIX");
        }

        // - 最大进制36 (10个数字 + 26个字母)
        if (radix > Character.MAX_RADIX) {
            throw new NumberFormatException("radix " + radix +
                                            " greater than Character.MAX_RADIX");
        }

        int result = 0; // 最终结果, 计算过程中一直为`非正数`
        boolean negative = false; // 是否是负数
        int i = 0, len = s.length();
        int limit = -Integer.MAX_VALUE; // 正数的上界 (因为result计算过程中均为负数, 所以上界用负数表示)
        int multmin; // 做乘法前, result防止溢出的最小值
        int digit;

        if (len > 0) {
            // 处理符号位
            char firstChar = s.charAt(0);
            if (firstChar < '0') { // Possible leading "+" or "-"
                if (firstChar == '-') {
                    negative = true;
                    limit = Integer.MIN_VALUE; // 负数上界
                } else if (firstChar != '+')
                    throw NumberFormatException.forInputString(s);

                if (len == 1) // Cannot have lone "+" or "-"
                    throw NumberFormatException.forInputString(s);
                i++;
            }
            multmin = limit / radix; // 使用(上界/进制)计算此值, 表示当result小于此值, 再做乘法就会溢出
            while (i < len) {
                // Accumulating negatively avoids surprises near MAX_VALUE
                // -- 用负数来累计, 避免最大值附近的溢出, 因为负数上界的绝对值比正数上界大1
                digit = Character.digit(s.charAt(i++),radix);
                // digit小于0, 表示当前字符无法转为对应进制的数
                if (digit < 0) {
                    throw NumberFormatException.forInputString(s);
                }
                // 检查result是否小于multmin, 防止下一步作乘法时溢出
                if (result < multmin) {
                    throw NumberFormatException.forInputString(s);
                }
                result *= radix;
                // 防止下一步做减法时溢出
                if (result < limit + digit) {
                    throw NumberFormatException.forInputString(s);
                }
                result -= digit;
            }
        } else {
            throw NumberFormatException.forInputString(s);
        }
        // 负数 = result, 正数 = -result, 已经由前面limit保证不会溢出
        return negative ? result : -result;
    }
}
```

* 计算过程不用long类型来避免溢出,(计算Integer用了long, 计算Long用啥-_-), Long.parseLong逻辑与上面基本一致
* 上界为变量limit, 根据是正数或负数来变化
* 累积过程采用负数来保存result, 因为负数上界绝对值比正数上界大1, 可以防止转化Integer.MIN_VALUE时的溢出

## 牛客-把字符串转换成整数
```java
public class Solution {
    public int StrToInt(String str) {
        if (str == null || str.length() == 0) {
            return 0;
        }
        int idx = 0, ans = 0;
        boolean isNa = false;
        if (str.charAt(0) == '+' || str.charAt(0) == '-') {
            if (str.length() == 1) {
                return 0;
            }
            idx = 1;
            isNa = str.charAt(0) == '-';
        }
        int preMin = -(Integer.MAX_VALUE / 10);
        while (idx < str.length()) {
            int num = str.charAt(idx++) - '0';
            if (num < 0 || num > 9) {
                return 0;
            }
            if (ans < preMin) {
                return 0;
            }
            ans *= 10;
            if (ans < Integer.MIN_VALUE + num) {
                return 0;
            }
            ans -= num;
        }
        if (!isNa && ans == Integer.MIN_VALUE) {
            return 0;
        }
        return isNa ? ans : -ans;
    }
}
```

练习题
- leetcode-7 [https://leetcode.com/problems/reverse-integer/]
- leetcode-8 [https://leetcode.com/problems/string-to-integer-atoi/]