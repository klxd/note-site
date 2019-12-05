public class P1248 {

    public int numberOfSubarrays(int[] nums, int k) {
        int ans = 0, start = 0, end = 0, cnt = 0;
        while (cnt < k && end < nums.length) {
            if (nums[end++] % 2 == 1) {
                cnt++;
            }
        }
        if (cnt < k) {
            return 0;
        }
        end--;
        while (end < nums.length) {
            int preStart = start;
            while (nums[start] % 2 == 0 && start < end) {
                start++;
            }
            int preEnd = end++;
            while (end < nums.length && nums[end] % 2 == 0) {
                end++;
            }
            ans += (start - preStart + 1) * (end - preEnd);
            start++;
        }
        return ans;
    }

    private void print(int[] nums, int start, int end) {
        for (int i = start; i <= end; i++) {
            System.out.print(nums[i] + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        System.out.println(new P1248().numberOfSubarrays(
                new int[]{45627, 50891, 94884, 11286, 35337, 46414, 62029, 20247, 72789, 89158, 54203, 79628, 25920, 16832, 47469, 80909},
                1));
    }
}