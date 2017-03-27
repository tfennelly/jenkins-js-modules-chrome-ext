<template>
    <div class="trackingEvents">
        [
        <pre v-for="(trackingEvent, index) in trackingEvents">{{(index > 0 ? ',' : '')}}{{trackingEvent}}</pre>
        ]
    </div>
</template>

<script>
    export default {
        props: {
            trackingEvents: Array
        }
    }
</script>

<style>
    .trackingEvents pre {
        padding: 0px;
    }
</style>