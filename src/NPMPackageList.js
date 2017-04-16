import NPMPackage from './NPMPackage';

export default class NPMPackageList {

    packages = [];

    package(name) {
        for (let i = 0; i < this.packages.length; i++) {
            if (this.packages[i].name === name) {
                return this.packages[i];
            }
        }

        const dPackage = new NPMPackage(name);
        this.packages.push(dPackage);

        return dPackage;
    }
}