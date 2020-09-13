<template>
    <div id="app" :class="{dark: isDarkTheme}">
        <PageHeader/>
        <main class="app-content">
            <transition
                    name="fade"
                    mode="out-in">
                <router-view/>
            </transition>
        </main>
        <PageNavigation/>
    </div>
</template>
<script>
    import PageHeader from './components/PageHeader';
    import PageNavigation from './components/PageNavigation';

    export default {
        components: {PageNavigation, PageHeader},
        computed: {
            isDarkTheme() { return this.$store.getters.effectiveTheme === 'dark';},
        },
    };
</script>
<!--suppress CssUnusedSymbol -->
<style>
    :root {
        --primary-color: #4150b6;
        --on-primary-color: #eaebf5;
        --on-primary-secondary-color: #bec3e2;
        --back-background-color: #d6d6d6;
        --lighter-back-background-color: #dfdfdf;
        --mid-background-color: #f2f2f2;
        --front-background-color: #fff;
        --font-primary-color: #111;
        --font-secondary-color: #444;
        --font-tetrary-color: #99999988;
        color: #2c3e50;
    }

    #app.dark {
        --back-background-color: #050505;
        --lighter-back-background-color: #171717;
        --mid-background-color: #2a2828;
        --front-background-color: #212020;
        --font-primary-color: #dcddde;
        --font-secondary-color: #c9c9c9;
        --font-tetrary-color: #99999988;
        color: #a3adb6;
    }

    body {
        background: #000;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        -webkit-tap-highlight-color: transparent;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        padding: 0;
        margin: 0;
    }


    a {
        color: inherit;
        text-decoration: none;
    }


    a, label, button {
        outline: 0;
    }

    a:active, label:active {
        background: initial;
    }

    #app {
        background: var(--back-background-color);
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: 40px auto 48px;
    }

    .app-content {
        overflow-x: auto;
        height: 100%;
    }

    .app-content > * {
        margin: 0;
        height: 100%;
    }

    @keyframes FadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .fade-leave-active {
        transition: opacity .2s ease;
    }

    .fade-enter-active {
        transition: opacity .3s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0
    }

</style>
