import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.ThreadLocalRandom;

class Main {
    public static void main(String[] args) {
        Main main = new Main();
        System.out.println(main.singleNumber(new int[]{2, 2, 2, 3, 3, 3, -1, -1, -1}));
    }

    public int singleNumber(int[] nums) {
        int one = 0, two = 0, mask;
        for (int num : nums) {
            two ^= one & num;
            one ^= num;
            mask = ~(one & two);
            one &= mask;
            two &= mask;
        }
        return one;
    }

}
