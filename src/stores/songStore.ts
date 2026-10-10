import axios from 'axios'
import { defineStore } from 'pinia'
import type { Song } from '@/types'
import { confirmDanger, notifyError, notifySuccess } from '@/utils/notify'

type SongsState = {
  songs: Song[]
}

export const useSongStore = defineStore('song', {
  state: (): SongsState => ({
    songs: []
  }),

  actions: {
    async fetchSongsByUserId() {
      const { data } = await axios.get<Song[]>('api/user/songs')
      this.songs = data
    },

    async deleteSong(song: Song) {
      if (!(await confirmDanger(`Are you sure you want to delete ${song.artist} - ${song.title}?`)))
        return
      try {
        await axios.delete(`api/songs/${song._id}`)
        await this.fetchSongsByUserId()
        notifySuccess('Deleted!', 'Your song has been deleted.')
      } catch (error) {
        notifyError('Delete Failed', error)
      }
    },

    clearSongs() {
      this.songs = []
    }
  }
})
