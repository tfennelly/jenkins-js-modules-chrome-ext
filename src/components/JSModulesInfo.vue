<template>
    <div class="jsModulesInfo">
        <BundleListing :trackingEvents="jsModulesInfo.trackingEvents"></BundleListing>
    </div>
</template>

<script>
    import BundleListing from './BundleListing.vue'

    export default {
        components: {
            BundleListing
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