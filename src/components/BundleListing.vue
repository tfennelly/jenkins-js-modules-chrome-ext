<template>
    <div class="bundleListing">
        <table>
            <tr>
                <td class="list">
                    <div class="bundleName" v-for="trackingEvent in loadEvents" @click="selectBundle(trackingEvent.bundleId)">{{trackingEvent.bundleId}}</div>
                </td>
                <td class="detail">
                    <div v-if="!bundle" title="Select one of the bundles in the left panel">
                        <b-badge>No bundle selected in left panel</b-badge>
                    </div>
                    <div v-else>
                        <div v-if="!bundle.bundleDetails">
                            <b-alert state="danger" show>
                                Hmmm something's not right here. We were unable to find a matching bundle for {{bundle.loadEvent.bundleId}}.
                            </b-alert>
                        </div>
                        <div v-else>
                            <BundleDetail :bundle="bundle"></BundleDetail>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    import BundleDetail from './BundleDetail.vue';
    import jsmodules from '../jsmodules';

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
            BundleDetail
        },
        props: {
            trackingEvents: Array,
            bundles: Array
        },
        methods: {
            selectBundle: function (bundleId) {
                const bundleLoadEvent = this.trackingEvents.filter(function (trackingEvent) {
                    return (trackingEvent.event === 'load' && trackingEvent.bundleId === bundleId);
                })[0];
                const bundleDetails = jsmodules.findBundleByScriptPath(bundleLoadEvent.bundlePath, this.bundles);

                this.bundle = {
                    loadEvent: bundleLoadEvent,
                    bundleDetails: bundleDetails
                };
            }
        },
        data () {
            return {
                bundle: undefined
            };
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
        padding: 20px 5px;
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