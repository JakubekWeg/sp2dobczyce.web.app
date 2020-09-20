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
        width: 40px;
        height: 40px;
        display: grid;
        place-content: center;
        overflow: hidden;
        border-radius: 50%;
        transition: background-color .3s;
        cursor: pointer;
        position: fixed;
        right: 8px;
        bottom: calc(48px + 8px);
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .5);
    }

    .fab:hover {
        background: var(--primary-darker-color);
    }

    .fab .icon {
        font-size: 32px;
    }
</style>
