<template>
    <div id="Panel">
        <JSModulesInfo :loadJsModulesInfo="loadJsModulesInfo"></JSModulesInfo>
    </div>
</template>

<script>
    import messaging from './messaging';
    import JSModulesInfo from './components/JSModulesInfo.vue'

    export default {
        name: 'Panel',
        components: {
            JSModulesInfo
        },
        methods: {
            loadJsModulesInfo: function(callback) {
                messaging.onMessageFromInspectedPage("js.modules.info", function(info) {
                    console.log('***', info.scripts);
                    callback(info.scripts);
                });
                messaging.executeScriptOnInspectedPage("scripts/content-scripts/js-modules-info.js");
            }
        }
    }
</script>
