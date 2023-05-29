import { defineStore } from "pinia";
import type { Girl } from "@/types";

type Girls = {
  girls: Girl[];
};

export const useGirlsStore = defineStore({
  id: "Girls",
  state(): Girls {
    return {
      girls: [
        {
          id: 1,
          name: "Opale",
          image: "girls/opale.webp",
          url: "https://www.youtube.com/watch?v=gYwlhIM4sMg",
        },
        {
          id: 2,
          name: "Bertine Zetlitz",
          image: "girls/bertine.webp",
          url: "https://www.youtube.com/watch?v=Cio5P-VE-CM",
        },
        {
          id: 3,
          name: "Black Nail Cabaret",
          image: "girls/black.webp",
          url: "https://www.youtube.com/watch?v=Yj1RGifPEpwg",
        },
        {
          id: 4,
          name: "Client",
          image: "girls/client.webp",
          url: "https://www.youtube.com/watch?v=yvY7BYhuJD8",
        },
        {
          id: 5,
          name: "Foretaste",
          image: "girls/foretaste.webp",
          url: "https://www.youtube.com/watch?v=s6E8MR4yyu0",
        },
        {
          id: 6,
          name: "Echoberyl",
          image: "girls/echoberyl.webp",
          url: "https://www.youtube.com/watch?v=tl0zfcOau_E",
        },

        {
          id: 7,
          name: "Keep Shelly in Athens",
          image: "girls/shelly.webp",
          url: "https://www.youtube.com/watch?v=a4TQt1s-Go0",
        },
        {
          id: 8,
          name: "Daybehavior",
          image: "girls/daybehavior.webp",
          url: "https://www.youtube.com/watch?v=a4TQt1s-Go0",
        },
      ],
    };
  },
});
