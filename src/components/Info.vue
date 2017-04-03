<template>
    <div class="info">
        <b-popover :triggers="trigger" :placement="placement">
            <b-button size="sm" variant="outline-success">
                <i class="fa fa-info"></i><span v-if="label">: {{label}}</span>
            </b-button>
            <span slot="content">
                <slot></slot>
            </span>
        </b-popover>
    </div>
</template>

<script>
    export default {
        props: {
            label: String,
            trigger: {
                type: String,
                default: 'click'
            },
            placement: {
                type: String,
                default: 'top'
            }
        }
    }
</script>

<style>
    .info {
        display: inline-block;
    }
</style>