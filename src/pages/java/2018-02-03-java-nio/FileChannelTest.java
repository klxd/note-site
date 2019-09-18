import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class FileChannelTest {

    public static void main(String[] args) throws IOException {
        testMappedByteBuffer();
    }

    public static void testFileChannel() throws IOException {

        FileChannel channel = new RandomAccessFile("test.txt", "rw").getChannel();
        channel.position(channel.size());  // 移动文件指针到末尾（追加写入）

        ByteBuffer byteBuffer = ByteBuffer.allocate(20);

        // 数据写入Buffer
        byteBuffer.put("Test!345234243453\n".getBytes(StandardCharsets.UTF_8));

        // Buffer -> Channel
        byteBuffer.flip();
        while (byteBuffer.hasRemaining()) {
            channel.write(byteBuffer);
        }

        channel.position(0); // 移动文件指针到开头（从头读取）
        CharBuffer charBuffer = CharBuffer.allocate(10);
        CharsetDecoder decoder = StandardCharsets.UTF_8.newDecoder();

        // 读出所有数据
        byteBuffer.clear();
        while (channel.read(byteBuffer) != -1 || byteBuffer.position() > 0) {
            byteBuffer.flip();

            // 使用UTF-8解码器解码
            charBuffer.clear();
            decoder.decode(byteBuffer, charBuffer, false);
            System.out.print(charBuffer.flip().toString());

            byteBuffer.compact(); // 数据可能有剩余
        }

        channel.close();
    }

    public static void testMappedByteBuffer() throws IOException {
        FileChannel fileChannel = FileChannel.open(Paths.get("test.txt"), StandardOpenOption.WRITE, StandardOpenOption.READ);
        System.out.println(fileChannel.size());

        MappedByteBuffer mappedByteBuffer = fileChannel.map(
                FileChannel.MapMode.READ_WRITE, 0, fileChannel.size());
        System.out.println(mappedByteBuffer);
        System.out.println(mappedByteBuffer.isDirect());
        mappedByteBuffer.putChar('G');
        mappedByteBuffer.putChar('T');
        mappedByteBuffer.force();

        System.out.println("here");

    }
}