import axios from "axios";
import { defineStore } from "pinia";
import type { Song } from "@/types";
import Swal from '@/utils/swal'

type Songs = {
  songs: Song[];
};

export const useSongStore = defineStore("song", {
  state: (): Songs => ({
    songs: [],
  }),

  actions: {
    async fetchSongsByUserId() {
      const res = await axios.get("/api/user/songs");
      if (res.data) {
        this.$state.songs = res.data;
      }
    },

   async deleteSong (song: Song) {
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
            this.fetchSongsByUserId()
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
    },

    clearSongs() {
      this.$state.songs = [];
    },
  },
  persist: true,
});
