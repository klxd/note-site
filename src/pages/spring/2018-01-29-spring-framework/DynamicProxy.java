import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class DynamicProxy implements InvocationHandler {

    private Object target;

    public DynamicProxy(Object object) {
        this.target = object;
    }

    private void before() {
        System.out.println("before");
    }

    private void after() {
        System.out.println("after");
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object res = null;
        before();
        try {
            res = method.invoke(target, args);
        } catch (Throwable e) {
            throw e.getCause();
        }
        after();
        return res;
    }
    public static void main(String[] args) {
        try {
            SayHello sayHello = new SayHello();
            DynamicProxy dynamicProxy = new DynamicProxy(sayHello);
            HelloInterface helloInterface = (HelloInterface) Proxy.newProxyInstance(
                    Thread.currentThread().getContextClassLoader(), sayHello.getClass().getInterfaces(), dynamicProxy);
            helloInterface.sayHello();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public interface HelloInterface {
        void sayHello();
    }

    public static class SayHello implements HelloInterface {
        @Override
        public void sayHello() {
            System.out.println("hello");
        }
    }
}