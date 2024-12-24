<template>
  <div class="info-block">
    <div class="bg">
      <img src="/infoblock-bg.webp" alt="" />
    </div>
    <div class="container">
      <div class="card" v-for="(card, index) in info" :key="index">
        <img :src="card.image" />
        <div class="content">
          <a :href="card.url" target="_blank">listen</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '@/stores/cardsStore'
import { computed } from 'vue'

// Use computed property for reactive data
const cardsStore = useCardsStore()
const info = computed(() => cardsStore.cards)
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
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      will-change: transform;
      transition: transform 10s ease;
      animation: drive 20s linear infinite;
    }
  }

  .container {
    position: relative;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
    gap: 2rem;
    padding: 2rem;

    .card {
      position: relative;
      height: 400px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      transform: scale(0.9);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(0.95);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .content {
        position: absolute;
        padding: 1rem;
        
        a {
          color: $white;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          
          &:hover {
            color: $blue;
          }
        }
      }
    }
  }
}

@keyframes drive {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
</style>
