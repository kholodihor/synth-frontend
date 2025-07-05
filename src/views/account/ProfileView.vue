<template>
  <div class="profile-container">
    <div class="profile-content">
      <Profile :userStore="profileStore" />
      <Songs :songs="songStore.songs" :userStore="userStore" />
      <Video :videos="videoStore.videos" :userStore="userStore" />
      <Bands :bands="bandsStore.bands" :userStore="userStore" />
    </div>
  </div>
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

<style scoped lang="scss">
.profile-container {
  position: relative;
  padding: 2rem;
  // min-height: 100vh;
  overflow: hidden;
}

.profile-content {
  position: relative;
  z-index: 2;
}

@keyframes neonGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes neonScan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* Add some glow to the profile sections */
:deep(.profile-section) {
  background: rgba(15, 12, 41, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.3);
    transform: translateY(-2px);
  }
}

/* Add some neon text effects */
:deep(h1),
:deep(h2) {
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff, 0 0 25px #ff00ff;
  animation: neonPulse 2s infinite alternate;
}

@keyframes neonPulse {
  from {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff, 0 0 25px #ff00ff;
  }
  to {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 50px #ff00ff;
  }
}
</style>
