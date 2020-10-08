import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/performance';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/analytics';

import {delay} from './user';
import store from './state';
import router from './router';

firebase.initializeApp(JSON.parse(atob("eyJhcGlLZXkiOiJBSXphU3lETlFUQ2phTUN4SVVtbTFSdkVUWmVCS3VwYU02MTVaeUEiLCJhdXRoRG9tYWluIjoic3AyZG9iY3p5Y2UuZmlyZWJhc2VhcHAuY29tIiwiZGF0YWJhc2VVUkwiOiJodHRwczovL3NwMmRvYmN6eWNlLmZpcmViYXNlaW8uY29tIiwicHJvamVjdElkIjoic3AyZG9iY3p5Y2UiLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjQ0NjU1OTE2MjM4MSIsImFwcElkIjoiMTo0NDY1NTkxNjIzODE6d2ViOmE0ZDYzOGQ0ZTU4NzJhMTBjOTg1NDQiLCJtZWFzdXJlbWVudElkIjoiRy00RE5ZRFA1TVJIIn0=")));

export const firestore = firebase.firestore();
export const functions = firebase.functions();
export const performance = firebase.performance();
export const messaging = firebase.messaging();
export const analytics = firebase.analytics();

if (location.hostname === 'localhost') {
    firestore.settings({
        host: 'localhost:8080',
        ssl: false
    });

    functions.useFunctionsEmulator('http://localhost:5001');

    performance.dataCollectionEnabled = false;
    performance.instrumentationEnabled = false

    analytics.setAnalyticsCollectionEnabled(false);
}

firestore.enablePersistence({synchronizeTabs: true}).catch(e => console.error(e.message));

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
