<template>
    <div>
        <!--
        Add all the things before the component.
        See webpack.config.js
        -->
        <link href="/css/bootstrap.css" rel="stylesheet" type="text/css" />

        <!--
        And the component will go in the slot.
        -->
        <slot></slot>
    </div>
</template>