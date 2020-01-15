import java.util.BitSet;

public class BitSetTest {
    public static void main(String[] args) {
        BitSet bitSet = new BitSet(64);
        System.out.println(bitSet.get(1000));
        System.out.println(bitSet.size());
        System.out.println(bitSet.length());
    }
}