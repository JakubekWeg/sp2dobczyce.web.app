<template>
    <div class="page">
        <h1>Coś poszło nie tak</h1>
        <router-link to="/" class="exit-btn">Zabierz mnie stąd</router-link>
    </div>
</template>

<script>
    export default {
        name: 'NotFoundLayout'
    };
</script>

<style scoped>
    .page {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .exit-btn {
        padding: 8px 12px;
        border-radius: 12px;
        box-shadow: 1px 2px 4px 0 rgba(0,0,0,.7);
        background-color: var(--primary-color);
        font-weight: bold;
        color: var(--on-primary-color);
    }
</style>
