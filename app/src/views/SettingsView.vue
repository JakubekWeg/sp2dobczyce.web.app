<template>
    <div class="settings">
        <Preference icon="school"
                    title="Aplikacja jest używana przez"
                    summary="Tryb korzystania z aplikacji: uczeń lub nauczyciel"
                    :value="mode === 'student' ? 'uczeń' : 'nauczyciel'"
                    @click="modeClicked"/>

        <Preference icon="people"
                    title="Moja nazwisko"
                    summary="Wybierz swoje nazwisko, aby odbierać powiadomienia o zastępstwach dla Ciebie"
                    :value="mySurname"
                    @click="showDialog = 'teacher'"
                    v-if="mode === 'teacher'"/>

        <Preference icon="people"
                    title="Moja klasa"
                    summary="Możesz dostawać powiadomienia gdy dostępne są nowe zastępstwa dla twojej klasy"
                    :value="myClass"
                    @click="showDialog = 'class'"
                    v-if="mode === 'student'"/>

        <Preference icon="mood"
                    title="Mój numerek"
                    summary="Możesz dostawać powiadomienia o szczęśliwym numerku"
                    :value="myNumber"
                    @click="showDialog = 'number'"
                    v-if="mode === 'student'"/>

        <Preference icon="style"
                    title="Motyw aplikacji"
                    summary="Ciemny lub jasny - jak wolisz"
                    :value="userTheme ? (userTheme === 'dark' ? '  ciemny' : '  jasny') : 'automat'"
                    @click="themeClicked"/>

        <Preference icon="notifications"
                    :value="notificationsValue"
                    title="Powiadomienia"
                    summary="Sprawdź czy dostaniesz jakieś"
                    to="/ustawienia/powiadomienia"/>

        <Preference icon="code"
                    external-link
                    title="Kod źródłowy"
                    summary="Gdyby ktoś chciał coś zmienić w tej aplikacji"
                    to="https://github.com/JakubekWeg/sp2dobczyce.web.app"/>

        <Preference icon="code"
                    title="Force periodic job"
                    v-if="isDev"
                    @click="forcePeriodicJob"/>


        <Dialog @close="dialogClosed" v-if="showDialog">
            <ChooseClassName v-if="showDialog === 'class'"
                             @input="dialogInput('setUserClass', $event)"/>
            <ChooseSurnameDialog v-if="showDialog === 'teacher'"
                                 @input="dialogInput('setUserSurname', $event)"/>
            <ChooseNumberDialog v-if="showDialog === 'number'"
                                @input="dialogInput('setUserNumber', $event)"/>
        </Dialog>
    </div>
</template>

<script>
    import Preference from '../components/Preference';
    import Dialog from '../components/Dialog';
    import ChooseClassName from '../components/ChooseClassName';
    import ChooseSurnameDialog from '../components/ChooseSurnameDialog';
    import ChooseNumberDialog from '../components/ChooseNumberDialog';
    import {functions} from '../misc/firebase';

    export default {
        name: 'SettingsView',
        components: {ChooseNumberDialog, ChooseSurnameDialog, ChooseClassName, Dialog, Preference},
        methods: {
            modeClicked() {
                this.$store.dispatch('toggleAppMode');
            },
            dialogInput(name, value) {
                this.$store.commit(name, value);
            },
            dialogClosed() {
                this.showDialog = false;
            },
            themeClicked() {
                this.$store.dispatch('toggleUserTheme');
            },
            forcePeriodicJob() {
                functions.httpsCallable('triggerPeriodicSync')().catch(e => alert(e.message));
            }
        },
        data() {
            return {
                showDialog: null,
                isDev: location.hostname === 'localhost'
            };
        },
        computed: {
            mode() { return this.$store.state.appMode;},
            myClass() { return this.$store.state.userClass;},
            mySurname() { return this.$store.state.userSurname;},
            myNumber() { return `${this.$store.state.userNumber || ''}`;},
            userTheme() { return this.$store.state.userTheme;},
            notificationsValue() { return this.$store.getters.hasNotificationPermission ? 'włączone' : 'wyłączone';},
        },
    };
</script>

<style scoped>

</style>
