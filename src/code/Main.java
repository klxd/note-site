import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        Main main = new Main();
        System.out.println(main.largestRectangleArea(new int[]{2, 1, 5, 4, 2, 3, 1, 1, 1, 1, 1}));
    }

    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int ans = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = i == heights.length ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peekLast()] > h) {
                int curHeight = heights[stack.pollLast()];
                int curWidth = stack.isEmpty() ? i : (i - stack.peekLast() - 1);
                ans = Math.max(ans, curWidth * curHeight);
            }
            stack.offerLast(i);
        }
        return ans;
    }

}
