<template>
    <div :class="classNames">
        <fieldset>
            <legend>{{trimmedModuleName}}</legend>
            <table id="overview-table">
                <tr v-if="moduleDef.stubbed">
                    <td title="This module is imported from another bundle i.e. its code is not inlined in this bundle.">Imported From</td>
                    <td>
                        <code>{{importedFrom}}</code>, <span title="The bundle that exports the module being imported">which is exported by the <BundleLink :whoExports="moduleDef.stubbed.importModule" /> bundle</span>
                    </td>
                </tr>
                <tr v-else>
                    <td title="The NPM package from which the module code was inlined">Inlined From</td>
                    <td>
                        <code>{{moduleDef.packageInfo.name}}@{{moduleDef.packageInfo.version}}</code>
                        <span v-if="npmPackageRepo">(<a :href="npmPackageRepo" target="_blank">repo</a>)</span>
                    </td>
                </tr>
                <tr>
                    <td title="Source code size">Source size</td>
                    <td>
                        {{moduleDef.size}}
                    </td>
                </tr>
                <tr v-if="moduleErrors.length > 0">
                    <td colspan="2" class="errors">
                        <div v-for="error in moduleErrors">
                            <i class="fa fa-times error" aria-hidden="true"></i>
                            {{error.summary}}
                            <Info placement="top">
                                <div class="label">{{error.label}}</div>
                                <div>
                                    <hr/>
                                    {{error.detail}}
                                </div>
                                <div>
                                    <hr/>
                                    <a :href="problemDocLink(error)" target="_blank">more</a>
                                </div>
                            </Info>
                        </div>
                    </td>
                </tr>
                <tr v-if="moduleWarnings.length > 0">
                    <td colspan="2" class="warnings">
                        <div v-for="warning in moduleWarnings">
                            <i class="fa fa-exclamation-triangle warning" aria-hidden="true"></i>
                            {{warning.summary}}
                            <Info placement="top">
                                <div class="label">{{warning.label}}</div>
                                <div>
                                    <hr/>
                                    {{warning.detail}}
                                </div>
                                <div>
                                    <hr/>
                                    <a :href="problemDocLink(warning)" target="_blank">more</a>
                                </div>
                            </Info>
                        </div>
                    </td>
                </tr>
            </table>
        </fieldset>

    </div>
</template>

<script>
    import _s from 'underscore.string';
    import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';

    export default {
        props: {
            moduleDef: Object,
            bundle: Object  // Instance of Bundle
        },
        computed: {
            moduleErrors: function() {
                return this.bundle.getErrors(this.moduleDef);
            },
            moduleWarnings: function() {
                var warnings = this.bundle.getWarnings(this.moduleDef);
                console.log(warnings);
                return warnings;
            },
            classNames: function() {
                if (this.moduleErrors.length > 0) {
                    return "moduleDef haserrors";
                } else if (this.moduleWarnings.length > 0) {
                    return "moduleDef haswarnings";
                }
                return "moduleDef";
            },
            trimmedModuleName: function() {
                return _s.ltrim(this.moduleDef.id, 'node_modules/');
            },
            npmPackageRepo: function() {
                const packageInfo = this.moduleDef.packageInfo;
                if (packageInfo.repository && packageInfo.repository.type === 'git') {
                    let repoUrl = _s.ltrim(packageInfo.repository.url, 'git+');
                    if (repoUrl.startsWith('ssh://')) {
                        repoUrl = 'https://' + _s.ltrim(repoUrl, 'ssh://');
                    }
                    return repoUrl;
                }
                return undefined;
            },
            importedFrom: function() {
                if (this.moduleDef.stubbed) {
                    const moduleSpec = new ModuleSpec(this.moduleDef.stubbed.importModule);
                    return `${moduleSpec.moduleName}@${moduleSpec.moduleVersion}`;
                }
                return undefined;
            }
        },
        methods: {
            problemDocLink: function(problemDesc) {
                return `https://github.com/tfennelly/jenkins-js-modules-chrome-ext/blob/master/PROBLEM_DESC.md#${problemDesc.label.toLowerCase()}`;
            }
        }
    }
</script>

<style>
    .moduleDef {
        margin-bottom: 10px;
        padding-left: 8px;
    }
    .moduleDef #overview-table td:first-child {
        width: 150px;
        padding-right: 10px;
        font-weight: bold;
        opacity: 0.6;
    }

    .moduleDef legend {
        font-size: 1.1rem;
    }
    
    .moduleDef .errors, .moduleDef .warnings {
        opacity: 1.0 !important;
    }

    .moduleDef .errors .info, .moduleDef .warnings .info {
        margin-left: 5px;
    }

    .moduleDef .errors .info .label, .moduleDef .warnings .info .label {
    }
    
    .moduleDef.haswarnings {
        border-left: 3px solid #f0ad4e;
        padding-left: 5px;
    }

    .moduleDef.haserrors {
        border-left: 3px solid #d9534f;
        padding-left: 5px;
    }

    .moduleDef .error, .moduleDef .warning {
        margin-right: 5px;
    }
    
    .moduleDef .error, .moduleDef .errors .info .label {
        color: #d9534f;
    }

    .moduleDef .warning, .moduleDef .warnings .info .label {
        color: #f0ad4e;
    }
    
</style>