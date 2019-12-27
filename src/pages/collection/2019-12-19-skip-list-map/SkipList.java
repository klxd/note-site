import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Random;

public class SkipList {

    static class Node {
        public int val;
        public Node right;
        public Node down;

        Node() {
        }

        Node(int v, Node r, Node d) {
            this.val = v;
            this.right = r;
            this.down = d;
        }
    }


    private Node head = new Node();

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
        Node temp = head;
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
        Node temp = head;
        Deque<Node> insertPoints = new ArrayDeque<>();
        while (temp != null) {
            while (temp.right != null && temp.right.val < num) {
                temp = temp.right;
            }
            insertPoints.add(temp);
            temp = temp.down;
        }
        Node downNode = null;
        int level = randLevel();
        while (level-- > 0 && !insertPoints.isEmpty()) {
            Node insert = insertPoints.pollLast();
            insert.right = new Node(num, insert.right, downNode);
            downNode = insert.right;
        }
        if (level > 0) {
            head = new Node(0, new Node(num, null, downNode), head);
        }
    }

    public boolean erase(int num) {
        Node temp = head;
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
        Node temp = head;
        while (temp != null) {
            Node first = temp;
            while (first != null) {
                System.out.print(first.val + " ");
                first = first.right;
            }
            System.out.println();
            temp = temp.down;
        }
    }
}