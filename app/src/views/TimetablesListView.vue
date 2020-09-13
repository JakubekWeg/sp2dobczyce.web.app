<template>
    <div class="view">
        <article class="recent" v-if="recent && recent.length">
            <h2>Ostatnie</h2>
            <div>
                <router-link :to="'/plan-lekcji/' + v" :key="v" v-for="v in recent">{{v}}</router-link>
            </div>
        </article>
        <article class="classes">
            <h2>Klasy</h2>
            <div>
                <router-link :to="'/plan-lekcji/' + v" :key="v" v-for="v in classes">{{v}}</router-link>
            </div>
        </article>
        <article class="teachers">
            <h2>Nauczyciele</h2>
            <div>
                <router-link :to="'/plan-lekcji/' + v[1]" :key="v[1]" v-for="v in teachers">{{v[0]}}</router-link>
            </div>
        </article>
    </div>
</template>

<script>
    import {firestore} from '../misc/firebase';
    import {getTimetableIdByName} from '../misc/state';

    export default {
        name: 'TimetablesListView',
        computed: {
            recent() {return this.$store.state.recentTimetableIds;}
        },
        data() {
            return {
                classes: [],
                teachers: [],
            };
        },
        created() {
            this.unsub = firestore
                .collection('values')
                .doc('timetables')
                .onSnapshot(snap => {
                    const data = snap.data();
                    this.classes = data.classes.map(e => e.name);
                    this.teachers = data.teachers.map(e => [e.name, getTimetableIdByName(e.name)]);
                });
        }
        ,
        destroyed() {
            this.unsub();
        }
    };
</script>

<style scoped>
    .view {
        animation: FadeIn .3s both .3s;
        display: flex;
        justify-content: center;
        flex-flow: row wrap;
        align-items: start;
        align-content: start;
    }

    article {
        background-color: var(--front-background-color);
        border-radius: 4px;
        box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, .7);
        min-width: 180px;
        max-width: 500px;
        overflow: hidden;
        padding: 8px;
        margin: 8px;
    }
    article div {
        margin-top: 4px;
        display: flex;
        flex-flow: row wrap;
        align-content: start;
        align-items: start;
    }
    article div>* {
        padding: 4px;
        margin: 4px;
        border-radius: 4px;
        border: 1px solid var(--font-tetrary-color);
        transition: background-color .3s;
    }
    article div>:hover {
        background-color: var(--mid-background-color);
    }
    h2 {
        margin: 4px;

    }
</style>
