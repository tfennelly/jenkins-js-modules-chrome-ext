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
                messaging.onMessageFromInspectedPage("js.modules.info", callback);
                messaging.executeScriptOnInspectedPage("scripts/content-scripts/js-modules-info.js");
            }
        }
    }
</script>
