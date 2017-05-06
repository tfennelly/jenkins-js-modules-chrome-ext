<template>
    <div class="bundleListing">
        {{setBundleListingComponent()}}
        <table>
            <tr>
                <td class="list">
                    <Info trigger="click" label="What's a JavaScript bundle?">
                        <a href="https://github.com/jenkinsci/js-modules/blob/master/FAQs.md#what-is-the-difference-between-a-module-and-a-bundle" target="_blank">See the <code>js-modules</code> FAQ</a>.
                    </Info>
                    <p/>
                    <div id="all-bundle-info" v-if="bundleList && bundleList.bundles.length > 0">
                        <Alert type="info">
                            {{bundleList.bundles.length}} bundles loaded on page.<br/>
                            Total source size {{bundleList.size}} (approx).
                        </Alert>
                    </div>
                    <div class="loaded" v-if="bundleList">
                        <div :class="bundleNameClasses(bundle)" v-for="bundle in bundleList.bundles" @click="selectBundle(bundle.bundleId)">
                            {{bundle.bundleId}}
                            <b-badge v-if="bundle.warnings.length > 0" variant="warning">{{bundle.warnings.length}}</b-badge>
                            <b-badge v-if="bundle.errors.length > 0" variant="danger">{{bundle.errors.length}}</b-badge>
                        </div>
                    </div>
                </td>
                <td class="detail">
                    <div class="no-bundle-selected" v-if="!bundle" title="Select one of the bundles in the left panel">
                        <b-badge>Select bundle in left panel</b-badge>
                    </div>
                    <div v-else>
                        <div v-if="bundle">
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

    export default {
        components: {
            BundleDetail
        },
        props: {
            bundleList: Object // Instance of BundleList
        },
        methods: {
            setBundleListingComponent: function() {
                // Total hack ... must be a better way of doing this.
                bundles.setBundleListingComponent(this);
                return '';
            },
            selectBundle: function (bundleId) {
                this.bundle = this.bundleList.getBundleById(bundleId);
                if (!this.bundle) {
                    console.error(`Unexpected error. Failed to find bundle "${bundleId}".`);
                }
            },
            bundleNameClasses: function(loadedBundle) {
                return `bundleName ${this.bundle && loadedBundle.bundleId === this.bundle.bundleId ? 'selected' : ''}`;
            }
        },
        data () {
            return {
                bundle: undefined
            };
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