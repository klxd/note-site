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
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.ThreadLocalRandom;

class Main {
    public static void main(String[] args) {
        Main main = new Main();
        Skiplist skiplist = new Skiplist();
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int i = 0; i < 200000; i++) {
            int level = skiplist.randLevel();
            cnt.put(level, cnt.getOrDefault(level, 0) + 1);
        }
        //["Skiplist","add","search","search","erase","erase","search"]
        //[[],[1],[0],[1],[0],[1],[1]]
        skiplist.add(1);
        System.out.println(skiplist.erase(0));
        System.out.println(skiplist.erase(1));
        System.out.println(skiplist.search(1));
    }

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

    static class Skiplist {

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

        public Skiplist() {
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


}
