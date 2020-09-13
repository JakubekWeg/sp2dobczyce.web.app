<template>
    <div class="overlay" :class="{closed}">
        <div class="dialog">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Dialog',
        methods: {
            onClosed() {
                // event.stopPropagation()
                this.closed = true;
                setTimeout(() => this.$emit('close'), 300);
            }
        },
        data() {
            return {
                closed: false
            };
        },
        created() {
            this.$once('close-request', this.onClosed)
        }
    };
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .overlay {
        animation: FadeIn .3s;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 99;
        background-color: #00000099;
        display: grid;
        place-items: center;
        transition: opacity .3s;
    }

    .closed {
        opacity: 0;
    }

    .dialog {
        max-width: 90vw;
        max-height: 90%;
        overflow: auto;
        border-radius: 8px;
        background-color: var(--back-background-color);
        z-index: 100;
        box-shadow: 1px 2px 24px 8px rgba(0, 0, 0, .8);
    }
</style>
