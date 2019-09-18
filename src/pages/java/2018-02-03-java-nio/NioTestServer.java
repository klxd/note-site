import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;

public class NioTestServer {
    /**
     * 这个例子使用Java NIO实现了一个单线程的服务端，功能很简单，监听客户端连接，当连接建立后，读取客户端的消息，并向客户端响应一条消息。
     * 需要注意的是字符 ‘0′（一个值为0的字节）标识消息结束。
     */
    public static void main(String[] args) throws IOException {
        // 创建一个selector
        Selector selector = Selector.open();

        // 初始化TCP连接监听通道
        ServerSocketChannel listenChannel = ServerSocketChannel.open();
        listenChannel.bind(new InetSocketAddress(9999));
        listenChannel.configureBlocking(false);
        // 注册到selector（监听其ACCEPT事件）
        listenChannel.register(selector, SelectionKey.OP_ACCEPT);

        // 创建一个缓冲区
        ByteBuffer buffer = ByteBuffer.allocate(100);

        while (true) {
            selector.select(); //阻塞，直到有监听的事件发生
            Iterator<SelectionKey> keyIter = selector.selectedKeys().iterator();

            // 通过迭代器依次访问select出来的Channel事件
            while (keyIter.hasNext()) {
                SelectionKey key = keyIter.next();

                if (key.isAcceptable()) { // 有连接可以接受
                    SocketChannel channel = ((ServerSocketChannel) key.channel()).accept();
                    channel.configureBlocking(false);
                    channel.register(selector, SelectionKey.OP_READ);

                    System.out.println("与【" + channel.getRemoteAddress() + "】建立了连接！");

                } else if (key.isReadable()) { // 有数据可以读取
                    buffer.clear();

                    // 读取到流末尾说明TCP连接已断开，
                    // 因此需要关闭通道或者取消监听READ事件
                    // 否则会无限循环
                    if (((SocketChannel) key.channel()).read(buffer) == -1) {
                        key.channel().close();
                        continue;
                    }

                    // 按字节遍历数据
                    buffer.flip();
                    while (buffer.hasRemaining()) {
                        byte b = buffer.get();

                        if (b == 0) { // 客户端消息末尾的\0
                            System.out.println();

                            // 响应客户端
                            buffer.clear();
                            buffer.put("Hello, Client!\0".getBytes());
                            buffer.flip();
                            while (buffer.hasRemaining()) {
                                ((SocketChannel) key.channel()).write(buffer);
                            }
                        } else {
                            System.out.print((char) b);
                        }
                    }
                }

                // 已经处理的事件一定要手动移除
                keyIter.remove();
            }
        }
    }
}