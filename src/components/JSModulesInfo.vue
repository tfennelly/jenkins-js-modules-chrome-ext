<template>
    <div class="jsModulesInfo">
        <b-tabs small card ref="tabs" v-model="tabIndex">
            <b-tab title="Bundles">
                <BundleListing :trackingEvents="jsModulesInfo.trackingEvents"></BundleListing>
            </b-tab>
            <b-tab title="Raw">
                <Raw :bundles="jsModulesInfo.bundles"></Raw>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import BundleListing from './BundleListing.vue'
    import Raw from './Raw.vue'

    export default {
        components: {
            BundleListing, Raw
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