import java.io.*;

class SuperEmployee implements Serializable {
    public String superField;
    public static String superStaticField;
}

class Employee extends SuperEmployee {
    public String simpleField;
    public static String staticField = "defaultStatic01";
    public transient String transientField = "defaultTransientField01";
    public static transient String staticTransientField;
}

public class TestSerialization {

    private static void serialization() {
        System.out.println("Serialization start...");
        Employee employee = new Employee();
        employee.superField = "superFieldValue";
        employee.superStaticField = "superStaticFieldValue";
        employee.simpleField = "simpleFieldValue";
        // employee.staticField = "staticFieldValue";
        employee.transientField = "transientFieldValue";
        employee.staticTransientField = "staticTransientFieldValue";
        try (
                FileOutputStream fileOutputStream = new FileOutputStream("./employee.dat");
                ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        ) {
            objectOutputStream.writeObject(employee);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Serialization finished");
        showEmployee(employee);
    }

    private static void deserialization() {
        System.out.println("Deserialization start...");
        Employee employee = null;
        try (
                FileInputStream fileInputStream = new FileInputStream("./employee.dat");
                ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
        ) {
            employee = (Employee) objectInputStream.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        System.out.println("Deserialization finished");
        showEmployee(employee);
    }

    private static void showEmployee(Employee employee) {
        System.out.println("Employee:");
        System.out.println("employee.superField = " + employee.superField);
        System.out.println("employee.superStaticField = " + employee.superStaticField);
        System.out.println("employee.simpleField = " + employee.simpleField);
        System.out.println("employee.staticField = " + employee.staticField);
        System.out.println("employee.staticTransientField = " + employee.staticTransientField);
    }


    public static void main(String[] args) {
        //serialization();
        deserialization();
    }
}