<template>
    <div class="info">
        <b-popover triggers="hover">
            <b-button size="sm" variant="outline-success">
                <i class="fa fa-info"></i>
            </b-button>
            <span slot="content">
                <slot></slot>
            </span>
        </b-popover>
    </div>
</template>

<script>
    export default {
    }
</script>

<style>
    .info {
        display: inline-block;
    }
</style>