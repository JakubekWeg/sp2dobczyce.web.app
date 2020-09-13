<template>
    <div class="layout" :class="{asking: isAsking}">
        <br>
        <NotificationIcon @click.native="requestPermission" :active="hasPermission"/>
        <h2 @click="requestPermission" v-if="!hasPermission">{{disabledNotificationText}}</h2>
        <div @click="requestPermission" v-if="permission === 'denied'">
            <h2>Dostęp został zablokowany</h2>
            <h5>Sprawdź ustawienia swojej przeglądarki, aby zezwolić na odbieranie powiadomień</h5>
        </div>
        <h3 @click="requestPermission" v-if="permission === 'default'">{{clickToEnableText}}</h3>
        <h2 v-if="hasPermission">{{enabledNotificationsText}}</h2>
        <button v-if="hasPermission" class="test-btn" @click="testNotification">Przetestuj</button>

        <p v-if="hasPermission">{{aboutNotificationsText}}</p>

        <router-link v-if="hasPermission" to="/ustawienia" class="link-to-settings">Ustawienia</router-link>
        <br>
    </div>
</template>

<script>
    import {functions, messaging} from '../misc/firebase';
    import NotificationIcon from '../components/NotificationIcon';

    export default {
        name: 'NotificationsView',
        components: {NotificationIcon,},
        data() {
            return {
                isAsking: false,
                enabledNotificationsText: 'Powiadomienia są włączone',
                disabledNotificationText: 'Powiadomienia są wyłączone',
                clickToEnableText: 'Kliknij, aby je włączyć'
            };
        },
        methods: {
            async requestPermission() {
                if (this.hasPermission) return;
                this.isAsking = true;
                await this.$store.dispatch('askForNotifications');
                this.isAsking = false;
            },
            async testNotification() {
                this.isAsking = true;
                try {
                    const token = await messaging.getToken();
                    await functions.httpsCallable('sendTestFcm')({token});
                } catch (e) {
                    alert(e.message);
                } finally {
                    this.isAsking = false;
                }
            },
            onMessage(payload) {
                const notification = {
                    title: 'Testowe powiadomienie',
                    body: 'Powiadomienia działają!',
                    ...payload.notification
                };
                new Notification(notification.title, notification);
            }
        },
        computed: {
            permission() { return this.$store.state.notificationPermission;},
            hasPermission() { return this.$store.getters.hasNotificationPermission;},
            userClass() { return this.$store.state.userClass;},
            userSurname() { return this.$store.state.userSurname;},
            userNumber() { return this.$store.state.userNumber;},
            aboutNotificationsText() {
                if (this.userSurname)
                    return 'Będziesz otrzymywać powiadomienia o zastępstwach dla ' + this.userSurname;
                else if (this.userClass && this.userNumber)
                    return 'Będziesz otrzymywać powiadomienia o zastępstwach dla ' + this.userClass +' oraz o szczęśliwym numerku jeżeli ' + this.userNumber + ' zostanie wylosowany.';
                else if (this.userClass)
                    return 'Będziesz otrzymywać powiadomienia o zastępstwach dla ' + this.userClass;

                return 'Teraz przejdź do ustawień, aby wybrać swoją klasę i numerek albo nazwisko.'
            }
        },
        created() {
            this.unsub = messaging.onMessage(this.onMessage);
        },
        destroyed() {
            this.unsub();
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .layout {
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: grid;
        justify-items: center;
        place-content: center;
        transition: opacity .2s;
    }

    h2, h3, h5 {
        cursor: pointer;
        margin: 12px;
    }

    .asking {
        pointer-events: none;
        opacity: .5;
    }

    .test-btn {
        background: var(--primary-color);
        border-radius: 8px;
        border: none;
        color: var(--on-primary-color);
        font-weight: bold;
        letter-spacing: .2em;
        font-size: 1.05em;
        text-transform: uppercase;
        padding: 8px 12px;
        box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, .7);
        cursor: pointer;
    }

    p {
        margin-top: 32px;
        max-width: 450px;
        line-height: 1.6em;
    }

    .link-to-settings {
        background: var(--lighter-back-background-color);
        font-weight: bold;
        border-radius: 8px;
        color: var(--font-secondary-color);
        padding: 8px 12px;
        box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, .5);
    }
</style>
