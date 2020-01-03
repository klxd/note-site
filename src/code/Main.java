import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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
        Scanner scan = new Scanner(System.in);
        int n = scan.nextInt();
        int[][] arr = new int[n][2];
        for (int i = 0; i < n; i++) {
            System.out.println(i);
            arr[i][0] = scan.nextInt();
            arr[i][1] = scan.nextInt();
        }
        System.out.println("here");
        scan.close();

        Arrays.sort(arr, (a, b) -> b[0] - a[0]);
        int curMaxY = Integer.MIN_VALUE;
        List<int[]> ans = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (curMaxY < arr[i][1]) {
                curMaxY = arr[i][1];
                ans.add(arr[i]);
            }
        }
        for (int i = ans.size() - 1; i >= 0; i--) {
            System.out.println(ans.get(i)[0] + " " + ans.get(i)[1]);
        }

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
