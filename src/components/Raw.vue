<template>
    <div class="rawBundleInfo">
        <p class="lead">
            A simple/raw dump of the bundle/event metadata. Useful for debugging.
        </p>

        <ul>
            <li><a href="#events">Load/export events</a></li>
            <li><a href="#bundles">Bundles</a></li>
        </ul>

        <h3 id="events">Load/export events</h3>
        <div class="dump">
{{jsonToString(trackingEvents)}}
        </div>
        <h3 id="bundles">Bundles</h3>
        <div class="dump">
{{jsonToString(bundles)}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            trackingEvents: Array,
            bundles: Array
        },
        methods: {
            jsonToString: function (json) {
                return JSON.stringify(json, undefined, 4);
            }
        }
    }
</script>

<style>
    .rawBundleInfo {
        padding: 10px;
    }
    .rawBundleInfo h3 {
        margin-top: 15px;
    }
    .rawBundleInfo .dump {
        padding-left: 10px;
        font-family: monospace;
        white-space: pre;
        border: solid 1px black;
    }
</style>