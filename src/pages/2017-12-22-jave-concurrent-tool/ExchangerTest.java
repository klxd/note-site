import java.util.concurrent.Exchanger;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class ExchangerTest {
    private static final Exchanger<String> exchanger = new Exchanger<>();

    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            try {
                String before = "1111";
                System.out.println("Thread 1 before change: " + before);
                String after = exchanger.exchange(before, 2, TimeUnit.SECONDS);
                System.out.println("Thread 1 after change: " + after);
            } catch (InterruptedException | TimeoutException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                String before = "2222";
                System.out.println("Thread 2 before change: " + before);
                Thread.sleep(1000);
                System.out.println("Waiting for 1 second");
                String after = exchanger.exchange(before);
                System.out.println("Thread 2 after change: " + after);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}