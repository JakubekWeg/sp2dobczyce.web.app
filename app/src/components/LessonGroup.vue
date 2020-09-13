<template>
    <div class="group">
        <p>{{obj.subject}}</p>
        <p>{{obj.classroom}}</p>
        <p>{{obj.teacher}}</p>
    </div>
</template>

<script>
    export default {
        name: 'LessonGroup',
        props: {
            obj: {
                required: true,
            }
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .group {
        max-height: 100%;
        height: var(--row-height);
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto;
        place-items: center;
        grid-template-areas: 'h1 h1';
    }
    .many .group:not(:last-child) {
        border-right: 1px dotted var(--font-tetrary-color);
    }

    p {
        margin: 0;
        font-size: .9em;
        color: var(--font-secondary-color);
    }
    p:nth-child(1) {
        text-overflow: ellipsis;
        overflow: hidden;
        grid-area: h1;
        font-size: 1.05em;
        color: var(--font-primary-color);
    }
    .many .group p:first-child {
        font-size: .9em;
    }
</style>
