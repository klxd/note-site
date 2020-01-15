---
title: BitSet
date: "2020-01-13T22:22:22.169Z"
path:  "/java-bit-set"
tags:
   - java
---


# BitSet
BitSet类实现了一个按需增长的位向量。位Set的每一个组件都有一个boolean值。用非负的整数将BitSet的位编入索引。可以对每个编入索引的位进行测试、设置或者清除。
通过逻辑与、逻辑或和逻辑异或操作，可以使用一个 BitSet修改另一个 BitSet的内容。

_使用场景_:
由于java中`boolean[]`底层使用`byte[]`实现, 即每个boolean值占用一个byte(8bit), 存在空间浪费, 当需要大的bool数组时可使用BitSet代替,
但是BitSet读写时需要计算偏移量(可能还有扩容操作), 时间效率比boolean数组略低.

```java
public class BitSet implements Cloneable, java.io.Serializable {
    
    
    private final static int ADDRESS_BITS_PER_WORD = 6;
    // 2^6=64, long的位长
    private final static int BITS_PER_WORD = 1 << ADDRESS_BITS_PER_WORD;
    private final static int BIT_INDEX_MASK = BITS_PER_WORD - 1;
    
    // 底层使用long数组存储, 所以BitSet的大小为long类型大小(64位)的整数倍
    private long[] words;
    
    // 默认64位
    public BitSet() {
        initWords(BITS_PER_WORD);
        sizeIsSticky = false;
    }

    // 指定了bitset的初始化大小，那么会把他规整到一个大于或者等于这个数字的64的整倍数
    public BitSet(int nbits) {
        // nbits can't be negative; size 0 is OK
        if (nbits < 0)
            throw new NegativeArraySizeException("nbits < 0: " + nbits);

        initWords(nbits);
        sizeIsSticky = true;
    }
}
```

## size() & length()
* size: `words.length * BITS_PER_WORD`, 实际占用内存的大小, words的长度乘以64
* length: 最大一个置为1的位的index+1, 若BitSet为空则为0


## 自动扩容
```java
public class BitSet implements Cloneable, java.io.Serializable {

    private void ensureCapacity(int wordsRequired) {
        if (words.length < wordsRequired) {
            // Allocate larger of doubled size or required size
            int request = Math.max(2 * words.length, wordsRequired);
            words = Arrays.copyOf(words, request);
            sizeIsSticky = false;
        }
    }
}
```
