<template>
    <div class="notification-icon">
        <Icon :name="active ? 'notifications_active' : 'notification_important'"/>
    </div>
</template>

<script>
    import Icon from './Icon';
    export default {
        name: 'NotificationIcon',
        components: {Icon},
        props: {
            active: Boolean
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>

    .notification-icon {
        --size: 80px;
        width: var(--size);
        height: var(--size);
        display: grid;
        place-content: center;
        background-color: var(--primary-color);
        color: var(--on-primary-color);
        border-radius: 50%;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.7);
        cursor: pointer;
        transition: transform .2s;
    }
    .notification-icon:hover {
        transform: scale(1.05);
    }

    .notification-icon .icon {
        font-size: calc(0.8 * var(--size));
    }
</style>
