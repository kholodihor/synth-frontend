<template>
  <main>
    <Hero />
    <Navbar />
    <Bands :bands="bandsStore.bands" />
    <CardsBlock />
    <TopSongs :songs="topSongStore.songs" />
    <SynthpopGirls />
    <Video :videos="videoStore.videos" />
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBandsStore } from '@/stores/bandsStore'
import { useVideoStore } from '@/stores/videoStore'
import { useTopSongsStore } from '@/stores/topSongsStore'
import Hero from '@/components/main/Hero.vue'
import Bands from '@/components/main/Bands.vue'
import Navbar from '@/components/main/Navbar.vue'
import CardsBlock from '@/components/main/CardsBlock.vue'
import TopSongs from '@/components/main/topsongs/TopSongs.vue'
import SynthpopGirls from '@/components/main/SynthpopGirls.vue'
import Video from '@/components/main/Video.vue'
import Footer from '@/components/main/Footer.vue'

const bandsStore = useBandsStore()
const videoStore = useVideoStore()
const topSongStore = useTopSongsStore()

onMounted(async () => {
  await bandsStore.getAllBands()
  await videoStore.fetchVideos()
  await topSongStore.fetchSongs()
})
</script>
