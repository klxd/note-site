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
        System.out.println(main.InversePairs(new int[] {364,637,341,406,747,995,234,971,571,219,993,407,416,366,315,301,601,650,418,355,460,505,360,965,516,648,727,667,465,849,455,181,486,149,588,233,144,174,557,67,746,550,474,162,268,142,463,221,882,576,604,739,288,569,256,936,275,401,497,82,935,983,583,523,697,478,147,795,380,973,958,115,773,870,259,655,446,863,735,784,3,671,433,630,425,930,64,266,235,187,284,665,874,80,45,848,38,811,267,575}));
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
