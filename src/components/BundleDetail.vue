<template>
    <div class="bundleDetail">

        <h4 id="overview">Overview</h4>
        <table id="overview-table">
            <tr>
                <td>ID</td>
                <td><code>{{bundle.bundleId}}</code></td>
            </tr>
            <tr>
                <td>Script</td>
                <td><code>{{bundle.script}}</code></td>
            </tr>
            <tr>
                <td>Created</td>
                <td>{{new Date(bundle.created).toString()}}</td>
            </tr>
            <tr>
                <td>js-builder</td>
                <td><code>{{bundle.jsBuilderVer}}</code></td>
            </tr>
            <tr v-if="bundle.hpiPluginId">
                <td>Loaded From</td>
                <td>{{bundle.hpiPluginId}}</td>
            </tr>
            <tr>
                <td>Module count</td>
                <td>{{numModules(bundle.moduleDefs)}}</td>
            </tr>
            <tr>
                <td>Source size</td>
                <td>{{bundle.size}}</td>
            </tr>
        </table>

        <div class="jump-tos">
            <div><a href="#import-export-heading">Import/Export</a></div>
            <div><a href="#packages-heading">Package Listing</a></div>
            <div>
                <a href="#modules-heading">Module Listing</a>
                <!-- TODO: refine this once we start detecting package level problems -->
                <b-badge v-if="bundle.warnings.length > 0" variant="warning">{{bundle.warnings.length}}</b-badge>
                <b-badge v-if="bundle.errors.length > 0" variant="danger">{{bundle.errors.length}}</b-badge>
            </div>
        </div>

        <h4 id="import-export-heading">Import/Export</h4>
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
        The following is a list of NPM packages that are <span class="hint" title="Whose package main/entry module is imported from another bundle (that exported it), allowing this bundle avoid the overhead of including that code. In this case, the bundle entry for the module only contains a js-modules import instruction Vs the full module source.">imported</span> and
        <span class="hint" title="Whose package main/entry module is exported from this bundle, allowing other bundles to import it i.e. allowing them to avoid the overhead of bundling that code.">exported</span> to/from this JavaScript bundle.
        See the <a href="#packages-heading">Package Listing</a> section for the <span class="hint" title="All packages used in the bundle i.e. not just those that were imported or exported.">complete</span> list of NPM packages used in this bundle.
        <table id="export-import">
            <thead>
                <th>Imports</th>
                <th>Exports</th>
            </thead>
            <tr>
                <td><div class="moduleName" v-for="importedModule in bundle.imports"><code>{{importedModule}}</code> (from <BundleLink :whoExports="importedModule" />)</div></td>
                <td><div class="moduleName" v-for="exportEvent in exports"><code>{{exportEvent.moduleSpec.moduleName}}@{{exportEvent.moduleSpec.moduleVersion}}</code></div></td>
            </tr>
        </table>

        <h4 id="packages-heading">Package Listing</h4>
        The following is a <span class="hint" title="All packages used in the bundle i.e. not just those that were imported or exported (see previous section).">complete</span> list of all NPM packages <span class="hint" title="Where the bundle bundles CommonJS modules from the NPM package.">used</span> in this bundle.
        <div id="bundle-package-listing">
            <div class="bundle-package" v-for="package in bundle.packages"><BundlePackageInfo :dPackage="package" /></div>
        </div>

        See the <a href="#modules-heading">Module Listing</a> section for a breakdown of the individual CommonJS modules being bundled from these NPM packages.

        <h4 id="modules-heading">Module Listing</h4>
        <Info placement="left">
            By default, bundles are generated such that all module code is "inlined" into the bundle i.e. the bundle entry for each module contains the full source for the module.
            <p/>
            However, <code>js-modules</code> supports the ability to share module code between bundles via module import/export instructions defined in the bundle definition
            (see <a href="#export-import">Import/Export</a> section above).
            <p/>
            Use the filtering options to see which modules are inlined or imported.
        </Info>
        The following is a list of CommonJS modules that are included (from <a href="#packages-heading">the above listed NPM packages</a>) in this JavaScript bundle. Note that module code can be either
        <span class="hint" title="The bundle entry for the module contains the full JavaScript source of the module i.e. the default Browserify bundling behaviour.">inlined</span>
        or <span class="hint" title="The bundle entry for the module contains just a js-modules import instruction i.e. the runtime code is coming from js-modules and is not included in the bundle entry. The code is being &quot;imported&quot; from another bundle.">imported</span>.

        <div id="moduleDefs">
            <div class="form-inline filter">
                <input id="moduleDefsFilter" type="text" placeholder="filter" v-model="moduleDefsFilter" class="form-control" @change="setTextFilter(moduleDefsFilter)" />
                <span title="Show modules whose code is inlined/bundled in the bundle"><input class="checkbox" type="checkbox" v-model="showBundledModules" @change="setShowBundledFilter(showBundledModules)" /> Inlined</span>
                <span title="Show modules whose code is imported from another bundle (not inlined)"><input class="checkbox" type="checkbox" v-model="showImportedModules" @change="setShowImportedFilter(showImportedModules)" /> Imported</span>
                <span title="Show modules for which no errors or warnings were found"><input class="checkbox" type="checkbox" v-model="showOKModules" @change="setShowOKFilter(showOKModules)" /> Ok</span>
                <span title="Show modules for which errors were found"><input class="checkbox" type="checkbox" v-model="showErrorModules" @change="setShowErrorFilter(showErrorModules)" /> Error</span>
                <span title="Show modules for which warnings were found"><input class="checkbox" type="checkbox" v-model="showWarningModules" @change="setShowWarningFilter(showWarningModules)" /> Warning</span>
            </div>
            <div v-for="moduleDefInst in filteredModuleDefs">
                <ModuleDef :moduleDef="moduleDefInst" :bundle="bundle"></ModuleDef>
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
    import BundlePackageInfo from './BundlePackageInfo.vue';

    export default {
        components: {
            ModuleDef, BundlePackageInfo
        },
        props: {
            bundle: Object  // Instance of Bundle
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
            },
            setShowOKFilter: function(showOKModules) {
                this.showOKModules = showOKModules;
            },
            setShowErrorFilter: function(showErrorModules) {
                this.showErrorModules = showErrorModules;
            },
            setShowWarningFilter: function(showWarningModules) {
                this.showWarningModules = showWarningModules;
            }
        },
        data: function () {
            return {
                textFilter: undefined,
                showBundledModules: true,
                showImportedModules: true,
                showOKModules: true,
                showErrorModules: true,
                showWarningModules: true
            }
        },
        computed: {
            exports: function() {
                // Only show specific versions.
                return this.bundle.exports.filter(function (moduleExport) {
                    return (moduleExport.moduleVersion && moduleExport.moduleVersion.isSpecific());
                });
            },
            filteredModuleDefs: function() {
                const moduleDefsList = [];

                const moduleDefs = this.bundle.moduleDefs;

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
                        
                        const errors = this.bundle.getErrors(moduleDef);
                        const warnings = this.bundle.getWarnings(moduleDef);
                        
                        if (!this.showOKModules && errors.length === 0 && warnings.length === 0) {
                            continue;
                        }
                        if (!this.showErrorModules && errors.length > 0) {
                            continue;
                        }
                        if (!this.showWarningModules && warnings.length > 0) {
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
        padding: 0 10px;
    }

    h4 {
        padding-top: 20px;
    }
    #overview {
        padding-top: 0;
    }

    .bundleDetail .jump-tos {
        border: solid 1px #d3d3d3;
        border-radius: 3px;
        padding: 10px 10px;
        margin-top: 20px;
    }

    .bundleDetail #overview-table td:first-child {
        width: 130px;
        padding-right: 10px;
        font-weight: bold;
        opacity: 0.6;
    }

    #bundle-package-listing {
        margin: 10px 0 10px 0;
        display: inline-block;
        width: 100%;
    }
    .bundle-package {
        padding: 3px 5px 3px 0;
        float: left;
    }

    #export-import {
        margin-top: 20px;
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