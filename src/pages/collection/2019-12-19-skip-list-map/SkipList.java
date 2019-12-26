import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Random;

public class SkipList {

    static class Node {
        public int val;
        public Main.Node right;
        public Main.Node down;

        Node() {
        }

        Node(int v, Main.Node r, Main.Node d) {
            this.val = v;
            this.right = r;
            this.down = d;
        }
    }


    private Main.Node head = new Main.Node();

    private Random random = new Random();

    private int randLevel() {
        int rnd = random.nextInt();
        int level = 1;
        while ((((rnd) >>>= 1) & 1) != 0) {
            level++;
        }
        return level;
    }

    public boolean search(int target) {
        Main.Node temp = head;
        while (temp != null) {
            while (temp.right != null && temp.right.val < target) {
                temp = temp.right;
            }
            if (temp.right == null || temp.right.val > target) {
                temp = temp.down;
            } else {
                return true;
            }
        }
        return false;
    }

    public void add(int num) {
        Main.Node temp = head;
        Deque<Main.Node> insertPoints = new ArrayDeque<>();
        while (temp != null) {
            while (temp.right != null && temp.right.val < num) {
                temp = temp.right;
            }
            insertPoints.add(temp);
            temp = temp.down;
        }
        Main.Node downNode = null;
        int level = randLevel();
        while (level-- > 0 && !insertPoints.isEmpty()) {
            Main.Node insert = insertPoints.pollLast();
            insert.right = new Main.Node(num, insert.right, downNode);
            downNode = insert.right;
        }
        if (level > 0) {
            head = new Main.Node(0, new Main.Node(num, null, downNode), head);
        }
    }

    public boolean erase(int num) {
        Main.Node temp = head;
        boolean found = false;
        while (temp != null) {
            while (temp.right != null && temp.right.val < num) {
                temp = temp.right;
            }
            if (temp.right == null || temp.right.val > num) {
                temp = temp.down;
            } else {
                found = true;
                temp.right = temp.right.right;
                temp = temp.down;
            }
        }
        return found;
    }

    private void print() {
        Main.Node temp = head;
        while (temp != null) {
            Main.Node first = temp;
            while (first != null) {
                System.out.print(first.val + " ");
                first = first.right;
            }
            System.out.println();
            temp = temp.down;
        }
    }
}