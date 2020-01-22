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
        int[][] mat = {
                {1, 5, 9},
                {10, 11, 13},
                {12, 13, 15}};
        int[][] mat2 = {
                {1, 2},
                {1, 3},
        };
        System.out.println(main.kthSmallest(mat2, 2));
    }

    public int kthSmallest(int[][] mat, int k) {
        int n = mat.length, row = 0, col = n - 1;
        while (true) {
            int cntLt = 0, cntLe = 0, colLt = n - 1, colLe = n - 1;
            for (int i = 0; i < n; i++) {
                while (colLt >= 0 && mat[i][colLt] >= mat[row][col]) colLt--;
                while (colLe >= 0 && mat[i][colLe] > mat[row][col]) colLe--;
                cntLt += colLt + 1;
                cntLe += colLe + 1;
            }
            if (cntLe < k) {
                row++;
            } else if (cntLt >= k) {
                col--;
            } else {
                return mat[row][col];
            }
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
