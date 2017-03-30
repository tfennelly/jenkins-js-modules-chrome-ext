<template>
    <div class="bundleListing">
        <p class="lead">
            The following js-module bundles were loaded
        </p>
        <table>
            <tr>
                <td class="list">
                    <div class="bundleName" v-for="trackingEvent in loadEvents">{{trackingEvent.bundleId}}</div>
                </td>
                <td class="detail">
                    Stuff
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

    function sortByTime(trackingEventList) {
        trackingEventList.sort(function (event1, event2) {
            if (event1.at < event2.at) {
                return -1;
            } else if (event1.at === event2.at) {
                return 0;
            } else {
                return 1;
            }
        });
        return trackingEventList;
    }

    export default {
        components: {
        },
        props: {
            trackingEvents: Array
        },
        methods: {
        },
        computed: {
            loadEvents: function() {
                const loadEvents = this.trackingEvents.filter(function (trackingEvent) {
                    return trackingEvent.event === 'load';
                });
                return sortByTime(loadEvents);
            }
        }
    }
</script>

<style>
    .bundleListing {
        padding: 5px;
    }

    .bundleListing .bundleName {
        font-size: 0.8rem;
        line-height: 1;
        padding: 5px;
    }
    .bundleListing .bundleName:hover {
        cursor: pointer;
        background: lightgrey;
    }

    .bundleListing td {
        vertical-align: top;
    }
    .bundleListing td.list {
        padding-left: 10px;
    }
    .bundleListing td.detail {
        padding-left: 20px;
    }
</style>