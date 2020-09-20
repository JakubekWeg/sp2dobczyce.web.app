<template>
    <button class="fab" @click="$emit('click')">
        <!--        {{icon}}-->
        <Icon :name="icon"/>
    </button>
</template>

<script>

    import Icon from './Icon';

    export default {
        name: 'FloatingActionButton',
        components: {Icon},
        props: {
            icon: {
                type: String,
                required: true
            },
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style>
    .fab {
        background: var(--primary-color);
        color: var(--on-primary-color);
        border: none;
        width: 52px;
        height: 52px;
        display: grid;
        place-content: center;
        overflow: hidden;
        border-radius: 50%;
        transition: background-color .3s;
        cursor: pointer;
        position: fixed;
        right: 12px;
        bottom: calc(48px + 12px);
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .5);
    }

    .fab:hover {
        background: var(--primary-darker-color);
    }

    .fab .icon {
        font-size: 48px;
    }
</style>
