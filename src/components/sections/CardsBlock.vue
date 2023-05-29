<template>
  <div class="info-block">
    <div class="bg">
      <img src="/infoblock-bg.webp" alt="" />
    </div>
    <div class="container">
      <div class="card" v-for="(card, idx) in info" :key="idx">
        <img :src="card.image" />
        <div class="content">
          <a :href="card.url" target="_blank">listen</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '@/stores/cardsStore';
const info = useCardsStore().cards;
</script>

<style scoped lang="scss">

.info-block {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(1);

  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -10;

    @media (max-width: 995px) {
      margin: 3rem auto;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 10s ease;
      animation: drive 20s linear infinite;
    }

    @keyframes drive {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.3);
      }

      100% {
        transform: scale(1);
      }
    }
  }

  .container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    padding: 2rem;

    .card {
      position: relative;
      width: 25%;
      height: 400px;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      transform: scale(0.9);
      transition: all 1s ease;

      @media (max-width: 995px) {
        width: 40%;
      }

      @media (max-width: 670px) {
        width: 50%;
      }

      @media (max-width: 550px) {
        width: 80%;
      }

      @media (max-width: 450px) {
        width: 90%;
      }

      &:hover {
        transform: scale(1);
      }

      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: $white;
        transform: skew(2deg, 2deg);
        z-index: -1;
      }

      &:nth-child(1)::before {
        background: linear-gradient(315deg, #ff0057, #e64a19);
        filter: blur(5px);
      }

      &:nth-child(2)::before {
        background: linear-gradient(315deg, #89ff00, #00bcd4);
        filter: blur(5px);
      }

      &:nth-child(3)::before {
        background: linear-gradient(315deg, #e91e63, #5d02ff);
        filter: blur(5px);
      }

      &:nth-child(4)::before {
        background: linear-gradient(315deg, #ff0000, #ffc107);
        filter: blur(5px);
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
      }

      .content {
        position: relative;
        padding: 20px;

        a {
          position: relative;
          margin: 10rem 0 0;
          padding: 0.7rem 1.5rem;
          text-decoration: none;
          border: 2px solid $white;
          display: inline-block;
          color: $white;
          text-shadow: 2px 2px 0 $blue, -2px -2px 0 $pink;
          font-weight: 600;
          transition: 0.5s;

          &:hover {
            background: $black;
            border: 2px solid $blue;
            box-shadow: 0 0 15px $blue, inset 0 0 5px $blue;
          }
        }
      }
    }
  }
}
</style>
