import java.util.Arrays;

public class EnumTest {

    enum Order {
        FIRST,
        SECOND
    }


    public static int ordinal(Enum<? extends Enum> enumInstance) {
        return enumInstance.ordinal();
    }


    public static <T extends Enum<T>> T[] values(Class<T> clazz) {
        return clazz.getEnumConstants();
    }

    public static void main(String[] arg) {
        System.out.println(Order.FIRST.ordinal());
        System.out.println(ordinal(Order.FIRST));

        System.out.println(Order.FIRST.getClass());
        System.out.println(Order.FIRST.getDeclaringClass());

        System.out.println(Arrays.toString(values(Order.class)));

    }

}
