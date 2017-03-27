<template>
    <Page>
        <div id="Panel">
            <JSModulesInfo :loadJsModulesInfo="loadJsModulesInfo"></JSModulesInfo>
        </div>
    </Page>
</template>

<script>
    import JSModulesInfo from '../src/components/JSModulesInfo.vue'
    import sampleDataLoader from './sampledataloader';

    export default {
        name: 'Panel',
        components: {
            JSModulesInfo
        },
        methods: {
            loadJsModulesInfo: function(callback) {
                const jsModulesInfo = {};

                function checkLoaded() {
                    if (jsModulesInfo.trackingEvents && jsModulesInfo.bundles) {
                        callback(jsModulesInfo);
                    }
                }

                sampleDataLoader.getBundleTrackingData(function (trackingData) {
                    console.log(trackingData);
                    jsModulesInfo.trackingEvents = JSON.parse(trackingData);
                    jsModulesInfo.bundles = [];
                    checkLoaded();
                })
            }
        }
    }
</script>