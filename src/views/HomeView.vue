<script setup lang="ts">
import AppHeader from '@/components/sections/AppHeader.vue';
import Bands from '@/components/sections/HomeBandsSection.vue';
import ProfileHeader from '@/components/sections/ProfileHeader.vue';
import CardsBlock from '@/components/sections/CardsBlock.vue';
import TopSongs from '@/components/sections/TopSongs.vue'
import SynthpopGirls from '@/components/sections/SynthpopGirls.vue';
import Video from '@/components/sections/HomeVideoSection.vue';
import AppFooter from '@/components/sections/AppFooter.vue';
</script>

<template>
  <header>
    <AppHeader />
  </header>
  <main>
    <ProfileHeader />
    <Bands />
    <CardsBlock />
    <TopSongs />
    <SynthpopGirls />
    <Video />
  </main>
  <footer>
    <AppFooter />
  </footer>
</template>
