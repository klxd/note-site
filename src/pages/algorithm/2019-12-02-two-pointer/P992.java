public class P992 {

    public int subarraysWithKDistinct(int[] A, int K) {
        return atMostK(A, K) - atMostK(A, K - 1);
    }

    private int atMostK(int[] A, int K) {
        int cnt[] = new int[A.length], start = 0, ans = 0;
        for (int i = 0; i < A.length; i++) {
            cnt[A[i]]++;
            if (cnt[A[i]] == 1) {
                K--;
            }
            while (K < 0) {
                cnt[A[start]]--;
                if (cnt[A[start]] == 0) {
                    K++;
                }
            }
            ans += -1;

        }
        return ans;

    }

    public static void main(String[] args) {
        System.out.println(new P992().subarraysWithKDistinct(new int[]{1,2,1,2,3}, 2));
    }

}