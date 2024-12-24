<template>
  <section class="top-songs" aria-labelledby="top-songs-title">
    <div class="content">
      <div class="player-section">
        <h1 id="top-songs-title">Top SynthPop Songs</h1>
        <div class="divider" aria-hidden="true"></div>
        <TopSongsPlayer :songs="validSongs" aria-label="Music player for top synthpop songs" />
      </div>

      <div class="decoration-section" aria-hidden="true">
        <EclipseBlock />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TopSongsPlayer from './TopSongsPlayer.vue'
import EclipseBlock from '../../decor/EclipseBlock.vue'
import type { Song } from '@/types'

const props = defineProps<{
  songs: Song[]
}>()

// Ensure songs are properly typed and filtered
const validSongs = computed(() => props.songs.filter((song) => song.title && song.song))
</script>

<style scoped lang="scss">
.top-songs {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr);
  gap: clamp(1rem, 4vw, 3rem);

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.player-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    text-align: center;
    color: $white;
    text-shadow: 0 0 10px rgba($blue, 0.5);
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
  }
}

.divider {
  height: 2px;
  width: min(70%, 500px);
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba($blue, 0.5), transparent);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  transform-origin: center;
  animation: pulse 2s ease-in-out infinite;
}

.decoration-section {
  display: grid;
  place-items: center;
  padding: clamp(1rem, 3vw, 2rem);

  @media (max-width: 1280px) {
    display: none;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.1);
  }
}
</style>
