/**
 * A simple type for Bundle Warnings and Errors.
 */

export default class ProblemDescription {

    label = undefined;
    summary = undefined;
    detail = undefined;

    constructor(label, summary) {
        this.label = label;
        this.summary = summary;
    }

    gsDetail(detail) {
        if (detail) {
            this.detail = detail;
            return this;
        } else {
            return this.detail;
        }
    }
}