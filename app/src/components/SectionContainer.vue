<template>
    <article :class="{expanded}">
        <header @click="expanded = !expanded">
            <h3 v-if="obj.header">{{obj.header}}</h3>
            <h3 v-else-if="obj.date">{{formattedDate}}</h3>
            <h3 v-else>Wut?</h3>
            <span class="counter" v-if="affectedCount > 0"><span>{{affectedCount}}</span></span>
        </header>
        <div v-if="expanded" class="content">
            <main v-if="obj.lines">
                <p v-for="(line, index) in obj.lines" :key="index" :class="{affectsMe: line.affectsMe}">
                    {{line.content}}
                </p>
            </main>
            <main v-else class="text-only">
                {{obj.textRaw}}
            </main>
        </div>
    </article>
</template>

<script>

    import {getWeekDays} from '../misc/user';

    export default {
        name: 'SectionContainer',
        props: {
            obj: {
                type: Object,
                required: true
            }
        },
        watch: {
            obj(obj) {
                this.computeAffected(obj)
            }
        },
        methods: {
            computeAffected(obj) {
                this.affectedCount = 0
                if (obj.lines) {
                    const checker = this.$store.getters.lineAffectsChecker
                    for (const line of obj.lines) {
                        if (line.affects && checker(line)) {
                            line.affectsMe = true;
                            this.affectedCount++
                        }
                    }
                }
                if (!this.computedAffected && this.affectedCount > 0)
                    this.expanded = true
                this.computedAffected = true
            }
        },
        computed: {
            formattedDate() {
                if (!this.obj.date) return '';
                const date = new Date(Date.parse(this.obj.date));
                const name = getWeekDays()[date.getDay()];
                return `${date.toLocaleDateString()} ${name}`;
            }
        },
        data() {
            return {
                computedAffected: false,
                expanded: false,
                affectedCount: 0
            };
        },
        created() {
            this.computeAffected(this.obj)
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    article {
        position: relative;
        border-radius: 4px;
        text-align: left;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, .7);
        background: var(--front-background-color);
        margin: 8px 4px;
    }

    main {
        padding: 4px 2px;
        white-space: pre-line;
    }

    .text-only {
        padding: 6px;
        line-height: 150%;
    }

    main p {
        line-height: 120%;
        margin: 6px 2px;
    }

    h3 {
        user-select: none;
        cursor: pointer;
        margin: 0;
        padding: 8px;
        border-radius: 4px;
        background: var(--mid-background-color);
    }
    .expanded h3 {
        border-radius: 4px 4px 0 0;
    }

    .affectsMe {
        font-weight: bold;
    }
    @keyframes ShowingContent {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .content {
        transform-origin: top;
        animation: ShowingContent .5s;
    }

    .counter {
        position: absolute;
        display: grid;
        place-items: center;
        top: 0.5rem;
        right: 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--on-primary-color);
        font-size: 12px;
        padding: 2px;
        font-weight: bold;
    }
</style>
