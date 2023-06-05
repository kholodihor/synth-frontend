import axios from "axios";
import { defineStore } from "pinia";
import type { Video } from "@/types";

type Videos = {
  videos: Video[];
};

export const useVideoStore = defineStore("video", {
  state: (): Videos => ({
    videos: [],
  }),

  actions: {
    async fetchVideos() {
      const res = await axios.get("api/video");
      this.$state.videos = res.data;
    },

    async fetchVideosByUserId() {
      const res = await axios.get("api/user/video");
      if (res.data) {
        this.$state.videos = res.data;
      }
    },

    clearVideos() {
      this.$state.videos = [];
    },
  },
  persist: true,
});
