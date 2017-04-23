/**
 * A simple type for Bundle Warnings and Errors.
 */

export default class ProblemDescription {

    label = undefined;
    summary = undefined;
    detail = undefined;
    refLinks = undefined;

    constructor(label, summary) {
        this.label = label;
        this.summary = summary;
    }

    detail(detail) {
        if (detail) {
            this.detail = detail;
            return this;
        } else {
            return this.detail;
        }
    }

    refLinks(refLinks) {
        if (refLinks) {
            this.refLinks = refLinks;
            return this;
        } else {
            return this.refLinks;
        }
    }
}