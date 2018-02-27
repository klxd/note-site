import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

public class ChannelTest {

    public static void main(String[] args) {

        ByteBuffer buffer = ByteBuffer.allocate(1024);
        try (ReadableByteChannel readableByteChannel = Channels.newChannel(System.in);
                WritableByteChannel writableByteChannel = Channels.newChannel(System.out)) {
            while (readableByteChannel.read(buffer) != -1) {
                buffer.flip();
                while (buffer.hasRemaining()) {
                    writableByteChannel.write(buffer);
                }
                buffer.clear();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}