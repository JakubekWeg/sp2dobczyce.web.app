<template>
    <router-link v-if="to" :to="to" class="bar">
        <Icon :name="icon"/>
        <span>{{text}}</span>
    </router-link>
    <span @click="$emit('click')" v-else class="bar">
        <Icon :name="icon"/>
        <span>{{text}}</span>
    </span>
</template>

<script>
    import Icon from './Icon';

    export default {
        name: 'AllowNotificationsBar',
        components: {Icon},
        props: {
            icon: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            to: {
                type: String
            }
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .bar {
        position: relative;
        z-index: 9;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .5);
        background-color: var(--primary-color);
        color: var(--on-primary-color);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px;
        font-weight: bold;
        cursor: pointer;
    }

    @keyframes Blinking {
        from {
            opacity: .3;
        }
        to {
            opacity: 1;
        }
    }

    .icon {
        animation: Blinking 1s alternate-reverse infinite;
    }
</style>
