<template>
    <div class="classes">
        <span v-for="n in numbers" :key="n" @click="clicked(n)" :class="{selected: n === selected}">{{n}}</span>
    </div>
</template>

<script>

    export default {
        name: 'ChooseNumberDialog',
        data() {
            return {
                numbers: null,
            };
        },
        methods: {
            clicked(which) {
                this.$emit('input', which);
                this.$parent.$emit('close-request');
            },
        },
        computed: {
            selected() {return this.$store.state.userNumber;}
        },
        created() {
            const max = 30;
            const numbers = [];
            for (let i = 1; i <= max; i++)
                numbers.push(i);
            this.numbers = numbers;
        },
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .classes {
        padding: 8px;
        max-width: 300px;
        text-transform: uppercase;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-content: center;
    }

    .classes > * {
        min-width: 20px;
        cursor: pointer;
        margin: 2px 4px;
        padding: 6px;
        border: 1px solid var(--font-tetrary-color);
        border-radius: 8px;
    }

    .selected {
        background-color: var(--primary-color);
        color: var(--on-primary-color);
    }
</style>
