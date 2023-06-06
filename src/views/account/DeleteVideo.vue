<template>
  <div class="page">
    <div class="wrapper">
      <h1>Delete Video</h1>
      <div class="divider"></div>
      <div v-for="(video) in videoStore.videos" :key="video._id" class="videowrapper">
        <div class="title">
          <iframe class="w-full h-20" :src="replaceUrl(video.url)"></iframe>
          <h4>{{ video.title }}</h4>
        </div>
        <button @click="deleteVideo(video)">delete video</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/types';
import { replaceUrl } from '@/helpers';
import { useVideoStore } from '@/stores/videoStore'

const videoStore = useVideoStore()

const deleteVideo = (video: Video) => {
  videoStore.deleteVideo(video)
}

</script>

<style scoped lang="scss">
.videowrapper {
  @include deleteWrapper
}
</style>