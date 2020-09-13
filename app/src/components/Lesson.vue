<template>
    <div v-if="obj && hasGroups" class="lesson many">
        <LessonGroup v-for="(group, index) in obj" :obj="group" :key="index"></LessonGroup>
    </div>
    <LessonGroup :obj="obj" v-else-if="obj" class="lesson single"/>
    <div v-else class="empty"></div>
</template>

<script>
    import LessonGroup from './LessonGroup';

    export default {
        name: 'Lesson',
        components: {LessonGroup},
        props: {
            obj: {
                required: true
            }
        },
        computed: {
            hasGroups() {
                return Array.isArray(this.obj);
            }
        },
        created() {
        }
    };
</script>

<style scoped>
    .many {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
