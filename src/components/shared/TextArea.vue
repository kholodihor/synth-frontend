<template>
    <div class="textbox">
        <textarea class="textarea" v-model="computedDescription" cols="30" rows="10" :placeholder="placeholder"></textarea>
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

const props = defineProps({
    description: String,
    placeholder: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['update:description'])

const { description, placeholder } = toRefs(props)

const computedDescription = computed({
    get: () => description?.value,
    set: (val) => emit('update:description', val)
})

</script>

<style scoped lang="scss">
.textbox {
    width: 48vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.1rem;

    .textarea {
        width: 90%;
        padding: 0.5rem;
        border-radius: 5px;
    }

    .error {
        width: 90%;
        padding: 0.2rem;
        font-size: 0.8rem;
        color: red;
        text-align: left;
    }
}
</style>