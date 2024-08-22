import axios from 'axios'
import { defineStore } from 'pinia'
import type { Band } from '@/types'
import Swal from '@/utils/swal'

type Bands = {
  bands: Band[]
}

export const useBandsStore = defineStore('bands', {
  state: (): Bands => ({
    bands: []
  }),

  actions: {
    async getAllBands() {
      try {
        const res = await axios.get('api/bands')
        console.log(res.data)
        this.$state.bands = res.data
      } catch (err) {
        console.log(err)
      }
    },

    async fetchBandsByUserId() {
      try {
        const res = await axios.get('api/user/bands')
        this.$state.bands = res.data
      } catch (err) {
        console.log(err)
      }
    },

    async deleteBand(_id: string, title: string) {
      Swal.fire({
        title: 'Are you sure you want to delete the band "' + title + '"',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, please!',
        confirmButtonColor: '#29fd53',
        cancelButtonColor: 'red'
      }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
          try {
            await axios.delete('api/bands/' + _id)
            this.fetchBandsByUserId()
            Swal.fire({
              title: 'Deleted!',
              text: 'This band has been deleted.',
              icon: 'success',
              confirmButtonColor: '#219dff'
            })
          } catch (err) {
            console.log(err)
          }
        }
      })
    },

    bandImage(image: string): string {
      return import.meta.env.VITE_APP_API_URL + image
    },

    clearBands() {
      this.$state.bands = []
    }
  },
  persist: true
})
