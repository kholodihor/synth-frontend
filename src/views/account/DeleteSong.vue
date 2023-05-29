<template>
  <div class="page">
    <div class="wrapper">
      <h1>Delete Your Song</h1>
      <div class="divider"></div>
      <div v-for="(song, index) in songStore.songs" :key="song._id" class="songwrapper">
        <div>
          <h4>{{ song.artist }} - {{ song.title }}</h4>
        </div>
        <button @click="deleteSong(song)">delete song</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import Swal from '@/utils/swal'
import type { Song } from '@/types'
import { useSongStore } from '@/stores/songStore'

const songStore = useSongStore()

const deleteSong = async (song: Song) => {
  Swal.fire({
    title: `Are you sure you want to delete ${song.artist} - ${song.title} ?`,
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, please!',
    confirmButtonColor: '#29fd53',
    cancelButtonColor: 'red',
  }).then(async (result: { isConfirmed: boolean; }) => {
    if (result.isConfirmed) {
      try {
        await axios.delete('api/songs/' + song._id)
        songStore.fetchSongsByUserId()
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
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
.songwrapper {
  @include deleteWrapper
}
</style>