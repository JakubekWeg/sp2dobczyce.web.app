<template>
    <router-link v-if="to && !externalLink" :to="to" class="pref" @click="!disabled && $emit('click')"
                 :class="{disabled}">
        <Icon :name="icon"/>
        <p class="title">{{title}}</p>
        <p class="sum">{{summary}}</p>
        <span class="value">{{value}}</span>
    </router-link>

    <a v-else-if="to" target="_blank" referrerpolicy="no-referrer" :href="to" class="pref"
       @click="!disabled && $emit('click')" :class="{disabled}">
        <Icon :name="icon"/>
        <p class="title">{{title}}</p>
        <p class="sum">{{summary}}</p>
        <span class="value">{{value}}</span>
    </a>

    <div class="pref" v-else @click="!disabled && $emit('click')" :class="{disabled}">
        <Icon :name="icon"/>
        <p class="title">{{title}}</p>
        <p class="sum">{{summary}}</p>
        <span class="value">{{value}}</span>
    </div>
</template>

<script>
    import Icon from './Icon';

    export default {
        name: 'Preference',
        components: {Icon},
        props: {
            title: String,
            icon: String,
            summary: String,
            value: String,
            disabled: Boolean,
            externalLink: Boolean,
            to: String,
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .pref {
        padding-top: 4px;
        display: grid;
        grid-template-areas: 'icon title value' 'icon sum value';
        grid-template-columns: 48px 1fr auto;
        text-align: left;
        transition: background-color .3s;
        cursor: pointer;
    }

    .pref:hover {
        background-color: var(--lighter-back-background-color);
    }

    .disabled {
        cursor: default;
        opacity: .6;
    }

    .pref.disabled:hover {
        background-color: unset;
    }

    .icon {
        place-self: center;
        font-size: 32px;
    }

    .title {
        margin: 4px;
        font-size: 1.1em;
        color: var(--font-primary-color);
        grid-area: title;
    }

    .sum {
        margin: 4px;
        color: var(--font-secondary-color);
        grid-area: sum;
    }

    .value {
        overflow-x: hidden;
        text-overflow: ellipsis;
        padding: 6px;
        place-self: center;
        justify-self: stretch;
        color: var(--font-secondary-color);
        font-weight: bold;
        grid-area: value;
    }

</style>
