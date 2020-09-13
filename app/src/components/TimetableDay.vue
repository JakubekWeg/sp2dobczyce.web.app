<template>
    <div class="day">
        <div class="day-name"><span>{{day}}</span></div>
        <Lesson :obj="lesson" v-for="(lesson, index) in lessons.slice(1)" :key="index"/>
    </div>
</template>

<script>
    import Lesson from './Lesson';

    export default {
        name: 'TimetableDay',
        components: {Lesson},
        props: {
            day: {
                required: true,
                type: String
            },
            lessons: {required: true}
        },
        created() {
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .lesson, .empty, .day-name {
        height: var(--row-height);
        box-sizing: border-box;
        padding: 0 8px;
        border-bottom: 1px solid var(--font-tetrary-color);
    }

    .lesson {
        background-color: var(--lighter-back-background-color);
    }

    .day {
        scroll-snap-align: end;
        scroll-snap-stop: always;
        min-width: 180px;
        scroll-margin: 10px;
        border-right: 1px solid var(--font-tetrary-color);
    }

    @media screen and (min-width: 430px) {
        .day {
            flex: 1;
        }
    }

    @media screen and (max-width: 430px) {
        .day {
            min-width: calc(100vw - 85px);
        }
    }

    .day-name {
        background-color: var(--mid-background-color);
        color: var(--font-primary-color);
        display: grid;
        place-items: center;
        font-weight: bold;
    }
</style>
