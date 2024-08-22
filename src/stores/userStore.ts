import axios from 'axios'
import { defineStore } from 'pinia'

export type User = {
  _id: string
  token: string
  username: string
  email: string
  image: string
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    _id: '',
    token: '',
    username: '',
    email: '',
    image: ''
  }),
  actions: {
    setUserDetails(res: { data: User }) {
      this.$state._id = res.data._id
      this.$state.token = res.data.token
      this.$state.username = res.data.username
      this.$state.email = res.data.email
    },

    async fetchUser() {
      const res = await axios.get('api/user')
      this.$state._id = res.data._id
      this.$state.username = res.data.username
      if (res.data.image) {
        this.$state.image =
          import.meta.env.VITE_APP_API_URL + 'uploads/images/users/' + res.data.avatarUrl
      }
    },

    userImage(image: string) {
      return import.meta.env.VITE_APP_API_URL + image
    },

    clearUser() {
      this.$state._id = ''
      this.$state.token = ''
      this.$state.username = ''
      this.$state.email = ''
      this.$state.image = ''
    }
  },
  persist: true
})
