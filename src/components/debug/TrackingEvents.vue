<template>
    <div class="trackingEvents">
        <pre v-for="trackingEvent in trackingEvents">
            {{ trackingEvent }}
        </pre>
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
    .trackingEvents {
        padding: 5px;
    }
</style>