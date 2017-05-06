import ProblemScanner from '../ProblemScanner';
import ProblemDescription from '../ProblemDescription';
import bundles from '../bundles';

export default class UnusedExportScanner extends ProblemScanner {

    checkModuleDef(moduleDef, bundle) {
        // Lets check see if this module is inlined or stubbed/imported.
        // If it's inlined (not stubbed) and the package it is coming from is
        // exported from another bundle, then we at least have a possible optimization,
        // which will show as a warning.
        if (!moduleDef.stubbed) {
            const packageInfo = moduleDef.packageInfo;
            var packageNV = `${packageInfo.name}@${packageInfo.version}`;
            const whoExports = bundles.whoExports(packageNV);

            if (whoExports && whoExports !== bundle) {
                // Something else is exporting the same package. This is at least a warning,
                // because it's a possible optimization i.e. get it from the other bundle
                // vs inlining it, reducing bundle size.
                //
                // But ... it could actually be a bundling error !! It's a bundling error if some
                // other modules in the same bundle are imported from that package i.e. stubbed.
                // That would mean some modules from the package were imported, while others were
                // not. That would be an error.
                //

                let addedError = false;
                bundle.forEachModuleDef(function (otherModuleDef) {
                    if (otherModuleDef !== moduleDef && otherModuleDef.stubbed) {
                        if (otherModuleDef.stubbed.moduleSpec.moduleName === packageInfo.name) {
                            bundle.addError(
                                new ProblemDescription('UNUSED_EXPORT_FAILED_IMPORT', 'Unused Export - Failed Import')
                                    .gsDetail(`This bundle is importing other ${packageInfo.name} modules from ${whoExports.bundleId}. It should also import this module.`),
                                moduleDef);
                            addedError = true;
                            return false; // break out - stop iterating the modules.
                        }
                    }
                });

                if (!addedError) {
                    // The above error condition was not found, so lets add a warning.
                    bundle.addWarning(
                        new ProblemDescription('UNUSED_EXPORT_MISSING_IMPORT', 'Unused Export - Missing Import')
                            .gsDetail(`This bundle could import ${packageInfo.name} modules, possibly reducing bundle size. ${packageInfo.name} modules are being exported from ${whoExports.bundleId}.`),
                        moduleDef);
                }
            }
        }
    }
}