<template>
    <div class="entry">
        <span class="name">{{entry.name}}</span>
        <Icon class="sign" name="remove" @click="minus"/>
        <span class="grade">{{entry.val === 0 ? '•' : entry.val}}</span>
        <Icon class="sign" name="add" @click="plus"/>
        <Icon class="sign" name="delete" @click="$emit('delete', entry)"/>
    </div>
</template>

<script>
    import Icon from '../components/Icon';

    export default {
        name: 'AverageEntryComponent',
        components: {Icon},
        methods: {
            plus() {
                if (this.entry.val < 6) {
                    this.entry.val++;
                    // this.$emit('change', this);
                }
            },
            minus() {
                if (this.entry.val > 0) {
                    this.entry.val--;
                    // this.$emit('change', this);
                }
            }
        },
        props: {
            entry: {
                required: true,
                type: Object
            }
        }
    };
</script>

<style scoped>
    .entry {
        padding: 6px 4px;
        text-align: left;
        display: flex;
        align-items: center;
        border-radius: 4px;
        transition: background-color .3s;
    }

    .entry:hover {
        background-color: var(--mid-background-color);
    }

    .name {
        flex: 1;
        padding-left: 4px;
    }

    .sign {
        user-select: none;
        padding: 6px;
        transition: background-color .3s;
        cursor: pointer;
        border-radius: 30%;
    }

    .sign:hover {
        background-color: var(--front-background-color);
    }

    .grade {
        padding: 6px;
        font-weight: bolder;
        font-size: 1.2em;
        color: var(--font-primary-color);
        min-width: 16px;
        text-align: center;
    }
</style>
