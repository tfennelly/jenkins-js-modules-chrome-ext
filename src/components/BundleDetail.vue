<template>
    <div class="bundleDetail">
        <h4>Overview</h4>
        <table>
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
    </div>
</template>

<script>
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
            }
        }
    }
</script>

<style>
    .bundleDetail {
        padding: 10px;
    }
    .bundleDetail td:first-child {
        padding-right: 10px;
        font-weight: bold;
    }
</style>