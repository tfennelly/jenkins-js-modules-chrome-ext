<template>
    <div id="Panel">
        <JSModulesInfo :loadJsModulesInfo="loadJsModulesInfo"></JSModulesInfo>
    </div>
</template>

<script>
    import messaging from './messaging';
    import JSModulesInfo from './components/JSModulesInfo.vue'

    let loadJsModulesInfoCallback = undefined;

    messaging.onMessageFromInspectedPage("script-urls-list", function(info) {
        if (loadJsModulesInfoCallback) {
            loadJsModulesInfoCallback(info.scripts);
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
                messaging.executeScriptOnInspectedPage("scripts/content-scripts/script-urls-list.js");
            }
        }
    }
</script>
