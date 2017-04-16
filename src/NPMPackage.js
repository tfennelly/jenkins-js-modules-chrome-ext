
export default class NPMPackage {

    versions = [];
    size = 0;

    constructor(name) {
        this.name = name;
    }

    addVersion(version) {
        if (this.versions[version] === -1) {
            this.versions.push(version);
        }
    }

    incSize(numChars) {
        this.size += numChars;
    }
}