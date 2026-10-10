import axios from 'axios'
import { defineStore } from 'pinia'
import type { Band } from '@/types'
import { confirmDanger, notifyError, notifySuccess } from '@/utils/notify'

type BandsState = {
  bands: Band[]
  userBands: Band[]
}

export const useBandsStore = defineStore('bands', {
  state: (): BandsState => ({
    bands: [],
    userBands: []
  }),

  actions: {
    async getAllBands() {
      const { data } = await axios.get<Band[]>('api/bands')
      this.bands = data
    },

    async fetchBandsByUserId() {
      const { data } = await axios.get<Band[]>('api/user/bands')
      this.userBands = data
    },

    async deleteBand(_id: string, title: string) {
      if (!(await confirmDanger(`Are you sure you want to delete the band "${title}"?`))) return
      try {
        await axios.delete(`api/bands/${_id}`)
        await this.fetchBandsByUserId()
        notifySuccess('Deleted!', 'This band has been deleted.')
      } catch (error) {
        notifyError('Delete Failed', error)
      }
    },

    clearUserBands() {
      this.userBands = []
    }
  }
})
