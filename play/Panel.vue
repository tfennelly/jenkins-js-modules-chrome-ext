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
                    jsModulesInfo.trackingEvents = JSON.parse(trackingData);
                    checkLoaded();
                });

                sampleDataLoader.getBundleData(function (bundleData) {
                    jsModulesInfo.bundles = JSON.parse(bundleData);
                    checkLoaded();
                });
            }
        }
    }
</script>