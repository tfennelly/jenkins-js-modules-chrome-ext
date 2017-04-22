import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';

export default class BundleList {

    bundles = []; // instances of Bundle
    size = 0;

    addBundle(bundle) {
        this.bundles.push(bundle);
        this.size += bundle.size;
    }

    getBundleById(bundleId) {
        for (let i = 0; i < this.bundles.length; i++) {
            const bundle = this.bundles[i];
            if (bundle.bundleId === bundleId) {
                return bundle;
            }
        }
        return undefined;
    }

    whoExports(moduleName) {
        const moduleSpec = new ModuleSpec(moduleName);

        for (let i = 0; i < this.bundles.length; i++) {
            const bundle = this.bundles[i];
            if (bundle.exportsModule(moduleSpec)) {
                return bundle;
            }
        }

        // Nothing exporting it.
        return undefined;
    }
}