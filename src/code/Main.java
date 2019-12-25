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
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) {
        Main main = new Main();
        TreeSet<Integer> treeSet = new TreeSet<>(Arrays.asList(1, 5, 3));
        System.out.println(treeSet);

        TreeSet<Integer> treeSet1 = new TreeSet<>(Comparator.reverseOrder());
        treeSet1.addAll(treeSet);
        System.out.println(treeSet1);

        TreeSet<Integer> treeSet2 = (TreeSet<Integer>) treeSet.descendingSet();
        System.out.println(treeSet2);
    }

    class Node {
        public int val;
        public Node left;
        public Node right;
        public Node next;
    }

    public Node connect(Node root) {
        Node temp = root, tempChild = new Node();
        while (temp != null) {
            Node currentChild = tempChild;
            while (temp != null) {
                if (temp.left != null) {
                    currentChild.next = temp.left;
                    currentChild = currentChild.next;
                }
                if (temp.right != null) {
                    currentChild.next = temp.right;
                    currentChild = currentChild.next;
                }
                temp = temp.next;
            }
            temp = tempChild.next;
            tempChild.next = null;
        }
        return root;
    }
}
