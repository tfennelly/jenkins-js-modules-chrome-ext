<template>
    <Page>
        <div id="Panel">
            <LogCategories :loadCategoriesFunc="loadCategoriesFunc" :setCategoryLogLevelFunc="setCategoryLogLevelFunc"></LogCategories>
        </div>
    </Page>
</template>

<script>
    import LogCategories from '../src/components/LogCategories.vue'

    export default {
        name: 'Panel',
        components: {
            LogCategories
        },
        methods: {
            loadCategoriesFunc: function(callback) {
                callback({
                    "count": 19,
                    "categories": [
                        {
                            "category": "io.jenkins.blueocean.core.LiveStatusIndicator",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.core.ParametersRunButton",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.core.TimeHarmonizer",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.InputStep",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.LogConsole",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.PipelinePage",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.PipelineRunGraph",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.RunDetails",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.RunDetailsPipeline",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.Runs",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.Step",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.artifacts",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.dashboard.harmonizeTimes",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.github-pipeline",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.i18n",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.i18n.startup",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.jsextensions.ExtensionStore",
                            "logLevel": "_"
                        },
                        {
                            "category": "io.jenkins.blueocean.web.routing",
                            "logLevel": "_"
                        },
                        {
                            "category": "org.jenkinsci.sse",
                            "logLevel": "_"
                        }
                    ],
                    "_$eventId": "log.categories"
                });
            },
            setCategoryLogLevelFunc: function(category, logLevel) {
                console.log(`*** Set ${category} to ${logLevel}`);
            }
        }
    }
</script>