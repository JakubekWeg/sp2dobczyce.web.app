<template>
    <div class="content">
        <p class="average-text" v-if="averageSum">{{averageSum}} / {{nonZeroEntries.length}} = <span class="avg">{{averageText}}</span>
        </p>
        <p class="average-text" v-else>Tu wyświetli się twoja średnia</p>

        <FloatingActionButton icon="add" @click="addSubject"/>

        <div class="space"></div>
        <div class="entries" v-if="entries.length">
            <AverageEntryComponent
                    :entry="item"
                    v-for="(item, index) in entries"
                    :key="item.id"
                    @delete="deleteSubject(index)"/>
        </div>
        <p v-else class="no-marks-text">
            Użyj przycisku <b>+</b>, aby dodać przedmiot
        </p>
        <div class="space"></div>
        <div class="space"></div>
        <div class="space"></div>
        <div class="space"></div>
    </div>
</template>

<script>
    import AverageEntryComponent from './AverageEntryComponent';
    import FloatingActionButton from '../components/FloatingActionButton';

    export default {
        name: 'AverageCalculatorView',
        components: {FloatingActionButton, AverageEntryComponent},
        methods: {
            deleteSubject(index) {
                this.entries.splice(index, 1);
            },
            addSubject(name) {
                this.entries.push({
                    name: (!!name && typeof name === 'string' ? name : prompt('Podaj nazwę przedmiotu')).substring(0, 20),
                    id: Math.random() * 100000000 | 0,
                    val: 0,
                });
            }
        },
        computed: {
            nonZeroEntries() {
                return this.entries.filter(e => e.val !== 0);
            },
            averageSum() {
                return this.nonZeroEntries.reduce((val, entry) => val + entry.val, 0);
            },
            averageText() {
                const nonZero = this.nonZeroEntries;
                const sum = this.averageSum;
                const count = nonZero.length;

                return (sum / count).toFixed(2);
            }
        },
        data() {
            return {
                entries: []
            };
        },
        created() {
            this.entries = JSON.parse(localStorage.getItem('lastCalcMarks') || '[]');
            if (!this.entries.length)
                [
                    'matematyka', 'j.polski', 'j.angielski', 'j.niemiecki',
                    'geografia', 'biologia', 'chemia', 'fizyka',
                    'wf', 'historia', 'wos', 'religia', 'technika', 'informatyka'
                ]
                    .forEach(this.addSubject);

            this.entries.sort((a, b) => a.val === 0 ? 1 : (b.val === 0 ? -1 : a.name.localeCompare(b.name)));
        },
        destroyed() {
            localStorage.setItem('lastCalcMarks', JSON.stringify(this.entries));
        }
    };
</script>

<style scoped>
    .content {
        position: relative;
    }

    .entries {
        max-width: 400px;
        margin: 0 auto;
        background-color: var(--lighter-back-background-color);
        border-radius: 8px;
    }

    .avg {
        font-weight: bolder;
    }

    .space {
        height: 16px;
    }
    .average-text {
        margin: 0;
        padding: 8px 4px;
        background-color: var(--front-background-color);
        top: 0;
        position: sticky;
        z-index: 5;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .3);
    }
    .no-marks-text {
        margin: 0;
        padding: 32px 8px;
    }
</style>
