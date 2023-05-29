import axios from "axios";
import { defineStore } from "pinia";
import type { Song } from "@/types";

type Songs = {
  songs: Song[];
};

export const useTopSongsStore = defineStore("topsongs", {
  state: (): Songs => ({
    songs: [],
  }),

  actions: {
    async fetchSongs() {
      let res = await axios.get("/api/topsongs");
      this.$state.songs = res.data;
    },

    clearSongs() {
      this.$state.songs = [];
    },
  },
  persist: true,
});
