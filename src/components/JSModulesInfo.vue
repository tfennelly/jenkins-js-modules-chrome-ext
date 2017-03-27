<template>
    <div class="jsModulesInfo">
        <p class="lead">
            js-modules analysis.
        </p>
    </div>
</template>

<script>
    import ArrayDump from './debug/ArrayDump.vue'

    export default {
        components: {
            ArrayDump
        },
        props: {
            loadJsModulesInfo: Function
        },
        data () {
            const data = {
                jsModulesInfo: {
                    bundles: [],
                    trackingEvents: []
                }
            };

            this.loadJsModulesInfo(function (jsModulesInfo) {
                data.jsModulesInfo = jsModulesInfo;
            });

            return data;
        },
        methods: {
        },
        computed: {
        }
    }
</script>

<style>
    .jsModulesInfo {
        padding: 20px;
    }
</style>