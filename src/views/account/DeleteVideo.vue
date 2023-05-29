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
import axios from 'axios'
import Swal from '@/utils/swal'
import type { Video } from '@/types';
import { replaceUrl } from '@/helpers';
import { useVideoStore } from '@/stores/videoStore'

const videoStore = useVideoStore()

const deleteVideo = async (video: Video) => {
  Swal.fire({
    title: `Are you sure you want to delete ${video.title}?`,
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, please!',
    confirmButtonColor: '#29fd53',
    cancelButtonColor: 'red',
  }).then(async (result: { isConfirmed: boolean; }) => {
    if (result.isConfirmed) {
      try {
        await axios.delete('api/video/' + video._id)
        videoStore.fetchVideosByUserId()
        Swal.fire(
          {
            title: 'Deleted!',
            text: 'Your video has been deleted.',
            icon: 'success',
            confirmButtonColor: "#219dff",
          }
        )
      } catch (error) {
        if (axios.isAxiosError(error)) {
        console.log('Error message:', error.message);
      } else {
        console.error('An error occurred:', error);
      }
      }
    }
  })
}
</script>

<style scoped lang="scss">
.videowrapper {
  @include deleteWrapper
}
</style>