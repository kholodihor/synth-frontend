import { defineStore } from 'pinia'
import { topSongs } from '@/data/topSongs'
import type { Song } from '@/types'

type Songs = {
  songs: Song[]
}

export const useTopSongsStore = defineStore('topsongs', {
  state: (): Songs => ({
    songs: [...topSongs]
  }),

  actions: {
    async fetchSongs() {
      this.songs = [...topSongs]
      console.log('Loaded songs:', this.songs)
    },

    clearSongs() {
      this.songs = []
    }
  },
  persist: true
})
