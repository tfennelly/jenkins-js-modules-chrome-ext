<template>
    <div class="moduleDef">
        <h6>{{trimmedModuleName}}</h6>
        <table id="overview-table">
            <tr>
                <td title="The NPM package from which the module was bundled">NPM Package</td>
                <td>
                    <code>{{moduleDef.packageInfo.name}}@{{moduleDef.packageInfo.version}}</code>
                    <span v-if="npmPackageRepo">(<a :href="npmPackageRepo" target="_blank">repo</a>)</span>
                </td>
            </tr>
        </table>

    </div>
</template>

<script>
    import _s from 'underscore.string';

    export default {
        props: {
            moduleDef: Object
        },
        computed: {
            trimmedModuleName: function() {
                return _s.ltrim(this.moduleDef.id, 'node_modules/');
            },
            npmPackageRepo: function() {
                const packageInfo = this.moduleDef.packageInfo;
                if (packageInfo.repository && packageInfo.repository.type === 'git') {
                    return _s.ltrim(packageInfo.repository.url, 'git+');
                }
                return undefined;
            }
        }
    }
</script>

<style>
    .moduleDef #overview-table td:first-child {
        padding-right: 10px;
        font-weight: bold;
    }

    .hint {
        opacity: 0.5;
    }
</style>