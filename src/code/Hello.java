import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class Hello {
    public static void main(String[] args) {
        System.out.println("hello");
        Thread thread1 = new Thread(() -> {
            int count = 10;
            while (count-- > 0) {
                System.out.println("t1-" + count);
                Thread.yield();
            }
        });

        Thread thread2 = new Thread(() -> {
            int count = 10;
            while (count-- > 0) {
                System.out.println("t2-" + count);
                Thread.yield();
            }
        });

        thread1.setDaemon(true);

        thread1.start();
        thread2.start();
        thread2.setDaemon(true);
        System.out.println("start run 1");
        try {
            thread2.join();
            System.out.println("finish join 2");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}