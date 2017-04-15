<template>
    <span class="export-bundle" @click="showBundle()" :title="title">{{bundleName}}</span>
</template>

<script>
    import bundles from '../bundles';

    export default {
        props: {
            bundle: String,
            whoExports: String
        },
        computed: {
            bundleName: function() {
                if (this.bundle) {
                    return this.bundle;
                } else if (this.whoExports) {
                    return bundles.whoExports(this.whoExports);
                }
                return undefined;
            },
            title: function() {
                if (this.whoExports) {
                    return `The bundle that exports ${this.whoExports}.`;
                }
                return '';
            }
        },
        methods: {
            showBundle: function() {
                if (this.bundleName) {
                    bundles.showBundle(this.bundleName);
                }
            }
        }
    }
</script>

<style>
    .export-bundle {
        color: #0275d8;
    }
    .export-bundle:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>