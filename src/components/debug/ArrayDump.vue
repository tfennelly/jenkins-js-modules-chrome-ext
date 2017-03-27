<template>
    <div class="arrayDump">
        [
        <pre v-for="(arrayEntry, index) in data">{{(index > 0 ? ',' : '')}}{{entryToString(arrayEntry)}}</pre>
        ]
    </div>
</template>

<script>
    export default {
        props: {
            data: Array
        },
        methods: {
            entryToString: function (arrayEntry) {
                if (typeof arrayEntry === 'object') {
                    return JSON.stringify(arrayEntry);
                } else {
                    return arrayEntry.toString();
                }
            }
        }
    }
</script>

<style>
    .arrayDump pre {
        padding: 0px;
    }
</style>