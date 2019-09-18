import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class NioTestClient {

    /**
     * 要严谨一点测试的话，应该并发运行大量Client，统计服务端的响应时间，
     * 而且连接建立后不要立刻发送数据，这样才能发挥出服务端非阻塞I/O的优势。
     */
    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 9999);
        InputStream is = socket.getInputStream();
        OutputStream os = socket.getOutputStream();

        // 先向服务端发送数据
        os.write("Hello, Server!\0".getBytes());

        // 读取服务端发来的数据
        int b;
        while ((b = is.read()) != 0) {
            System.out.print((char) b);
        }
        System.out.println();

        socket.close();
    }
}