<template>
    <header class="page-header">
        <router-link to="/">{{title}}</router-link>
    </header>
</template>

<script>
    export default {
        name: 'PageHeader',
        methods: {
            onRouteUpdate(route) {
                this.title = route.meta?.title || 'Zastępstwa';
            }
        },
        created() {
            this.onRouteUpdate(this.$route);
            this.$router.afterEach(this.onRouteUpdate)
        },
        data() {
            return {
                title: null,
            };
        }
    };
</script>

<style>
    header.page-header {
        z-index: 10;
        display: grid;
        place-items: center;
        background: var(--primary-color);
        color: var(--on-primary-color);
        padding: 8px;
        letter-spacing: 0.1em;
        font-weight: 600;
        font-size: 1.2em;
        box-shadow: 1px 0 6px 1px rgba(0,0,0,.7);
        height: 40px;
        box-sizing: border-box;
    }
</style>
