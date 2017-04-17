<template>
    <div class="bundle-package-info">
        <b-popover triggers="click" placement="left">
            <code :class="versionsClassNames">{{dPackage.name}}</code>
            <span slot="content">
                <table>
                    <tr :class="versionsClassNames">
                        <td>Versions</td>
                        <td>{{versions}}</td>
                    </tr>
                    <tr>
                        <td>Module count</td>
                        <td>{{this.dPackage.moduleDefs.length}}</td>
                    </tr>
                    <tr>
                        <td>Source size</td>
                        <td>{{this.dPackage.size}}</td>
                    </tr>
                    <tr v-if="this.dPackage.importCount > 0">
                        <td>Imported from</td>
                        <td><BundleLink :whoExports="this.dPackage.importedFrom[0]" /></td>
                    </tr>
                </table>
            </span>
        </b-popover>
    </div>
</template>

<script>
    export default {
        props: {
            // dPackage is an instance of NPMPackage
            dPackage: Object
        },
        computed: {
            versionsClassNames: function() {
                if (this.dPackage.versions.length > 1) {
                    return 'multi-versions';
                }
            },
            versions: function() {
                return this.dPackage.versions.join(', ');
            }
        }
    }
</script>

<style>
    .bundle-package-info {
        display: inline-block;
    }
    .bundle-package-info:hover {
        cursor: pointer;
    }
    .bundle-package-info code.multi-versions {
        background-color: #faebcc;
    }
    .bundle-package-info tr.multi-versions {
        background-color: #faebcc;
    }
    .bundle-package-info table {
        margin-top: 0;
    }
    .bundle-package-info table td {
        padding: 0 5px;
    }
    .bundle-package-info table td:first-child {
        padding-right: 10px;
        font-weight: bold;
        opacity: 0.6;
    }
    .bundle-package-info .popover {
        max-width: 400px;
    }
</style>