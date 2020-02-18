import javax.xml.bind.SchemaOutputResolver;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
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
import java.util.PriorityQueue;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.ThreadLocalRandom;


class Main {

    public static void main(String[] args) {
        Main main = new Main();
        System.out.println(main.findMin("abcadedf"));
    }

    public int findFirst(int[] arr, int k) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {

            int mid = left + (right - left) / 2;

            if (arr[mid] < k) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
            System.out.println(left + " " + right + " " + mid + " " + arr[mid]);
        }
        return left;
    }

    public char findMin2(String str) {
        if (str == null || str.length() == 0) {
            return 0;
        }
        Map<Character, Integer> map = new HashMap<>();
        TreeSet<Integer> set = new TreeSet<>();
        for (int i = 0; i < str.length(); i++) {
            Integer idx = map.get(str.charAt(i));
            if (idx == null) {
                map.put(str.charAt(i), i);
                set.add(i);
            } else {
                set.remove(idx);
            }
        }
        return str.charAt(set.first());
    }

    public char findMin(String str) {
        if (str == null || str.length() == 0) {
            return 0;
        }
        int idx[] = new int[256];
        Arrays.fill(idx, -1);
        for (int i = 0; i < str.length(); i++) {
            if (idx[str.charAt(i)] == -1) {
                idx[str.charAt(i)] = i;
            } else {
                idx[str.charAt(i)] = -2;
            }
        }
        int min = Integer.MAX_VALUE;
        for (int i = 0; i < idx.length; i++) {
            if (idx[i] >= 0) {
                min = Math.min(min, idx[i]);
            }
        }
        return str.charAt(min);
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
