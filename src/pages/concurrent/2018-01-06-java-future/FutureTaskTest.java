import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;

public class FutureTaskTest {


    public static void main(String[] args) {
        FutureTask<Double> futureTask = new FutureTask<>(() -> {
            return 10.0;
        });
        ExecutorService threadPool = Executors.newSingleThreadExecutor();
        threadPool.submit(futureTask);

        try {
            System.out.println(futureTask.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        threadPool.shutdown();
    }
}