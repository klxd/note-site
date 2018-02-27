import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

public class SimpleClientSocket {
    public static void main(String[] args) {

        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("127.0.0.1", 1234));
            OutputStream os = socket.getOutputStream();
            os.write("hello".getBytes());
            os.write("world".getBytes());
            os.write("exit".getBytes());
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}