<template>
    <div class="jsModulesInfo">
        <p class="lead">
            js-modules analysis.
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            loadJsModulesInfo: Function
        },
        data () {
            const data = {
                jsModulesInfo: []
            };

            this.loadJsModulesInfo(function (jsModulesInfo) {
                data.jsModulesInfo = jsModulesInfo;
                console.log('**** jsModulesInfo: ', jsModulesInfo);
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