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
      this.$patch({
        _id: res.data._id,
        token: res.data.token,
        username: res.data.username,
        email: res.data.email
      })
    },

    async fetchUser() {
      try {
        const res = await axios.get('api/user')
        this.$patch({
          _id: res.data._id,
          username: res.data.username,
          image: res.data.avatarUrl ?
            import.meta.env.VITE_APP_API_URL + 'uploads/images/users/' + res.data.avatarUrl : ''
        })
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },

    userImage(image: string) {
      return import.meta.env.VITE_APP_API_URL + image
    },

    clearUser() {
      this.$patch({
        _id: '',
        token: '',
        username: '',
        email: '',
        image: ''
      })
    }
  },
  persist: true
})
