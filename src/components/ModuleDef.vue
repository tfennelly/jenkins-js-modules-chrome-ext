<template>
    <div class="moduleDef">
        <fieldset>
            <legend>{{trimmedModuleName}}</legend>
            <table id="overview-table">
                <tr v-if="moduleDef.stubbed">
                    <td title="This module is imported from another bundle i.e. its code is not inlined in this bundle.">Imported From</td>
                    <td>
                        <code>{{importedFrom}}</code>, <span title="The bundle that exports the module being imported">which is exported by the <span class="export-bundle" @click="showBundle(importSatisfiedBy)">{{importSatisfiedBy}}</span> bundle</span>
                    </td>
                </tr>
                <tr v-else>
                    <td title="The NPM package from which the module code was inlined">Inlined From</td>
                    <td>
                        <code>{{moduleDef.packageInfo.name}}@{{moduleDef.packageInfo.version}}</code>
                        <span v-if="npmPackageRepo">(<a :href="npmPackageRepo" target="_blank">repo</a>)</span>
                    </td>
                </tr>
            </table>
        </fieldset>

    </div>
</template>

<script>
    import _s from 'underscore.string';
    import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
    import bundles from '../bundles';

    export default {
        props: {
            moduleDef: Object
        },
        computed: {
            trimmedModuleName: function() {
                return _s.ltrim(this.moduleDef.id, 'node_modules/');
            },
            npmPackageRepo: function() {
                const packageInfo = this.moduleDef.packageInfo;
                if (packageInfo.repository && packageInfo.repository.type === 'git') {
                    return _s.ltrim(packageInfo.repository.url, 'git+');
                }
                return undefined;
            },
            importedFrom: function() {
                if (this.moduleDef.stubbed) {
                    const moduleSpec = new ModuleSpec(this.moduleDef.stubbed.importModule);
                    return `${moduleSpec.moduleName}@${moduleSpec.moduleVersion}`;
                }
                return undefined;
            },
            importSatisfiedBy: function() {
                if (this.moduleDef.stubbed) {
                    return bundles.whoExports(this.moduleDef.stubbed.importModule);
                }
                return undefined;
            }
        },
        methods: {
            showBundle: function(bundleId) {
                if (bundleId) {
                    bundles.showBundle(bundleId);
                }
            }
        }
    }
</script>

<style>
    .moduleDef #overview-table td:first-child {
        width: 150px;
        padding-right: 10px;
        font-weight: bold;
        opacity: 0.6;
    }

    .export-bundle {
        color: #0275d8;
    }
    .export-bundle:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>