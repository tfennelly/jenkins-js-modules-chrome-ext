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
                <td>Loaded From</td>
                <td>{{decoded.hpiPluginId}}</td>
            </tr>
            <tr>
                <td>Module Count</td>
                <td>{{numModules(decoded.moduleDefs)}}</td>
            </tr>
            <tr>
                <td>Source size</td>
                <td>{{moduleSize(decoded.moduleDefs)}}</td>
            </tr>
        </table>

        <div class="jump-tos">
            <div><a href="#import-export-heading">Import/Export</a></div>
            <div><a href="#modules-heading">Module Listing</a></div>
        </div>

        <h4 id="import-export-heading">Import/Export</h4>
        The NPM packages that are imported and exported to/from this JavaScript bundle i.e. <code>{{bundle.loadEvent.bundleId}}</code>.
        <Info placement="left">
            The list of import/export packages is important when trying to determine the dependencies between different bundles.
            Imports and Exports allow bundles to collaborate at runtime by sharing JavaScript modules, which can be important for a number of reasons e.g.
            <ul>
                <li>
                    Where it's mandatory to only have a single instance of a module loaded across all bundles (e.g. <code>react</code>).</li>
                <li>
                    Where a package (and its modules) has a large footprint and would result in a large increase in the overall JavaScript loading profile if every bundle included
                    these modules. Exporting from one bundle and importing into others (and so not including) can help with this.
                </li>
            </ul>
        </Info>
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

        <h4 id="modules-heading">Module Listing</h4>
        The list of CommonJS modules that are included in this JavaScript bundle i.e. <code>{{bundle.loadEvent.bundleId}}</code>. Note that module code can be "inlined" or "imported".
        <Info placement="left">
            By default, bundles are generated such that all module code is "inlined" into the bundle.
            <p/>
            However, <code>js-modules</code> supports the ability to share module code between bundles via module import/export as defined in the bundle definition
            (see <a href="#export-import">Import/Export</a> section above).
            <p/>
            Use the filtering options to see which modules are inlined or imported.
        </Info>

        <div id="moduleDefs">
            <div class="form-inline filter">
                <input id="moduleDefsFilter" type="text" placeholder="filter" v-model="moduleDefsFilter" class="form-control" @change="setTextFilter(moduleDefsFilter)" />
                <span title="Show modules whose code is inlined/bundled in the bundle"><input class="checkbox" type="checkbox" v-model="showBundledModules" @change="setShowBundledFilter(showBundledModules)" /> Inlined</span>
                <span title="Show modules whose code is imported from another bundle (not inlined)"><input class="checkbox" type="checkbox" v-model="showImportedModules" @change="setShowImportedFilter(showImportedModules)" /> Imported</span>
            </div>
            <div v-for="moduleDefInst in filteredModuleDefs">
                <ModuleDef :moduleDef="moduleDefInst"></ModuleDef>
            </div>
            <div class="text-warning" v-if="filteredModuleDefs.length === 0">
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
            moduleSize: function(moduleDefs) {
                let size = 0;
                for (const moduleName in moduleDefs) {
                    if (moduleDefs.hasOwnProperty(moduleName)) {
                        size += moduleDefs[moduleName].size;
                    }
                }
                return size;
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

    .bundleDetail .jump-tos {
        border: solid 1px #d3d3d3;
        border-radius: 3px;
        padding: 10px 10px;
        margin-bottom: 20px;
    }

    .bundleDetail table {
        margin: 20px 0px;
    }
    .bundleDetail #overview-table td:first-child {
        width: 130px;
        padding-right: 10px;
        font-weight: bold;
        opacity: 0.6;
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
</style>