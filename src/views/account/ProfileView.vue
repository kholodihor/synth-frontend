<template>
  <Profile :userStore="userStore" />
  <Songs :songs="songStore.songs" :userStore="userStore" />
  <Video :videos="videoStore.userVideos" :userStore="userStore" />
  <Bands :bands="bandsStore.userBands" :userStore="userStore" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVideoStore } from '@/stores/videoStore'
import { useSongStore } from '@/stores/songStore'
import Profile from '@/components/profile/Profile.vue'
import Bands from '@/components/profile/Bands.vue'
import Songs from '@/components/profile/Songs.vue'
import Video from '@/components/profile/Video.vue'

const userStore = useUserStore()
const bandsStore = useBandsStore()
const videoStore = useVideoStore()
const songStore = useSongStore()

onMounted(() => Promise.all([userStore.fetchUser(), userStore.loadUserContent()]))
</script>

<style scoped lang="scss"></style>
