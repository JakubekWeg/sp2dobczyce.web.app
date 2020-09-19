<template>
    <nav>
        <router-link to="/" :class="{active: this.activeNavTab === 'home'}">
            <Icon name="home"/>
            <span>Zastępstwa</span>
        </router-link>
        <router-link to="/plan-lekcji" :class="{active: this.activeNavTab === 'plan'}">
            <Icon name="today"/>
            <span>Plan lekcji</span>
        </router-link>
        <router-link to="/kalkulator" :class="{active: this.activeNavTab === 'calc'}">
            <Icon name="functions"/>
            <span>Kalkulator</span>
        </router-link>
        <router-link to="/ustawienia" :class="{active: this.activeNavTab === 'settings'}">
            <Icon name="settings"/>
            <span>Preferencje</span>
        </router-link>
    </nav>
</template>
<script>
    import Icon from './Icon';

    export default {
        name: 'PageNavigation',
        components: {Icon},
        methods: {
            onRouteUpdate(route) {
                this.activeNavTab = route.meta?.navTab;
            }
        },
        created() {
            this.onRouteUpdate(this.$route);
            this.$router.afterEach(this.onRouteUpdate);
        },
        data() {
            return {
                activeNavTab: null,
            };
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style>
    nav {
        z-index: 10;
        background: var(--primary-color);
        overflow: hidden;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, .7);
        color: var(--on-primary-secondary-color);
        font-size: .75em;
    }

    nav > * {
        min-width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    nav .active {
        color: var(--on-primary-color);
    }

    nav .icon {
        font-size: 28px;
        padding: 0;
    }

    span {
        display: block;
    }
</style>
