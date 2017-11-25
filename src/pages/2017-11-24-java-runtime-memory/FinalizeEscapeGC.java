public class FinalizeEscapeGC {
    public static FinalizeEscapeGC SAVE_HOOK = null;

    protected void finalize() throws Throwable {
        System.out.println("Executing finalize");
        super.finalize();
        FinalizeEscapeGC.SAVE_HOOK = this;
    }

    private static void testHookAlive() {
        if (FinalizeEscapeGC.SAVE_HOOK != null) {
            System.out.println("Alive");
        } else {
            System.out.println("Dead");
        }
    }

    public static void main(String[] args) throws Exception {
        FinalizeEscapeGC obj = new FinalizeEscapeGC();
        obj = null;
        System.gc();
        // make sure GC finish
        Thread.sleep(500);
        testHookAlive();

        FinalizeEscapeGC.SAVE_HOOK = null;
        System.gc();
        Thread.sleep(500);
        testHookAlive();

    }

}
/* -- output --
Executing finalize
Alive
Dead
 */