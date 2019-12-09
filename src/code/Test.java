import java.util.*;

public class Test {

    public static void main(String[] args) throws InterruptedException {

        FooBar fooBar = new FooBar(10);

        new Thread(() -> {
            try {
                fooBar.foo(() -> System.out.println("foo"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        System.out.println("111");


        new Thread(() -> {
            try {
                fooBar.bar(() -> System.out.println("bar"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        System.out.println("2222");

    }

    static class FooBar {
        private int n;
        private Object obj = new Object();
        private transient boolean flag = true;
        public FooBar(int n) {
            this.n = n;
        }

        public void foo(Runnable printFoo) throws InterruptedException {

            for (int i = 0; i < n; i++) {
                synchronized (obj) {
                    while (!flag) {
                        obj.wait();
                    }
                    // printFoo.run() outputs "foo". Do not change or remove this line.
                    printFoo.run();
                    flag = !flag;
                    obj.notifyAll();
                }


            }
        }

        public void bar(Runnable printBar) throws InterruptedException {

            for (int i = 0; i < n; i++) {
                synchronized (obj) {
                    while (flag) {
                        obj.wait();
                    }
                    // printBar.run() outputs "bar". Do not change or remove this line.
                    printBar.run();
                    flag = !flag;
                    obj.notifyAll();
                }
            }
        }
    }
}