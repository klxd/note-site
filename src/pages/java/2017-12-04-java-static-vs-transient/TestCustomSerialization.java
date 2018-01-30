import java.io.*;

class CustomObject implements Serializable {

    public static String staticField = "defaultStaticValue";
    public transient String transientField = "defaultTransientValue";
    public static transient String staticTransientField = "defaultStaticTransientValue";


    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        out.writeObject(staticField);
        out.writeObject(transientField);
        out.writeObject(staticTransientField);
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        staticField = (String) in.readObject();
        transientField = (String) in.readObject();
        staticTransientField = (String) in.readObject();
    }
}


public class TestCustomSerialization {

    private static void serialization() {
        System.out.println("Serialization start...");
        CustomObject customObject = new CustomObject();
        customObject.staticField = "staticFieldValue";
        customObject.transientField = "transientFieldValue";
        customObject.staticTransientField = "staticTransientFieldValue";
        try (
                FileOutputStream fileOutputStream = new FileOutputStream("./customObject.dat");
                ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        ) {
            objectOutputStream.writeObject(customObject);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Serialization finished");
        showEmployee(customObject);
    }

    private static void deserialization() {
        System.out.println("Deserialization start...");
        CustomObject customObject = null;
        try (
                FileInputStream fileInputStream = new FileInputStream("./customObject.dat");
                ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
        ) {
            customObject = (CustomObject) objectInputStream.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        System.out.println("Deserialization finished");
        showEmployee(customObject);
    }

    private static void showEmployee(CustomObject customObject) {
        System.out.println("CustomObject:");
        System.out.println("CustomObject.staticField = " + customObject.staticField);
        System.out.println("CustomObject.transientField = " + customObject.transientField);
        System.out.println("CustomObject.staticTransientField = " + customObject.staticTransientField);
    }


    public static void main(String[] args) {
        // serialization();
        deserialization();
    }
}