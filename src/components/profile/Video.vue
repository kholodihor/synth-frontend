<template>
  <div class="wrapper">
    <h1>My Videos</h1>
    <div class="divider"></div>
    <div class="buttons-wrapper" v-if="userStore._id == route.params.id">
      <LinkBtn text="Add Video" url="/account/add-video" />
      <LinkBtn text="Delete Video" url="/account/delete-video" :danger="true" />
    </div>
    <div class="video-wrapper">
      <div v-for="video in videos" :key="video._id">
        <h4>{{ video.title }}</h4>
        <iframe :src="replaceUrl(video.url)" width="310" height="200"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video, User } from '@/types'
import { useRoute } from 'vue-router'
import { replaceUrl } from '@/helpers'
import LinkBtn from '@/components/shared/LinkBtn.vue'

const route = useRoute()

defineProps<{
  videos: Video[]
  userStore: User
}>()
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

  @media screen and (max-width: 450px) {
    padding: 0;
  }

  h4 {
    margin-bottom: 0.5rem;
  }
}
</style>
