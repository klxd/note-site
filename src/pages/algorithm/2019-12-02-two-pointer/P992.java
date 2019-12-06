public class P992 {

    public int subarraysWithKDistinct(int[] A, int K) {
        return atMostK(A, K) - atMostK(A, K - 1);
    }

    private int atMostK(int[] A, int K) {
        int cnt[] = new int[A.length];
        int start = 0, distinct = 0, ans = 0;
        for (int end = 0; end < A.length; end++) {
            if (cnt[A[end]] == 0) {
                distinct++;
            }
            cnt[A[end]]++;
            while (distinct > K) {
                cnt[A[start]]--;
                if (cnt[A[start++]] == 0) {
                    distinct--;
                }
            }
            // count of sub-arrays which ends at 'end'
            ans += end - start + 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(new P992().subarraysWithKDistinct(new int[]{1, 2, 1, 2, 3}, 1));
    }

}