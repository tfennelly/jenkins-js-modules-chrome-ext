<template>
    <div class="moduleDef">
        <fieldset>
            <legend>{{trimmedModuleName}}</legend>
            <table id="overview-table">
                <tr>
                    <td title="The NPM package from which the module was bundled">NPM Package</td>
                    <td>
                        <code>{{moduleDef.packageInfo.name}}@{{moduleDef.packageInfo.version}}</code>
                        <span v-if="npmPackageRepo">(<a :href="npmPackageRepo" target="_blank">repo</a>)</span>
                    </td>
                </tr>
                <tr v-if="moduleDef.stubbed">
                    <td title="This module is imported from another bundle">Imported from</td>
                    <td>
                        <code>{{importedFrom}}</code>
                    </td>
                </tr>
            </table>
        </fieldset>

    </div>
</template>

<script>
    import _s from 'underscore.string';
    import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';

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
            }
        },
        methods: {
        }
    }
</script>

<style>
    .moduleDef #overview-table td:first-child {
        width: 150px;
        padding-right: 10px;
        font-weight: bold;
    }

    .hint {
        opacity: 0.5;
    }
</style>