<template>
    <div>
        <!--
        Add all the things before the component.
        See webpack.config.js
        -->
        <link href="/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />
        <link href="/panel.css" rel="stylesheet" type="text/css" />

        <!--
        And the component will go in the slot.
        -->
        <slot></slot>
    </div>
</template>