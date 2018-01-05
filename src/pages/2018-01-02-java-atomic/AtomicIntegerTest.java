import java.util.concurrent.atomic.AtomicInteger;

public class AtomicIntegerTest {
    private static Integer a = 0;
    private static AtomicInteger atomicInteger = new AtomicInteger(0);
    public static void main(String[] args) {
        System.out.println("begin");
        new Thread(() -> {
            for (int i = 0; i < 100; i++) {

                try {
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                a++;
                atomicInteger.addAndGet(1);
            }
            System.out.println("1: a " + a);
            System.out.println("1: atomicInteger " + atomicInteger.get());
        }).start();

        new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                a++;
                atomicInteger.getAndAccumulate(2, (a, b) -> a + b);
            }
            System.out.println("2: a " + a);
            System.out.println("2: atomicInteger " + atomicInteger.get());
        }).start();

        new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                a++;
                atomicInteger.getAndUpdate((a) -> a + 1);
            }
            System.out.println("3: a " + a);
            System.out.println("3: atomicInteger " + atomicInteger.get());

        }).start();


        float f  = 1.1f;
        int i = Float.floatToIntBits(f);
        System.out.println(i);
        System.out.println(Float.intBitsToFloat(i));
    }
}