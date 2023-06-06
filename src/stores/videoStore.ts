import axios from 'axios'
import { defineStore } from 'pinia'
import type { Video } from '@/types'
import Swal from '@/utils/swal'

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
      this.$state.videos = res.data
    },

    async fetchVideosByUserId() {
      const res = await axios.get('api/user/video')
      if (res.data) {
        this.$state.videos = res.data
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
            await axios.delete('api/video/' + video._id)
            this.fetchVideosByUserId()
            Swal.fire({
              title: 'Deleted!',
              text: 'Your video has been deleted.',
              icon: 'success',
              confirmButtonColor: '#219dff'
            })
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('Error message:', error.message)
            } else {
              console.error('An error occurred:', error)
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
