<template>
    <div class="timetable">
        <PeriodsColumn/>
        <TimetableDay v-for="(day, index) in days"
                      :ref="'day_' + index"
                      :key="index"
                      :lessons="lessons[index]"
                      :day="day"/>
    </div>
</template>

<script>
    import {getPeriodsCount, getWeekDays} from '../misc/user';
    import PeriodsColumn from './PeriodsColumn';
    import TimetableDay from './TimetableDay';

    export default {
        name: 'Timetable',
        components: {TimetableDay, PeriodsColumn},
        props: {
            object: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                lessons: null,
                periodsCount: getPeriodsCount(),
                days: getWeekDays().slice(1, -1),
            };
        },
        watch: {
            object(obj) {
                this.updateObject(obj);
            }
        },
        methods: {
            updateObject(obj) {
                const lessons = [];
                for (const l of obj.lessons) {
                    let day = lessons[l.day];
                    if (!day) {
                        day = lessons[l.day] = [];
                        day.length = this.periodsCount;
                    }
                    day[l.number] = l.data;
                }
                this.lessons = lessons;
                setTimeout(this.scrollToInterestingDay, 300)
            },
            scrollToInterestingDay() {
                const now = new Date()
                const day = now.getDay()
                if (day >= 1 && day <= 4) {
                    const hour = now.getHours()
                    let scrollTo = (hour >= 16) ? day : day - 1
                    const dayRef = this.$refs['day_' + scrollTo]
                    if (!dayRef || !dayRef[0]) return
                    dayRef[0].$el.scrollIntoView();
                }
            }
        },
        created() {
            this.updateObject(this.object);
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .timetable {
        animation: FadeIn .3s both;
        width: 100%;
        box-sizing: border-box;
        background-color: var(--back-background-color);
        --row-height: 50px;
        border-bottom: 1px solid var(--font-tetrary-color);
        display: flex;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        scroll-snap-stop: always;
        scroll-behavior: smooth;
        transition: opacity .2s;
    }


</style>
