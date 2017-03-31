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
                <th>Exports</th>
                <th>Imports</th>
            </thead>
            <tr>
                <td><div class="moduleName" v-for="exportEvent in exports"><code>{{exportEvent.moduleSpec.moduleName}}@{{exportEvent.moduleSpec.moduleVersion}}</code></div></td>
                <td><code></code></td>
            </tr>
        </table>

    </div>
</template>

<script>
    import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
    import Version from '@jenkins-cd/js-modules/js/Version';

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
            }
        },
        computed: {
            decoded: function() {
                if (!this.bundle.bundleDetails.decoded) {
                    this.bundle.bundleDetails.decoded = JSON.parse(this.bundle.bundleDetails.data);
                }
                return this.bundle.bundleDetails.decoded;
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
</style>