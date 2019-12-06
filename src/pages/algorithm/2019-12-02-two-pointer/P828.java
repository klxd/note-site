import java.util.Arrays;

public class P828 {

    public static int uniqueLetterString(String S) {
        int idx[][] = new int[26][2];
        int mod = (int)Math.pow(10, 9) + 7, ans = 0;
        for (int i = 0; i < 26; i++) {
            Arrays.fill(idx[i], -1);
        }
        for (int i = 0; i < S.length(); i++) {
            int c = S.charAt(i) - 'A';
            ans = (ans + (idx[c][1] - idx[c][0]) * (i - idx[c][1]) % mod) % mod;
            idx[c] = new int[]{idx[c][1], i};
        }
        for (int i = 0; i < 26; i++) {
            ans = (ans + ((idx[i][1] - idx[i][0]) * (S.length() - idx[i][1]) % mod)) % mod;
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(uniqueLetterString("ABA"));
    }

}