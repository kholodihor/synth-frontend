<template>
  <header>
    <AppHeader />
  </header>
  <main>
    <Navbar />
    <Bands :bands="bandsStore.bands" />
    <CardsBlock />
    <TopSongs :songs="topSongStore.songs" />
    <SynthpopGirls />
    <Video :videos="videoStore.videos" />
  </main>
  <footer>
    <AppFooter />
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from '@/components/sections/AppHeader.vue';
import Bands from '@/components/sections/HomeBandsSection.vue';
import Navbar from '@/components/sections/Navbar.vue';
import CardsBlock from '@/components/sections/CardsBlock.vue';
import TopSongs from '@/components/sections/TopSongs.vue'
import SynthpopGirls from '@/components/sections/SynthpopGirls.vue';
import Video from '@/components/sections/HomeVideoSection.vue';
import AppFooter from '@/components/sections/AppFooter.vue';
import { useBandsStore } from '@/stores/bandsStore'
import { useVideoStore } from '@/stores/videoStore'
import { useTopSongsStore } from '@/stores/topSongsStore'

const bandsStore = useBandsStore()
const videoStore = useVideoStore()
const topSongStore = useTopSongsStore()

onMounted(async () => {
  await bandsStore.getAllBands()
  await videoStore.fetchVideos()
  await topSongStore.fetchSongs();
})
</script>


