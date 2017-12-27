import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class CountDownLatchTest {

    private static CountDownLatch c = new CountDownLatch(2);

    public static void main(String[] args) throws InterruptedException {
        System.out.println("start");

        new Thread(() -> {
            System.out.println(String.format("count is %d", c.getCount()));
            c.countDown();
            System.out.println(String.format("count is %d", c.getCount()));
            c.countDown();

        }
        ).start();
        System.out.println("waiting");
        // c.await(5, TimeUnit.SECONDS);
        c.await();
        System.out.println("end");

    }
}