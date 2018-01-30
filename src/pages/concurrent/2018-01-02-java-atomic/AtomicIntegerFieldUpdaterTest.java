import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;

public class AtomicIntegerFieldUpdaterTest {
    private static AtomicIntegerFieldUpdater<User> a = AtomicIntegerFieldUpdater.newUpdater(User.class, "id");
    static class User {
        private String name;
        volatile int id;
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
        System.out.println(a.getAndIncrement(user1));
        System.out.println(a.get(user1));
    }
}