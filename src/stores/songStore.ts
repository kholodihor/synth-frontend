import axios from "axios";
import { defineStore } from "pinia";
import type { Song } from "@/types";

type Songs = {
  songs: Song[];
};

export const useSongStore = defineStore("song", {
  state: (): Songs => ({
    songs: [],
  }),

  actions: {
    async fetchSongsByUserId() {
      const res = await axios.get("/api/user/songs");
      if (res.data) {
        this.$state.songs = res.data;
      }
    },

    clearSongs() {
      this.$state.songs = [];
    },
  },
  persist: true,
});
