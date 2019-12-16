import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        Main main = new Main();
        //int[][] mat = {{1, 1, 3, 2, 4, 3, 2}, {1, 1, 3, 2, 4, 3, 2}, {1, 1, 3, 2, 4, 3, 2}};
        int[][] mat = {{18,70},{61,1},{25,85},{14,40},{11,96},{97,96},{63,45}};


        System.out.println(main.maxSideLength(mat, 40184));
    }

    public int maxSideLength(int[][] mat, int threshold) {
        int n = mat.length, m = mat[0].length;
        int left = 1, right = Math.min(n, m);
        while (left <= right) {
            int mid = left + ((right - left) >> 1);
            System.out.println(left + " " + right + " " + mid);
            if (satisfy(mat, threshold, mid)) {
                System.out.println(mid + "true");
                left = mid + 1;
            } else {
                System.out.println(mid + "false");
                right = mid - 1;
            }
        }
        return left - 1;
    }

    private boolean satisfy(int[][] mat, int threshold, int len) {
        int n = mat.length, m = mat[0].length;
        int sum = 0, base = 0;
        for (int i = 0; i + len - 1< n; i++) {
            for (int j = 0; j + len - 1 < m; j++) {
                if (i == 0 && j == 0) {
                    for (int a = 0; a < len; a++) {
                        for (int b = 0; b < len; b++) {
                            base += mat[a][b];
                        }
                    }
                    sum = base;
                } else if (j == 0) {
                    for (int b = 0; b < len; b++) {
                        base -= mat[i - 1][b];
                        base += mat[i + len - 1][b];
                    }
                    sum = base;
                } else {
                    for (int a = 0; a < len; a++) {
                        sum -= mat[i + a][j - 1];
                        sum += mat[i + a][j + len - 1];
                    }
                }
                if (sum <= threshold) {
                    return true;
                }
            }
        }
        return false;
    }

}
