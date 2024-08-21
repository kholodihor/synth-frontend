<template>
  <Profile :profileStore="profileStore" />
  <Songs :songs="songStore.songs" :userStore="userStore" />
  <Video :videos="videoStore.videos" :userStore="userStore" />
  <Bands :bands="bandsStore.bands" :userStore="userStore" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVideoStore } from '@/stores/videoStore'
import { useSongStore } from '@/stores/songStore'
import Profile from '@/components/profile/Profile.vue'
import Bands from '@/components/profile/Bands.vue'
import Songs from '@/components/profile/Songs.vue'
import Video from '@/components/profile/Video.vue'

const userStore = useUserStore()
const profileStore = useProfileStore()
const bandsStore = useBandsStore()
const videoStore = useVideoStore()
const songStore = useSongStore()

onMounted(async () => {
  await profileStore.fetchProfileById()
  await bandsStore.fetchBandsByUserId()
  await videoStore.fetchVideosByUserId()
  await songStore.fetchSongsByUserId()
})
</script>

<style scoped lang="scss"></style>
