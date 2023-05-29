import { defineStore } from "pinia";

type Card = {
  image: string;
  url: string;
};

type Cards = {
  cards: Card[];
};

export const useCardsStore = defineStore({
  id: "cards",
  state(): Cards {
    return {
      cards: [
        {
          image: "cards/synthpop--bg.webp",
          url: "https://www.youtube.com/playlist?list=PLfZmxCD5mrzie-LRWagueyp5PLMT56co_",
        },
        {
          image: "cards/synthwave--bg.webp",
          url: "https://www.youtube.com/watch?v=hmphkCD8b_w",
        },
        {
          image: "cards/vaporwave--bg.webp",
          url: "https://www.youtube.com/watch?v=QRMPfEnltdM",
        },
        {
          image: "cards/chillwave--bg.webp",
          url: "https://www.youtube.com/watch?v=DmCOuls3JUk",
        },
      ],
    };
  },
});
