import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/performance';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/remote-config';
import 'firebase/analytics';

import {delay} from './user';
import store from './state';
import router from './router';

firebase.initializeApp({
    apiKey: 'AIzaSyDNQTCjaMCxIUmm1RvETZeBKupaM615ZyA',
    authDomain: 'sp2dobczyce.firebaseapp.com',
    databaseURL: 'https://sp2dobczyce.firebaseio.com',
    projectId: 'sp2dobczyce',
    storageBucket: 'sp2dobczyce.appspot.com',
    messagingSenderId: '446559162381',
    appId: '1:446559162381:web:a4d638d4e5872a10c98544',
    measurementId: 'G-4DNYDP5MRH'
});

export const firestore = firebase.firestore();
export const functions = firebase.functions();
export const config = firebase.remoteConfig();
export const performance = firebase.performance();
export const messaging = firebase.messaging();
export const analytics = firebase.analytics();

config.settings = {
    fetchTimeoutMillis: 60000,
    minimumFetchIntervalMillis: 24 * 60 * 60 * 1000,
};
config.defaultConfig = {
    maxLuckyNumber: 30
};


if (location.hostname === 'localhost') {
    firestore.settings({
        host: 'localhost:8080',
        ssl: false
    });

    functions.useFunctionsEmulator('http://localhost:5001');

    performance.dataCollectionEnabled = false;
    performance.instrumentationEnabled = false

    analytics.setAnalyticsCollectionEnabled(false);
} else
    config.fetchAndActivate().then(e => e && console.info('Activated new config'));

firestore.enablePersistence().catch(e => console.error(e.message));


let sending = false;
export const sendTokenToServer = (onlyIfDifferent) => {
    if ('Notification' in window && Notification.permission !== 'granted') return;
    if (sending) return;
    sending = true;
    (async () => {
        await delay(200);
        try {
            const token = await messaging.getToken();
            const lastToken = localStorage.getItem('lastFcmToken');
            if (token !== lastToken && lastToken) {
                firestore.collection('tokens').doc(lastToken).delete().catch(e => console.error(e.message));
            }
            localStorage.setItem('lastFcmToken', token);
            if (onlyIfDifferent) return;

            const obj = {
                triggers: [],
                modified: firebase.firestore.FieldValue.serverTimestamp()
            };
            const trigger = store.getters.userSubstituteTrigger;
            if (trigger) obj.triggers.push(trigger);

            const number = store.state.userNumber;
            if (number) obj.triggers.push(`${number}`);

            await firestore
                .collection('tokens')
                .doc(token)
                .set(obj);
        } catch (e) {
            console.error(e.message);
        } finally {
            sending = false;
        }
    })();
};

if ('Notification' in window && Notification.permission === 'granted') {
    sendTokenToServer(true);
}

router.afterEach(to => {
    const title = to.meta?.title;
    if (title)
        analytics.setCurrentScreen(title);
});
