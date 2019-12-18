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
        int[][] mat = {{1, 2}, {3, 4}};

        for (int a[] : mat) {
            System.out.println(Arrays.toString(a));
        }
        System.out.println(main.totalNQueens(4));

    }

    /**
     * [".Q..",  // Solution 1
     *   "...Q",
     *   "Q...",
     *   "..Q."],
     *
     *  ["..Q.",  // Solution 2
     *   "Q...",
     *   "...Q",
     *   ".Q.."]
     * ]
     */
    public int totalNQueens(int n) {
        char[][] map = new char[n][n];
        for (int i = 0; i < map.length; i++) {
            Arrays.fill(map[i], '.');
        }
        boolean col[] = new boolean[n];
        solve(map, 0, col);
        return cnt;
    }

    private int cnt = 0;

    private void solve(char[][] map, int cur, boolean[] col) {
        if (cur == map.length) {
            cnt++;
            return;
        }
        for (int i = 0; i < map[cur].length; i++) {
            if (col[i]) {
                continue;
            }
            boolean canPut = true;
            for (int x = cur, y = i; canPut && x >= 0 && y >= 0; x--, y--) {
                if (map[x][y] == 'Q') {
                    canPut = false;
                }
            }
            for (int x = cur, y = i; canPut && x >= 0 && y < map.length; x--, y++) {
                if (map[x][y] == 'Q') {
                    canPut = false;
                }
            }
            if (canPut) {
                map[cur][i] = 'Q';
                col[i] = true;
                solve(map, cur + 1, col);
                col[i] = false;
                map[cur][i] = '.';
            }
        }
    }

    public List<Boolean> canMakePaliQueries(String s, int[][] queries) {

        return null;
    }


}
