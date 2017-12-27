import java.util.concurrent.Exchanger;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class ExchangerTest {
    private static final Exchanger<String> exchanger = new Exchanger<>();

    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            try {
                String value = "1111";
                System.out.println("before 1");
                String after = exchanger.exchange(value, 1, TimeUnit.SECONDS);
                System.out.println("after1 " + after);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (TimeoutException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                String value = "2222";
                System.out.println("before 2");
                Thread.sleep(2000);
                String after = exchanger.exchange(value);
                System.out.println("after2 " + after);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        System.out.println("End");
    }

}