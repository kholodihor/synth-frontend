<template>
  <div class="top-songs">
    <div class="left">
      <h1>Top SynthPop Songs</h1>
      <div class="divider"></div>
      <TopSongsPlayer :songs="songs" />
    </div>
    <div class="right">
      <EclipseBlock />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopSongsPlayer from './TopSongsPlayer.vue'
import EclipseBlock from '../../decor/EclipseBlock.vue'
import type { Song } from '@/types'

defineProps<{
  songs: Song[]
}>()
</script>

<style scoped lang="scss">
.divider {
  width: 70%;
}

.top-songs {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr;
  }

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
