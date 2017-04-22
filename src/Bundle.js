import NPMPackage from './NPMPackage';
import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
import Version from '@jenkins-cd/js-modules/js/Version';

export default class Bundle {

    script = undefined;
    bundleId = undefined;
    created = 0;
    hpiPluginId = undefined;
    jsBuilderVer = undefined;
    moduleDefs = undefined;
    loadedAt = 0;
    loadIdx = 0;
    packages = [];
    exports = [];
    imports = [];
    size = 0;

    constructor(script, loadEvent, bundleData) {
        this.script = script;
        this.bundleId = loadEvent.bundleId;
        this.created = bundleData.created;
        this.hpiPluginId = bundleData.hpiPluginId;
        this.jsBuilderVer = bundleData.jsBuilderVer;
        this.moduleDefs = bundleData.moduleDefs;
        this.loadedAt = loadEvent.at;
        this.loadIdx = loadEvent.loadIdx;

        const self = this;
        for (const moduleName in bundleData.moduleDefs) {
            if (bundleData.moduleDefs.hasOwnProperty(moduleName)) {
                const moduleDef = bundleData.moduleDefs[moduleName];
                const packageInfo = moduleDef.packageInfo;

                self.incSize(moduleDef.size);

                const dPackage = self.getPackage(packageInfo.name, true);
                dPackage.addVersion(packageInfo.version);
                dPackage.addModuleDef(moduleDef);

                if (moduleDef.stubbed) {
                    if (!moduleDef.stubbed.moduleSpec) {
                        moduleDef.stubbed.moduleSpec = new ModuleSpec(moduleDef.stubbed.importModule);
                    }
                    var importName = `${moduleDef.stubbed.moduleSpec.moduleName}@${moduleDef.stubbed.moduleSpec.moduleVersion}`;
                    if (self.imports.indexOf(importName) === -1) {
                        self.imports.push(importName);
                    }
                }
            }
        }
    }

    getPackage(name, add = false) {
        for (let i = 0; i < this.packages.length; i++) {
            if (this.packages[i].name === name) {
                return this.packages[i];
            }
        }

        if (!add) {
            return undefined;
        }

        const dPackage = new NPMPackage(name);
        this.packages.push(dPackage);

        return dPackage;
    }

    incSize(numChars) {
        this.size += numChars;
    }

    addExport(moduleId, at) {
        const moduleSpec = new ModuleSpec(moduleId);
        const moduleVersion = (moduleSpec.moduleVersion && new Version(moduleSpec.moduleVersion));
        this.exports.push({
            moduleId: moduleId,
            moduleSpec: moduleSpec,
            moduleVersion: moduleVersion,
            at: at
        });
    }

    exportsModule(moduleName) {
        let importAs;

        if (moduleName instanceof ModuleSpec) {
            importAs = moduleName.importAs();
        } else {
            const moduleSpec = new ModuleSpec(moduleName);
            importAs = moduleSpec.importAs();
        }

        for (let i = 0; i < this.exports.length; i++) {
            const moduleExport = this.exports[i];
            if (importAs === moduleExport.moduleId) {
                return true;
            }
        }

        return false;
    }
}