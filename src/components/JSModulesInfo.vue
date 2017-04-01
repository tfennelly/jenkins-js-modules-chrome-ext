<template>
    <div class="jsModulesInfo">
        <div v-if="noJSModulesInfo.length > 0">
            <Alert type="info" dismissible>
                See the "<strong>Other</strong>" tab for scripts that don't expose <code>js-modules</code> metadata.
            </Alert>
        </div>
        <b-tabs small>
            <b-tab title="Bundles">
                <BundleListing :trackingEvents="jsModulesInfo.trackingEvents" :bundles="jsModulesInfo.bundles"></BundleListing>
            </b-tab>
            <!--
                TODO: Find a way of putting the number of scripts on the "Other" tab label.
                Tried binding (via :title) from a computed value. Value does get recomputed,
                but it seems like <b-tabs> is not picking up the recomputed value. I (TF) didn't
                investigate any more than that.
            -->
            <b-tab title="Other">
                <div class="no-jsmodules" v-if="noJSModulesInfo.length > 0">
                    <p class="lead">
                    The following JavaScript files are also loaded on this page, but do not expose any <code>js-modules</code> meta data.
                    </p>
                    <ol>
                        <li v-for="bundle in noJSModulesInfo" >{{bundle.script}}</li>
                    </ol>
                    This can simply be because these scripts are not <code>js-modules</code> compatible bundles, or because the bundles were
                    generated with an older version of <code><a href="https://www.npmjs.com/package/@jenkins-cd/js-builder" target="_blank">js-builder</a></code>.
                    <p/>
                    <b-alert show>
                        Version <code>0.0.54</code> (or greater) of <code><a href="https://www.npmjs.com/package/@jenkins-cd/js-builder" target="_blank">js-builder</a></code> must be used to generate all <code>js-modules</code> compatible bundles.
                        Bundles generated with an earlier version will not be analysable in these Developer tools.
                    </b-alert>
                </div>
                <div v-else>

                </div>
            </b-tab>
            <b-tab title="Raw">
                <Raw :trackingEvents="jsModulesInfo.trackingEvents" :bundles="jsModulesInfo.bundles"></Raw>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import bundles from '../bundles';
    import Alert from './Alert.vue'
    import BundleListing from './BundleListing.vue'
    import Raw from './Raw.vue'

    export default {
        components: {
            Alert, BundleListing, Raw
        },
        props: {
            loadJsModulesInfo: Function
        },
        data () {
            const data = {
                jsModulesInfo: {
                    bundles: [],
                    trackingEvents: []
                }
            };

            this.loadJsModulesInfo(function (jsModulesInfo) {
                if (jsModulesInfo) {
                    bundles.trackingEvents(jsModulesInfo.trackingEvents);
                    bundles.bundles(jsModulesInfo.bundles);
                }
                data.jsModulesInfo = jsModulesInfo;
            });

            return data;
        },
        methods: {
        },
        computed: {
            noJSModulesInfo: function() {
                return this.jsModulesInfo.bundles.filter(function (bundle) {
                    return bundle.status === 404;
                });
            }
        }
    }
</script>

<style>
    .jsModulesInfo {
        padding: 20px;
        font-size: 0.8rem;
    }
    .jsModulesInfo .no-jsmodules {
        padding: 20px;
    }
    .tabs li.nav-item:last-child .nav-link {
        opacity: 0.4;
    }
    .tabs li.nav-item:last-child .nav-link.active {
        opacity: 1.0;
    }
</style>