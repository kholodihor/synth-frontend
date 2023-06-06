<template>
  <div class="page">
    <div class="wrapper">
      <h1>Delete Your Song</h1>
      <div class="divider"></div>
      <div v-for="song in songStore.songs" :key="song._id" class="songwrapper">
        <div>
          <h4>{{ song.artist }} - {{ song.title }}</h4>
        </div>
        <button @click="deleteSong(song)">delete song</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '@/types'
import { useSongStore } from '@/stores/songStore'

const songStore = useSongStore()

const deleteSong = async (song: Song) => {
  songStore.deleteSong(song)
}
</script>
<style scoped lang="scss">
.songwrapper {
  @include deleteWrapper
}
</style>