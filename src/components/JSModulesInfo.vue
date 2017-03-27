<template>
    <div class="jsModulesInfo">
        <p class="lead">
            js-modules analysis.
        </p>
        <TrackingEvents :trackingEvents="jsModulesInfo.trackingEvents"></TrackingEvents>
    </div>
</template>

<script>
    import TrackingEvents from './debug/TrackingEvents.vue'

    export default {
        components: {
            TrackingEvents
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