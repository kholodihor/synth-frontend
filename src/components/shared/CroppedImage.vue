<template>
  <div class="image">
    <label>
      {{ label }}
    </label>
    <img :src="image">
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
const props = defineProps({ label: String, image: String })
const { label, image } = toRefs(props)
</script>

<style scoped lang="scss">
.image {
  width: 10rem;

  label {
    font-size: 0.8rem;
  }

  img {
    width: 100%;

  }
}
</style>