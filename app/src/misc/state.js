import Vue from 'vue';
import VueX from 'vuex';

import 'es6-promise/auto';
import {messaging, sendTokenToServer} from './firebase';


Vue.use(VueX);

const setLocalStorage = (key, value) => value ? localStorage.setItem(key, `${value}`) : localStorage.removeItem(key);

const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const timetableIdRegex = /\d\wsp (\d\w)|(\d\w)|.*\((\p{L}+)\)/iu;
export const getTimetableIdByName = (name) => {
    if (!name) return null;
    const result = timetableIdRegex.exec(name.toLowerCase());
    if (!result) throw new Error('Invalid timetable name ' + name);
    return result[1] || result[2] || result[3];
};

const store = new VueX.Store({
    state: {
        appMode: localStorage.getItem('mode') || 'student',
        userSurname: localStorage.getItem('surname'),
        userClass: localStorage.getItem('class'),
        recentTimetableIds: JSON.parse(localStorage.getItem('recentViewedTimetables') || '[]'),
        savedRecentTimetableIds: JSON.parse(localStorage.getItem('recentViewedTimetables') || '[]'),
        userNumber: +localStorage.getItem('number') || null,
        systemDarkTheme: darkThemeQuery.matches,
        userTheme: localStorage.getItem('theme') || null,
        notificationPermission: 'Notification' in window ? Notification.permission : 'not-supported',
        everGivenNotificationPermission: !!localStorage.getItem('everNotification'),
        installEvent: null,
        installEventUsed: !!localStorage.getItem('installEventUsed'),
    },
    mutations: {
        setInstallEventUsed(state, used) {
            state.installEventUsed = !!used;
            setLocalStorage('installEventUsed', used ? 'yes' : null);
        },
        setInstallEvent(state, event) {
            if (event)
                event.preventDefault();
            if (state.installEventUsed) return;
            state.installEvent = event;
        },
        updateNotificationPermission(state) {
            state.notificationPermission = 'not-supported';
            if (Notification.permission) setLocalStorage('everNotification', 'true');
            if (state.notificationPermission === Notification.permission) return;
            state.notificationPermission = Notification.permission;
            sendTokenToServer();
        },
        setSystemDarkTheme(state, matches) {
            state.systemDarkTheme = !!matches;
        },
        setUserDarkTheme(state, mode) {
            if (mode !== 'dark' && mode !== 'light')
                mode = null;
            state.userTheme = mode;
            setLocalStorage('theme', mode);
        },
        setAppMode(state, mode) {
            if (!mode) mode = 'student';
            if (mode !== 'student' && mode !== 'teacher')
                throw new Error('Invalid app mode ' + mode);
            state.appMode = mode;
            setLocalStorage('mode', mode);
        },
        setUserSurname(state, value) {
            state.userSurname = value;
            setLocalStorage('surname', value);
            sendTokenToServer();
        },
        setUserClass(state, value) {
            state.userClass = value;
            setLocalStorage('class', value);
            sendTokenToServer();
        },
        setUserNumber(state, value) {
            state.userNumber = +value || null;
            setLocalStorage('number', state.userNumber);
            sendTokenToServer();
        },
        addToRecentViewedTimetables(state, id) {
            if (!id) return;
            id = id.toUpperCase();
            const index = state.savedRecentTimetableIds.indexOf(id);
            if (index < 0) {
                state.recentTimetableIds.unshift(id);
            } else {
                state.savedRecentTimetableIds.splice(index, 1);
            }
            state.savedRecentTimetableIds.unshift(id);
            setLocalStorage('recentViewedTimetables', JSON.stringify(state.savedRecentTimetableIds));
        },
    },
    actions: {
        useInstallEvent({commit}) {
            commit('setInstallEventUsed', true);
            commit('setInstallEvent', null);
        },
        toggleUserTheme({commit, state}) {
            if (!state.userTheme)
                commit('setUserDarkTheme', 'light');
            else if (state.userTheme === 'light')
                commit('setUserDarkTheme', 'dark');
            else
                commit('setUserDarkTheme', null);
        },
        toggleAppMode({commit, state}) {
            commit('setUserSurname');
            commit('setUserClass');
            commit('setUserNumber');
            commit('setAppMode', state.appMode === 'student' ? 'teacher' : 'student');
        },
        askForNotifications({commit}) {
            return messaging.getToken()
                            .catch(e => console.error(e.message))
                            .finally(() => commit('updateNotificationPermission'));
        }
    },
    getters: {
        hasNotificationPermission({notificationPermission}) {
            return notificationPermission === 'granted';
        },
        effectiveTheme({userTheme, systemDarkTheme}) {
            switch (userTheme) {
                case 'light':
                    return 'light';
                case 'dark':
                    return 'dark';
                default:
                    return systemDarkTheme ? 'dark' : 'light';
            }
        },
        userTimetableId(state) {
            let name;
            switch (state.appMode) {
                case 'student': {
                    name = state.userClass;
                    break;
                }
                case 'teacher': {
                    name = state.userSurname;
                    break;
                }
            }
            return getTimetableIdByName(name);
        },
        userSubstituteTrigger(state) {
            switch (state.appMode) {
                case 'student': {
                    return state.userClass ? state.userClass.toLowerCase() : null;
                }
                case 'teacher': {
                    const t = state.userSurname;
                    if (t) {
                        const result = /\.([\p{L}-]+) /iu.exec(t);
                        if (result)
                            return result[1].toLowerCase();
                    }
                    break;
                }
            }
            return null;
        },
        lineAffectsChecker(state) {
            switch (state.appMode) {
                case 'student': {
                    const c = state.userClass;
                    if (c) return (line) => line.affects.includes(c);
                    break;
                }
                case 'teacher': {
                    const t = state.userSurname;
                    if (t) {
                        const result = /\.([\p{L}-]+) /iu.exec(t);
                        if (result) {
                            const id = result[1].toLowerCase();
                            return (line) => line.affects.includes(id);
                        }
                    }
                    break;
                }
            }
            return () => false;
        }
    }
});
export default store;

darkThemeQuery.onchange = ({matches}) => store.commit('setSystemDarkTheme', matches);

window.addEventListener('beforeinstallprompt', event => store.commit('setInstallEvent', event));
