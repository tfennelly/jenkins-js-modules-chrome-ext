
export default class NPMPackage {

    versions = [];

    constructor(name) {
        this.name = name;
    }

    addVersion(version) {
        if (this.versions[version] === -1) {
            this.versions.push(version);
        }
    }
}