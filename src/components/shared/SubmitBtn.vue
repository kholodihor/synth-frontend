<template>
  <button class="link" @click="$emit('submit', true)">{{ text }}</button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps({
  text: String,
})
const { text } = toRefs(props)
</script>

<style scoped lang="scss">
.link {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1.5rem;
  margin: 1rem auto;
  background-color: transparent;
  border: 1px solid $green;
  color: $green;
  text-transform: uppercase;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    box-shadow: 2px 2px 5px $green, -2px -2px 5px $green;
  }

  @media screen and (max-width:450px) {
    font-size: 0.8rem;
  }
}
</style>