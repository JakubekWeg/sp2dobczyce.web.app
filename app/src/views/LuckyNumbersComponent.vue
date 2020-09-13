<template>
    <div class="lucky-numbers" v-if="luckyNumbers && luckyNumbers.length">
        <p>Szczęśliwe numerki</p>
        <div class="numbers">
            <span v-for="(n, i) in luckyNumbers" :key="i">{{n}}</span>
        </div>
    </div>
    <div class="gone" v-else></div>
</template>

<script>
    import {firestore} from '../misc/firebase';

    export default {
        name: 'LuckyNumbersComponent',
        data() {
            return {
                luckyNumbers: null
            };
        },
        methods: {
            onNumbersUpdated(snap) {
                const data = snap.data();
                if (data && data.numbers) this.luckyNumbers = data.numbers;
            }
        },
        created() {
            this.unSub2 = firestore
                .collection('values')
                .doc('lucky-numbers')
                .onSnapshot(this.onNumbersUpdated);
        },
        destroyed() {
            this.unSub2();
        }
    };
</script>

<style scoped>
    .gone {
        display: none;
    }
    .lucky-numbers {
        padding: 8px;
        border-radius: 4px;
        background: var(--mid-background-color);
        margin: 0 4px ;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, .5);
    }
    p {
        margin: 2px;
        color: var(--font-secondary-color);
        font-size: .9em;
    }
    .numbers {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .numbers>* {
        padding: 0 8px;
        font-weight: bold;
        font-size: 2em;
    }
</style>
