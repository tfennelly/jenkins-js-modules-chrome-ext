import bundles from './bundles';

export default class NPMPackage {

    versions = [];
    size = 0;
    moduleDefs = [];
    importCount = 0;
    importedFrom = [];

    constructor(name) {
        this.name = name;
    }

    addVersion(version) {
        if (this.versions.indexOf(version) === -1) {
            this.versions.push(version);
        }
    }

    addModuleDef(moduleDef) {
        this.size += moduleDef.size;
        this.moduleDefs.push(moduleDef);
        if (moduleDef.stubbed) {
            this.importCount++;
            if (this.importedFrom.indexOf(moduleDef.stubbed.importModule)) {
                this.importedFrom.push(moduleDef.stubbed.importModule);
            }
        }
    }
}