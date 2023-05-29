<template>
  <div class="wrapper">
    <h1>Best SynthPop Videos</h1>
    <div class="divider"></div>
    <div class="video-wrapper">
      <div v-for="video in videos.slice(0, 3)" :key="video._id">
        <h4>{{ video.title }}</h4>
        <iframe :src="replaceUrl(video.url)" width="310" height="200" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVideoStore } from '@/stores/videoStore'
import type { Video } from '@/types';

const videoStore = useVideoStore()

const videos = ref<Video[]>([])

onMounted(async () => {
  await videoStore.fetchVideos()
  videos.value = videoStore.videos
})

const replaceUrl = (url: string): string => {
  return url.replace("watch?v=", "embed/");
}
</script>

<style scoped lang="scss">
h1 {
  width: 100%;
  text-align: left;
  text-shadow: $text-shadow-main;
}

.buttons-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.video-wrapper {
  padding: 1rem;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;

  @media screen and (max-width:450px) {
    padding: 0;
  }

  h4 {
    margin-bottom: 0.5rem;
  }
}
</style>