<template>
    <div class="home">
        <AllowNotificationsBar v-if="showNotificationBar && !everGivenNotificationPermission"
                               to="/ustawienia/powiadomienia"
                               icon="notifications"
                               text="Włącz powiadomienia o zastępstwach"/>

        <AllowNotificationsBar v-else-if="installEvent"
                               icon="get_app"
                               @click="installClicked"
                               text="Dodaj na pulpit"/>

        <div class="top-space"></div>
        <LuckyNumbersComponent/>
        <div v-if="data && data.length" class="sections">
            <SectionContainer v-for="item in data" :key="item.id" :obj="item"/>
            <br>
        </div>
        <div v-else-if="data" class="no-substitutes">
            <p>Brak zastępstw <br>Hurra!</p>
        </div>
    </div>
</template>

<script>
    import {firestore} from '../misc/firebase';
    import SectionContainer from '../components/SectionContainer';
    import LuckyNumbersComponent from './LuckyNumbersComponent';
    import AllowNotificationsBar from '../components/AllowNotificationsBar';

    export default {
        name: 'MainPage',
        components: {AllowNotificationsBar, LuckyNumbersComponent, SectionContainer},
        data() {
            return {
                data: null,
            };
        },
        computed: {
            showNotificationBar() { return this.$store.state.notificationPermission === 'default';},
            installEvent() { return this.$store.state.installEvent;},
            everGivenNotificationPermission() { return this.$store.state.everGivenNotificationPermission; }
        },
        methods: {
            onNewsUpdated(snap) {
                this.data = snap.docs.map(e => ({...e.data(), id: e.id}));
            },
            installClicked() {
                this.installEvent.prompt();
                this.$store.dispatch('useInstallEvent')
            }
        },
        created() {
            this.unSub1 = firestore
                .collection('substitutes')
                .orderBy('date', 'desc')
                .onSnapshot(this.onNewsUpdated);
        },
        destroyed() {
            this.unSub1();
        }
    };
</script>
<style scoped>
    .no-substitutes {
        height: 100%;
        display: grid;
        place-items: center;
    }

    .sections {
        animation: FadeIn .3s .05s both;
    }

    .top-space {
        height: 8px;
    }
</style>
