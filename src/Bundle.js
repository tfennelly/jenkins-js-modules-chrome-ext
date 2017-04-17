import NPMPackage from './NPMPackage';

export default class Bundle {

    packages = [];
    size = 0;

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
    }}