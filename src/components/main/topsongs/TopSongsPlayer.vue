<template>
  <div class="top-songs-player">
    <AudioPlayer :songs="songs" />
  </div>
</template>

<script setup lang="ts">
import type { Song } from '@/types'
import AudioPlayer from '@/components/shared/AudioPlayer.vue'

defineProps<{
  songs: Song[]
}>()
</script>

<style scoped lang="scss">
.top-songs-player {
  width: 100%;
  background: $black;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba($blue, 0.2);
}
</style>
