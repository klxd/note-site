import java.util.concurrent.Semaphore;

public class SemaphoreTest {

    private static final Semaphore semaphore = new Semaphore(10, true);

    public static void main(String[] args) throws InterruptedException {
        System.out.println(semaphore.availablePermits());
        for (int i = 0; i < 3; i++) {
            semaphore.acquire();
        }
        System.out.println(semaphore.availablePermits());

        System.out.println(semaphore.drainPermits());

        semaphore.release(11);
        System.out.println(semaphore.availablePermits());

        System.out.println("End");
    }

}