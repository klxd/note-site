import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

public class SemaphoreTest {
    static class MockRunnable implements Runnable {
        private final int id;
        MockRunnable(int id) {
            this.id = id;
        }
        @Override
        public void run() {
            try {
                semaphore.acquire();
                System.out.println(String.format("Thread %d is working", id));
                Thread.sleep(1000);
                semaphore.release();
                System.out.println(String.format("Thread %d is finished", id));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private static final Semaphore semaphore = new Semaphore(3);

    public static void main(String[] args) throws InterruptedException {
        final int THREAD_COUNT = 10;
        ExecutorService threadPool = Executors.newFixedThreadPool(THREAD_COUNT);
        for (int i = 0; i < THREAD_COUNT; i++) {
            threadPool.execute(new MockRunnable(i + 1));
        }
        threadPool.shutdown();
    }
}