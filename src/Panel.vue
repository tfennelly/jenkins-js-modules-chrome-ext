<template>
    <div id="Panel">
        <JSModulesInfo :loadJsModulesInfo="loadJsModulesInfo"></JSModulesInfo>
    </div>
</template>

<script>
    import messaging from './messaging';
    import JSModulesInfo from './components/JSModulesInfo.vue'

    let loadJsModulesInfoCallback = undefined;

    messaging.onMessageFromInspectedPage("bundle-data", function(data) {
        if (loadJsModulesInfoCallback) {
            loadJsModulesInfoCallback(data);
        }
    });

    export default {
        name: 'Panel',
        components: {
            JSModulesInfo
        },
        methods: {
            loadJsModulesInfo: function(callback) {
                loadJsModulesInfoCallback = callback;
                messaging.executeScriptOnInspectedPage("scripts/content-scripts/bundle-data.js");
            }
        }
    }
</script>
