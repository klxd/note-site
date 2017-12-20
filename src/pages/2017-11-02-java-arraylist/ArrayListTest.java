import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ArrayListTest {
    public static void main(String[] args) {
        System.out.println("begin");
        List<String> list = Arrays.asList("sda", "sfsd", "a");
        Arrays.sort(list.toArray());
        list.sort(String::compareToIgnoreCase);
        System.out.println(list);
        list.subList()

      /*  List list2 = Stream.of("sfdf", "sdfsdf").collect(Collectors.toList());
        list2.add(1);
        System.out.println(list2);*/
    }
}