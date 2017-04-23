import ProblemScanner from '../ProblemScanner';

export default class UnusedExportScanner extends ProblemScanner {

    checkModuleDef(moduleDef, bundle) {
        console.log('UnusedExportScanner scanning ');
    }
}