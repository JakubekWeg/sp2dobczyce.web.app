<template>
    <span class="icon material-icon" @click="$emit('click')">{{name}}</span>
</template>

<script>
    export default {
        name: 'Icon',
        props: {
            name: {
                type: String,
                required: true,
            }
        }
    };
</script>

<!--suppress CssNoGenericFontName, CssUnknownTarget -->
<style>
    /* fallback */
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(/fonts/material-icons.woff2) format('woff2');
    }

    .material-icon {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        grid-area: icon;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
    }
</style>
