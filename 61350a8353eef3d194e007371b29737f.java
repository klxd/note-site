class ConstClass {
    static {
        System.out.println("Const class init");
    }
    public static final int value = 123;
}

class VariableClass {
    static {
        System.out.println("Variable class init");
    }
    public static int value = 456;
}

public class InitialTest {
    static public void main(String[] args) {
        System.out.println(ConstClass.value);
        System.out.println(VariableClass.value);
    }
}
/* -- output --
123
Variable class init
456
 */