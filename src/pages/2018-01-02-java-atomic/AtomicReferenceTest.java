import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceTest {

    private static AtomicReference<User> userAtomicReference = new AtomicReference<>();

    static class User {
        private String name;
        private int id;
        public User(String name, int id) {
            this.name = name;
            this.id = id;
        }

        @Override
        public String toString() {
            return String.format("User[name: %s, id: %s]", name, id);
        }

        @Override
        public boolean equals(Object obj) {
            if (!(obj instanceof User)) {
                return false;
            }
            User o = (User) obj;
            return o.hashCode() == hashCode() && o.name.equals(name) && o.id == id;
        }

        @Override
        public int hashCode() {
            return name.hashCode() * 53 + id;
        }
    }

    public static void main(String[] args) {
        User user1 = new User("u1", 10);
        User user2 = new User("u2", 12);
        User user3 = new User("u1", 10);

        userAtomicReference.set(user1);

        System.out.println(userAtomicReference.get() == user1); // true
        System.out.println(userAtomicReference.get() == user3); // false
        System.out.println(userAtomicReference.get().equals(user3)); // true

        // 使用user3做CAS,更新失败
        userAtomicReference.compareAndSet(user3, user2);
        System.out.println(userAtomicReference.get());

        // 使用user1做CAS,更新成功
        userAtomicReference.compareAndSet(user1, user2);
        System.out.println(userAtomicReference.get());
    }
}