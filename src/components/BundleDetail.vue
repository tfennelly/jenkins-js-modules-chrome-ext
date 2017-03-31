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
            <div class="form-inline filter">
                <input id="moduleDefsFilter" type="text" placeholder="filter" v-model="moduleDefsFilter" class="form-control" @change="setTextFilter(moduleDefsFilter)" />
                <input class="checkbox" type="checkbox" v-model="showBundledModules" @change="setShowBundledFilter(showBundledModules)" /> Bundled
                <input class="checkbox" type="checkbox" v-model="showImportedModules" @change="setShowImportedFilter(showImportedModules)" /> Imported
            </div>
            <div v-for="moduleDefInst in filteredModuleDefs">
                <ModuleDef :moduleDef="moduleDefInst"></ModuleDef>
            </div>
            <div class="tweak-filter-settings" v-if="filteredModuleDefs.length === 0">
                No modules to show. Try changing the filter parameters.
            </div>
        </div>

    </div>
</template>

<script>
    import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
    import Version from '@jenkins-cd/js-modules/js/Version';
    import ModuleDef from './ModuleDef.vue';

    function getDecodedBundle() {
        if (!this.bundle.bundleDetails.decoded) {
            this.bundle.bundleDetails.decoded = JSON.parse(this.bundle.bundleDetails.data);
        }
        return this.bundle.bundleDetails.decoded;
    }

    export default {
        components: {
            ModuleDef
        },
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
            setTextFilter: function(moduleDefsFilter) {
                this.textFilter = moduleDefsFilter;
            },
            setShowBundledFilter: function(showBundledModules) {
                this.showBundledModules = showBundledModules;
            },
            setShowImportedFilter: function(showImportedModules) {
                this.showImportedModules = showImportedModules;
            }
        },
        data: function () {
            return {
                textFilter: undefined,
                showBundledModules: true,
                showImportedModules: true
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
            },
            filteredModuleDefs: function() {
                const moduleDefsList = [];

                const moduleDefs = getDecodedBundle.call(this).moduleDefs;

                for (const moduleName in moduleDefs) {
                    if (moduleDefs.hasOwnProperty(moduleName)) {
                        const moduleDef = moduleDefs[moduleName];

                        if (this.textFilter) {
                            // A text filter was supplied
                            if (moduleDef.id.indexOf(this.textFilter) === -1) {
                                continue;
                            }
                        }
                        if (!moduleDef.stubbed && !this.showBundledModules) {
                            continue;
                        }
                        if (moduleDef.stubbed && !this.showImportedModules) {
                            continue;
                        }

                        // Passed all filtering tests, so add it.
                        moduleDefsList.push(moduleDef);
                    }
                }

                return moduleDefsList;
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

    #moduleDefs .filter {
        margin: 20px 0px;
    }
    #moduleDefs .filter input.checkbox {
        margin: 0px 5px 0px 10px;
    }

    .bundleDetail .tweak-filter-settings {
        opacity: 0.5;
    }
</style>