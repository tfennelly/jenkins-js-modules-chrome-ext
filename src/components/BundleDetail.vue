<template>
    <div class="bundleDetail">
        {{bundle.loadEvent.bundleId}} - {{bundle.bundleDetails.script}}
    </div>
</template>

<script>
    export default {
        props: {
            bundle: Object
        },
        methods: {
        }
    }
</script>

<style>
    .bundleDetail {
        padding: 10px;
    }
</style>