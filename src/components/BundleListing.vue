<template>
    <div class="bundleListing">
        <table>
            <tr>
                <td class="list">
                    <Info trigger="click" label="What's a JavaScript bundle?">
                        <a href="https://github.com/jenkinsci/js-modules/blob/master/FAQs.md#what-is-the-difference-between-a-module-and-a-bundle" target="_blank">See the <code>js-modules</code> FAQ</a>.
                    </Info>
                    <p/>
                    <div class="loaded">
                        <div :class="bundleNameClasses(trackingEvent)" v-for="trackingEvent in loadEvents" @click="selectBundle(trackingEvent.bundleId)">{{trackingEvent.bundleId}}</div>
                    </div>
                </td>
                <td class="detail">
                    <div class="no-bundle-selected" v-if="!bundle" title="Select one of the bundles in the left panel">
                        <b-badge>Select bundle in left panel</b-badge>
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
    import bundles from '../bundles';

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
                const bundleExportEvents = this.trackingEvents.filter(function (trackingEvent) {
                    return (trackingEvent.event === 'export' && trackingEvent.bundleId === bundleId);
                });
                const bundleDetails = bundles.findBundleByScriptPath(bundleLoadEvent.bundlePath);

                this.bundle = {
                    loadEvent: bundleLoadEvent,
                    exportEvents: bundleExportEvents,
                    bundleDetails: bundleDetails
                };
            },
            bundleNameClasses: function(loadEvent) {
                return `bundleName ${this.bundle && loadEvent.bundleId === this.bundle.loadEvent.bundleId ? 'selected' : ''}`;
            }
        },
        data () {
            return {
                bundle: undefined
            };
        },
        computed: {
            loadEvents: function() {
                // Set this component in the bundles module.
                // Seems like it's the wrong place to do it,
                // but not sure what the right way is.
                bundles.setBundleListingComponent(this);

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

    .bundleListing table {
        width: 100%;
    }

    .bundleListing td.list {
        width: 20%;
    }

    .bundleListing .no-bundle-selected {
        font-size: 1.2rem;
    }

    .bundleListing .bundleName {
        line-height: 1;
        padding: 5px;
        white-space: nowrap;
        overflow: hidden;
    }
    .bundleListing .bundleName:hover {
        cursor: pointer;
    }
    .bundleListing .bundleName:hover, .bundleListing .bundleName.selected {
        background: #989898;
        color: white;
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