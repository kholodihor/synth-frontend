import axios from "axios";
import { defineStore } from "pinia";
import type { Song } from "@/types";
import Swal from '@/utils/swal'
import { handleErrors } from '@/utils/handleErrors'

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
            const response = await axios.delete('api/songs/' + song._id)
            
            // Check if the response has the success flag
            if (response.data && response.data.success === false) {
              Swal.fire({
                title: 'Delete Failed',
                text: handleErrors(response.data.message || 'Failed to delete song'),
                icon: 'error',
                confirmButtonColor: '#219dff'
              })
              return;
            }
            
            await this.fetchSongsByUserId()
            Swal.fire({
              title: 'Deleted!',
              text: 'Your song has been deleted.',
              icon: 'success',
              confirmButtonColor: '#219dff'
            })
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('Error response:', error.response?.data);
              
              Swal.fire({
                title: 'Delete Failed',
                text: handleErrors(error.response?.data?.message || error.message),
                icon: 'error',
                confirmButtonColor: '#219dff'
              })
            } else {
              console.error('An error occurred:', error);
              
              Swal.fire({
                title: 'Delete Failed',
                text: 'An unexpected error occurred while deleting the song',
                icon: 'error',
                confirmButtonColor: '#219dff'
              })
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
