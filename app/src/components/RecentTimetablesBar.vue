<template>
    <div class="bar">
        <router-link v-for="id in recentIds"
              :key="id"
              :class="{selected: selectedUpper === id}"
              :to="'/plan-lekcji/' + id">
            <Icon v-if="usersId === id.toLowerCase()" name="star"/>
            <span>{{id}}</span>
        </router-link>
        <router-link to="/plan-lekcji/lista" class="right">
            <Icon name="more"/>
        </router-link>
    </div>
</template>

<script>
    import Icon from './Icon';

    export default {
        name: 'RecentTimetablesBar',
        components: {Icon},
        props: {
            selected: String
        },
        computed: {
            selectedUpper() {return this.selected ? this.selected.toUpperCase() : null;},
            recentIds() {return this.$store.state.recentTimetableIds;},
            usersId() {return this.$store.getters.userTimetableId;},
        },
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .bar {
        width: 100%;
        overflow-x: auto;
        position: relative;
        background-color: var(--front-background-color);
        z-index: 5;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .7);
        display: flex;
        padding: 2px;
        box-sizing: border-box;
        flex-flow: row nowrap;
    }

    .bar > * {
        margin: 4px;
        padding: 4px 8px;
        background-color: var(--mid-background-color);
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background-color .2s, color .2s;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.5);
    }

    .bar .icon {
        font-size: 18px;
        padding-right: 4px;
    }

    .selected {
        background-color: var(--primary-color);
        color: var(--on-primary-color);
    }
    .right {
        position: sticky;
        right: 0;
        justify-self: flex-end;
    }
</style>
