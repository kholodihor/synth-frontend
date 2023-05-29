<template>
    <RouterLink class="link" :class="{ 'danger': danger, 'warning': warning }" :to="url">{{ text }}</RouterLink>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps({
    text: String,
    danger: {
        type: Boolean,
        default: false
    },
    warning: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        default: ''
    }
})
const { text, url, danger, warning } = toRefs(props)
</script>

<style scoped lang="scss">

.link {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid $blue;
    color: $blue;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;

    &:hover {
        box-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
    }

    @media screen and (max-width:450px) {
        font-size: 0.8rem;
    }
}

.danger:hover {
    border: 1px solid $red;
    color: $red;
    box-shadow: 2px 2px 5px $red, -2px -2px 5px $red;
}

.warning:hover {
    border: 1px solid $yellow;
    color: $yellow;
    box-shadow: 2px 2px 5px $yellow, -2px -2px 5px $yellow;
}
</style>