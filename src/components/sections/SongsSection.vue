<template>
  <div class="wrapper">
    <h1>My Songs</h1>
    <div class="divider"></div>
    <div class="buttons-wrapper" v-if="userStore._id == route.params.id">
      <LinkBtn text="Add Song" url="/account/add-song" />
      <LinkBtn text="Delete Song" url="/account/delete-song" :danger="true" />
    </div>
    <div>
      <SongPlayer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Song, User } from '@/types';
import LinkBtn from '@/components/shared/LinkBtn.vue'
import SongPlayer from '@/components/sections/SongPlayer.vue'

const route = useRoute()

defineProps<{
  songs: Song[]
  userStore: User
}>()

</script>

<style scoped lang="scss">
.wrapper {
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
}
</style>