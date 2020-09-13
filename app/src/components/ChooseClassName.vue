<template>
    <div class="classes">
        <div v-for="(n, index) in classes" :key="index">
            <span v-for="c in n" :key="c" @click="clicked(c)" :class="{selected: c === selected}">{{c}}</span>
        </div>
    </div>
</template>

<script>
    import {firestore} from '../misc/firebase';

    export default {
        name: 'ChooseClassName',
        data() {
            return {
                classes: null,
            };
        },
        computed: {
            selected() {return this.$store.state.userClass;}
        },
        methods: {
            clicked(which) {
                this.$emit('input', which);
                this.$parent.$emit('close-request')
            },
            onData(snap) {
                const data = snap.data();
                if (data) {
                    const names = data.classes.filter(e => e.type === 'c').map(e => e.name);
                    const map = new Map();
                    for (const n of names) {
                        const list = map.get(n[0]);
                        if (list)
                            list.push(n);
                        else
                            map.set(n[0], [n]);
                    }
                    this.classes = Array.from(map.values()).reverse();
                }
            }
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
        padding: 8px;
        max-width: 300px;
        text-transform: uppercase;
    }

    .classes > * {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-content: center;
    }

    .classes > * > * {
        cursor: pointer;
        margin: 2px 4px;
        padding: 6px;
        border: 1px solid var(--font-tetrary-color);
        border-radius: 8px;
    }
    .selected {
        background-color: var(--primary-color);
        color: var(--on-primary-color);
    }
</style>
