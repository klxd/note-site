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
        System.out.println(main.largestRectangleArea(new int[] {10,  1, 2, 3}));
    }

    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int ans = 0;
        for (int i = 0; i <= heights.length; i++) {
            int curH = i == heights.length ? 0 : heights[i];
            int lastIdx = stack.isEmpty() ? -1 : stack.peekLast();
            if (!stack.isEmpty() && stack.peekLast() > curH) {
                int tempIdx = stack.pop();
                ans = Math.max(ans, heights[tempIdx] * (lastIdx - tempIdx + 1));
            }
            stack.push(i);
        }
        return ans;
    }

}
