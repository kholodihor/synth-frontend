<template>
  <main>
    <Hero />
    <Navbar />
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader"></div>
    </div>
    <template v-else>
      <Bands v-if="!bandsError" :bands="bandsStore.bands" />
      <div v-else class="error-message">{{ bandsError }}</div>
      <CardsBlock />
      <MusicGenerator />
      <TopSongs v-if="!songsError" :songs="topSongStore.songs" />
      <div v-else class="error-message">{{ songsError }}</div>
      <SynthpopGirls />
      <Video v-if="!videosError" :videos="videoStore.videos" />
      <div v-else class="error-message">{{ videosError }}</div>
    </template>
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBandsStore } from '@/stores/bandsStore'
import { useVideoStore } from '@/stores/videoStore'
import { useTopSongsStore } from '@/stores/topSongsStore'
import Hero from '@/components/main/Hero.vue'
import Bands from '@/components/main/Bands.vue'
import Navbar from '@/components/main/Navbar.vue'
import CardsBlock from '@/components/main/CardsBlock.vue'
import MusicGenerator from '@/components/main/MusicGenerator.vue'
import TopSongs from '@/components/main/topsongs/TopSongs.vue'
import SynthpopGirls from '@/components/main/SynthpopGirls.vue'
import Video from '@/components/main/Video.vue'
import Footer from '@/components/main/Footer.vue'

const bandsStore = useBandsStore()
const videoStore = useVideoStore()
const topSongStore = useTopSongsStore()

const isLoading = ref(true)
const bandsError = ref('')
const songsError = ref('')
const videosError = ref('')

onMounted(async () => {
  try {
    await Promise.all([
      bandsStore.getAllBands().catch((error) => {
        bandsError.value = 'Failed to load bands: ' + error.message
      }),
      videoStore.fetchVideos().catch((error) => {
        videosError.value = 'Failed to load videos: ' + error.message
      }),
      topSongStore.fetchSongs().catch((error) => {
        songsError.value = 'Failed to load songs: ' + error.message
      })
    ])
  } catch (error) {
    console.error('Failed to load content:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped lang="scss">
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid rgba($blue, 0.3);
  border-radius: 50%;
  border-top-color: $blue;
  animation: spin 1s ease-in-out infinite;
}

.error-message {
  color: $red;
  text-align: center;
  padding: 1rem;
  margin: 1rem;
  background: rgba($red, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
