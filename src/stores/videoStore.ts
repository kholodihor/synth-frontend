import axios from 'axios'
import { defineStore } from 'pinia'
import type { Video } from '@/types'
import { confirmDanger, notifyError, notifySuccess } from '@/utils/notify'

type VideosState = {
  videos: Video[]
  userVideos: Video[]
}

export const useVideoStore = defineStore('video', {
  state: (): VideosState => ({
    videos: [],
    userVideos: []
  }),

  actions: {
    async fetchVideos() {
      const { data } = await axios.get<{ videos: Video[] }>('api/video')
      this.videos = data.videos
    },

    async fetchVideosByUserId() {
      const { data } = await axios.get<{ videos: Video[] }>('api/user/video')
      this.userVideos = data.videos
    },

    async deleteVideo(video: Video) {
      if (!(await confirmDanger(`Are you sure you want to delete ${video.title}?`))) return
      try {
        await axios.delete(`api/video/${video._id}`)
        await this.fetchVideosByUserId()
        notifySuccess('Deleted!', 'Your video has been deleted.')
      } catch (error) {
        notifyError('Delete Failed', error)
      }
    },

    clearUserVideos() {
      this.userVideos = []
    }
  }
})
