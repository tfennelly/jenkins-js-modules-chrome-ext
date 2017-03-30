<template>
    <div class="rawBundleInfo">
        <p class="lead">
            A simple/raw dump of the bundle metadata. Useful for debugging.
        </p>
        <div class="dump">
            {{bundlesToString()}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            bundles: Array
        },
        methods: {
            bundlesToString: function () {
                return JSON.stringify(this.bundles, undefined, 4);
            }
        }
    }
</script>

<style>
    .rawBundleInfo {
        padding: 10px;
    }
    .rawBundleInfo .dump {
        font-family: monospace;
        white-space: pre;
    }
</style>