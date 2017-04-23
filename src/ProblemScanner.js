/**
 * Simple ProblemScanner "interface".
 * <p/>
 * Implementations go in the "problem-scanners" folder.
 */

export default class ProblemScanner {

    bundleList = undefined;

    /**
     * Constructor.
     * @param bundleList The top level BundleList instance.
     */
    constructor (bundleList) {
        this.bundleList = bundleList;
    }

    /**
     * Check a moduleDef instance.
     * <p/>
     * Create ProblemDescription instances when a problem is encountered with a moduleDef
     * and add it to the Bundle as an error or warning via bundle.addError() or bundle.addWarning().
     * @param moduleDef The moduleDef instance to be checked.
     * @param bundle The Bundle instance.
     */
    checkModuleDef(moduleDef, bundle) {
        // Stub. Override as appropriate.
    }
}