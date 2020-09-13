<template>
    <div class="periods">
        <div><span class="number">l.</span></div>
        <div v-for="(period, index) in periods"
             :key="period[0]">
            <span class="number">{{index+1}}</span>
            <span>{{period[0]}}<br>{{period[1]}}</span>
        </div>
    </div>
</template>

<script>
    import {getPeriods} from '../misc/user';

    export default {
        name: 'PeriodsColumn',
        data() {
            return {
                periods: getPeriods(),
            };
        }
    };
</script>

<style scoped>
    .periods {
        position: sticky;
        left: -20px;
        box-shadow: 1px 0 4px 0 rgba(0,0,0,.6);
        transition: left .2s;
    }
    .periods:hover {
        left: 0;
    }

    .periods > * {
        box-sizing: border-box;
        padding: 2px 4px;
        width: 80px;
        height: var(--row-height);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--font-secondary-color);
        background-color: var(--mid-background-color);
        border-bottom: 1px solid var(--font-tetrary-color);
    }
    .periods>*>* {
        flex: 1;
    }
    .number {
        max-width: 20px;
        font-size: 1.3em;
        font-weight: bold;
        display: inline-block;
        color: var(--font-primary-color);
    }
</style>
