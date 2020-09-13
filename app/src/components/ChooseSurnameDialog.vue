<template>
    <div class="classes">
        <p v-for="(n, index) in names" :key="index" @click="clicked(n)" :class="{selected: selected === n}">
            {{n}}
        </p>
    </div>
</template>

<script>
    import {firestore} from '../misc/firebase';

    export default {
        name: 'ChooseSurnameDialog',
        data() {
            return {
                names: null,
            };
        },
        methods: {
            clicked(which) {
                this.$emit('input', which);
                this.$parent.$emit('close-request');
            },
            onData(snap) {
                const data = snap.data();
                if (data) {
                    this.names = data.teachers.filter(e => e.type === 't').map(e => e.name).sort();
                }
            }
        },
        computed: {
            selected() {return this.$store.state.userSurname;}
        },
        created() {
            this.unSub = firestore
                .collection('values')
                .doc('timetables')
                .onSnapshot(this.onData);
        },
        destroyed() {
            this.unSub();
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .classes {
        max-width: 400px;
        max-height: 500px;
        text-transform: uppercase;
    }

    .classes > * {
        margin: 8px 4px;
        padding: 4px;
        cursor: pointer;
    }

    .selected {
        border-radius: 4px;
        background-color: var(--primary-color);
        color: var(--on-primary-color);
    }
</style>
