import java.util.concurrent.CyclicBarrier;

class MockRunnable implements Runnable {
    private final int num;

    public MockRunnable(int num) {
        this.num = num;
    }

    @Override
    public void run() {
        System.out.println(String.format("Thread %d is running", num));
        try {
            CyclicBarrierTest.cb.await();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(String.format("Thread %d is finish", num));
    }
}

public class CyclicBarrierTest {
    static CyclicBarrier cb = new CyclicBarrier(2, () -> {
        System.out.println("Barrier Action");

    });

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 4; i++) {
            new Thread(new MockRunnable(i + 1)).start();
        }
    }
}