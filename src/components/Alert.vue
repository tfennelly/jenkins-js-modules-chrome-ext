<template>
    <div :class="alertClasses" role="alert" v-if="!dismiss">
        <button v-if="dismissible" type="button" class="close" data-dismiss="alert" aria-label="Close" @click="dismiss=true">
            <span aria-hidden="true">x</span>
        </button>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            type: String,
            dismissible: Boolean
        },
        data: function() {
            return {
                dismiss: false
            };
        },
        computed: {
            alertClasses: function() {
                return `alert alert-${this.type} ${this.dismissible?'alert-dismissible':''}`;
            }
        }
    }
</script>

<style>
    .alert-dismissible button span {
        font-size: 1.3rem;
        vertical-align: top;
    }
</style>