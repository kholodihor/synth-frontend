import { defineStore } from 'pinia'
import { topSongs } from '@/data/topSongs'
import type { Song } from '@/types'

type SongsState = {
  songs: Song[]
}

// Top songs are bundled static data; no persistence or fetching required
export const useTopSongsStore = defineStore('topsongs', {
  state: (): SongsState => ({
    songs: [...topSongs]
  })
})
