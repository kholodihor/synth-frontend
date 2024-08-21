import axios from 'axios'
import { defineStore } from 'pinia'
import DefaultAvatar from '/DefaultUserAvatar.png'

export type User = {
  _id: string
  username: string
  email: string
  image: string
}

export const useProfileStore = defineStore('profile', {
  state: (): User => ({
    _id: '',
    username: '',
    email: '',
    image: ''
  }),

  actions: {
    async fetchProfileById() {
      const res = await axios.get('/api/user')
      this.$state._id = res.data._id
      this.$state.username = res.data.username
      if (res.data.avatarUrl) {
        this.$state.image = res.data.avatarUrl
      } else {
        this.$state.image = DefaultAvatar
      }
    },

    profileImage(image: string) {
      return import.meta.env.VITE_APP_API_URL + image
    },

    clearProfile() {
      this.$state._id = ''
      this.$state.username = ''
      this.$state.email = ''
      this.$state.image = ''
    }
  },
  persist: true
})
