import axios from 'axios'
import { defineStore } from 'pinia'
import type { AuthResponse, User } from '@/types'
import { useBandsStore } from './bandsStore'
import { useSongStore } from './songStore'
import { useVideoStore } from './videoStore'

const emptyUser = (): User => ({
  _id: '',
  token: '',
  username: '',
  email: '',
  image: ''
})

export const useUserStore = defineStore('user', {
  state: emptyUser,

  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    profilePath: (state) => `/account/profile/${state._id}`
  },

  actions: {
    setSession(data: AuthResponse) {
      this.$patch({
        _id: data._id,
        token: data.token,
        username: data.username,
        email: data.email,
        image: data.avatarUrl || ''
      })
    },

    async fetchUser() {
      const { data } = await axios.get('api/user')
      this.$patch({
        _id: data._id,
        username: data.username,
        email: data.email,
        image: data.avatarUrl || ''
      })
    },

    async login(credentials: { email: string; password: string }) {
      const { data } = await axios.post<AuthResponse>('api/user/login', credentials)
      this.setSession(data)
      await this.loadUserContent()
    },

    async register(payload: { username: string; email: string; password: string }) {
      const { data } = await axios.post<AuthResponse>('api/user/register', payload)
      this.setSession(data)
      await this.loadUserContent()
    },

    async loadUserContent() {
      await Promise.all([
        useSongStore().fetchSongsByUserId(),
        useBandsStore().fetchBandsByUserId(),
        useVideoStore().fetchVideosByUserId()
      ])
    },

    logout() {
      this.$patch(emptyUser())
      useSongStore().clearSongs()
      useBandsStore().clearUserBands()
      useVideoStore().clearUserVideos()
    }
  },

  persist: true
})
