import axios from 'axios'
import { defineStore } from 'pinia'
import type { Video } from '@/types'
import Swal from '@/utils/swal'
import { handleErrors } from '@/utils/handleErrors'

type Videos = {
  videos: Video[]
}

export const useVideoStore = defineStore('video', {
  state: (): Videos => ({
    videos: []
  }),

  actions: {
    async fetchVideos() {
      const res = await axios.get('api/video')
      this.$state.videos = res.data.videos
    },

    async fetchVideosByUserId() {
      const res = await axios.get('api/user/video')
      if (res.data) {
        this.$state.videos = res.data.videos
      }
    },

    async deleteVideo(video: Video) {
      Swal.fire({
        title: `Are you sure you want to delete ${video.title}?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, please!',
        confirmButtonColor: '#29fd53',
        cancelButtonColor: 'red'
      }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete('api/video/' + video._id)
            
            // Check if the response has the success flag
            if (response.data && response.data.success === false) {
              Swal.fire({
                title: 'Delete Failed',
                text: handleErrors(response.data.message || 'Failed to delete video'),
                icon: 'error',
                confirmButtonColor: '#219dff'
              })
              return;
            }
            
            await this.fetchVideosByUserId()
            Swal.fire({
              title: 'Deleted!',
              text: 'Your video has been deleted.',
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
                text: 'An unexpected error occurred while deleting the video',
                icon: 'error',
                confirmButtonColor: '#219dff'
              })
            }
          }
        }
      })
    },

    clearVideos() {
      this.$state.videos = []
    }
  },
  persist: true
})
