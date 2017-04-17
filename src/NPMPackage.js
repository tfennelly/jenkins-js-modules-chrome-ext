
export default class NPMPackage {

    versions = [];
    size = 0;
    moduleDefs = [];

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
    }
}