<template>
    <div class="layout">
        <RecentTimetablesBar :selected="timetableId"/>
        <TimetablesListView v-if="!timetableId"/>
        <Timetable :object="timetableObject" v-else-if="timetableObject" :class="{'fade-out': loading}"/>
        <div class="timetable-not-exist" v-else-if="notFound">
            Taki plan nie istnieje
        </div>
        <div class="loading-timetable" v-else>
            Na pewno masz połączenie z internetem?
        </div>
    </div>
</template>

<script>
    import {firestore} from '../misc/firebase';
    import Timetable from '../components/Timetable';
    import RecentTimetablesBar from '../components/RecentTimetablesBar';
    import TimetablesListView from './TimetablesListView';

    export default {
        name: 'TimetableView',
        components: {TimetablesListView, RecentTimetablesBar, Timetable},
        data() {
            return {
                timetableId: null,
                timetableObject: null,
                notFound: false,
                loading: true
            };
        },
        methods: {
            onSnapshot(snap) {
                this.loading = false;
                this.notFound = !snap.exists && !snap.metadata.fromCache;
                this.timetableObject = snap.data();
                if (this.timetableObject) {
                    this.$store.commit('addToRecentViewedTimetables', this.timetableId);
                }
            },
            onTimetableIdChanged(id) {
                this.loading = true;
                if (!id)
                    id = this.$store.getters.userTimetableId;

                if (id) {
                    this.timetableId = id.toLowerCase();

                    if (this.sub)
                        this.sub();

                    this.sub = firestore
                        .collection('timetables')
                        .doc(this.timetableId)
                        .onSnapshot(this.onSnapshot);
                }
            }
        },
        watch: {
            '$route.params.id': function (id) {
                this.onTimetableIdChanged(id);
            }
        },
        created() {
            this.onTimetableIdChanged(this.$route.params.id);
        },
        destroyed() {
            if (this.sub)
                this.sub();
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .layout {
        background-color: var(--back-background-color);
    }

    .timetable-not-exist {
        height: 90%;
        display: grid;
        place-items: center;
        font-size: 2em;
    }


    .loading-timetable {
        opacity: 0;
        animation: FadeIn 2s both 5s;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 1.5em;
    }

    .fade-out {
        opacity: .1;
        pointer-events: none;
    }

</style>
