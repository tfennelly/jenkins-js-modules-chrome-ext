<template>
    <div class="bundleDetail">

        <h4>Overview</h4>
        <table id="overview-table">
            <tr>
                <td>ID</td>
                <td><code>{{bundle.loadEvent.bundleId}}</code></td>
            </tr>
            <tr>
                <td>Script</td>
                <td><code>{{bundle.bundleDetails.script}}</code></td>
            </tr>
            <tr>
                <td>Created</td>
                <td>{{new Date(decoded.created).toString()}}</td>
            </tr>
            <tr>
                <td>js-builder</td>
                <td><code>{{decoded.jsBuilderVer}}</code></td>
            </tr>
            <tr v-if="decoded.hpiPluginId">
                <td>Loaded from</td>
                <td>{{decoded.hpiPluginId}}</td>
            </tr>
            <tr>
                <td># modules</td>
                <td>{{numModules(decoded.moduleDefs)}}</td>
            </tr>
        </table>

        <h4>Import/Export</h4>
        <table id="export-import">
            <thead>
                <th>Imports</th>
                <th>Exports</th>
            </thead>
            <tr>
                <td><div class="moduleName" v-for="importedModule in imports"><code>{{importedModule}}</code></div></td>
                <td><div class="moduleName" v-for="exportEvent in exports"><code>{{exportEvent.moduleSpec.moduleName}}@{{exportEvent.moduleSpec.moduleVersion}}</code></div></td>
            </tr>
        </table>

        <h4>Modules</h4>
        <div id="moduleDefs">
            <input id="moduleDefsFilter" type="text" placeholder="filter" v-model="moduleDefsFilter" class="form-control" @change="filterModuleDefs(moduleDefsFilter)"/>
            <div class="moduleDef"v-for="moduleDef in filteredModuleDefs">
                <h6>{{moduleDef.id}}</h6>
            </div>
        </div>

    </div>
</template>

<script>
    import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
    import Version from '@jenkins-cd/js-modules/js/Version';

    function getDecodedBundle() {
        if (!this.bundle.bundleDetails.decoded) {
            this.bundle.bundleDetails.decoded = JSON.parse(this.bundle.bundleDetails.data);
        }
        return this.bundle.bundleDetails.decoded;
    }

    function doModuleDefsFilter(moduleDefsFilter) {
        const moduleDefsList = [];

        const moduleDefs = getDecodedBundle.call(this).moduleDefs;

        for (const moduleName in moduleDefs) {
            if (moduleDefs.hasOwnProperty(moduleName)) {
                const moduleDef = moduleDefs[moduleName];

                if (!moduleDefsFilter) {
                    moduleDefsList.push(moduleDef);
                } else {
                    // A filter was supplied
                    if (moduleDef.id.indexOf(moduleDefsFilter) !== -1) {
                        moduleDefsList.push(moduleDef);
                    }
                }
            }
        }
        return moduleDefsList;
    }

    export default {
        props: {
            bundle: Object
        },
        methods: {
            numModules: function(moduleDefs) {
                let count = 0;
                for (const moduleName in moduleDefs) {
                    if (moduleDefs.hasOwnProperty(moduleName)) {
                        count++;
                    }
                }
                return count;
            },
            filterModuleDefs: function(moduleDefsFilter) {
                this.filteredModuleDefs = doModuleDefsFilter.call(this, moduleDefsFilter);
            }
        },
        data: function () {
            return {
                filteredModuleDefs: doModuleDefsFilter.call(this)
            }
        },
        computed: {
            decoded: function() {
                return getDecodedBundle.call(this);
            },
            exports: function() {
                return this.bundle.exportEvents.filter(function (exportEvent) {
                    if (!exportEvent.moduleSpec) {
                        exportEvent.moduleSpec = new ModuleSpec(exportEvent.moduleId);
                        exportEvent.moduleVersion = (exportEvent.moduleSpec.moduleVersion && new Version(exportEvent.moduleSpec.moduleVersion));
                    }
                    return (exportEvent.moduleVersion && exportEvent.moduleVersion.isSpecific());
                });
            },
            imports: function() {
                const imports = [];
                const moduleDefs = this.decoded.moduleDefs;
                for (const moduleName in moduleDefs) {
                    if (moduleDefs.hasOwnProperty(moduleName)) {
                        const moduleDef = moduleDefs[moduleName];
                        if (moduleDef.stubbed) {
                            if (!moduleDef.stubbed.moduleSpec) {
                                moduleDef.stubbed.moduleSpec = new ModuleSpec(moduleDef.stubbed.importModule);
                            }
                            var importName = `${moduleDef.stubbed.moduleSpec.moduleName}@${moduleDef.stubbed.moduleSpec.moduleVersion}`;
                            if (imports.indexOf(importName) === -1) {
                                imports.push(importName);
                            }
                        }
                    }
                }
                return imports;
            }
        }
    }
</script>

<style>
    .bundleDetail {
        padding: 10px;
    }
    .bundleDetail table {
        margin: 20px 0px;
    }
    .bundleDetail #overview-table td:first-child {
        padding-right: 10px;
        font-weight: bold;
    }

    #export-import {
        width: 100%;
    }
    #export-import th {
        width: 50%;
        background-color: #ebebeb;
    }
    #export-import th, #export-import td {
        padding: 10px;
    }
    #export-import .moduleName {
        padding: 5px 0px;
    }

    #moduleDefsFilter {
        margin: 20px 0px;
    }
</style>