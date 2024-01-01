import { defineStore } from 'pinia'
import { topSongs } from '@/data/topSongs'

type Songs = {
  songs: any[]
}

export const useTopSongsStore = defineStore('topsongs', {
  state: (): Songs => ({
    songs: []
  }),

  actions: {
    async fetchSongs() {
      this.$state.songs = topSongs
    },

    clearSongs() {
      this.$state.songs = []
    }
  }
  // persist: true
})
