<template>
  <section class="synthpop-girls" aria-labelledby="section-title">
    <div class="title" id="section-title">
      <SGTitle />
    </div>

    <div class="container">
      <article
        v-for="girl in girls"
        :key="girl.id"
        class="card"
        :class="{ 'card--active': activeCard === girl.id }"
        @mouseenter="activeCard = girl.id"
        @mouseleave="activeCard = null"
        @focus="activeCard = girl.id"
        @blur="activeCard = null"
      >
        <div class="card__image">
          <img :src="girl.image" :alt="girl.name" loading="lazy" />
        </div>

        <div class="card__content">
          <div class="card__details">
            <h2 class="card__title">{{ girl.name }}</h2>
            <a
              :href="girl.url"
              target="_blank"
              rel="noopener noreferrer"
              class="card__link"
              :aria-label="'Listen to ' + girl.name + ' on iTunes'"
            >
              Listen <i class="fa-brands fa-itunes-note" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SGTitle from '@/components/decor/SGTitle.vue'
import { useGirlsStore } from '@/stores/girlsStore'

const girlsStore = useGirlsStore()
const girls = computed(() => girlsStore.girls)
const activeCard = ref<string | number | null>(null)
</script>

<style scoped lang="scss">
.synthpop-girls {
  width: min(90%, 1400px);
  margin: 2rem auto;
  padding: 1rem;
}

.title {
  margin-bottom: clamp(1rem, 3vw, 2rem);
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: clamp(0.8rem, 2vw, 1.5rem);
  justify-items: center;
  padding: 0.5rem;
}

.card {
  position: relative;
  width: 100%;
  height: 22rem;
  background: linear-gradient(90deg, $black, #333);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  transition: box-shadow 0.3s ease;

  &:hover,
  &:focus-within,
  &.card--active {
    box-shadow: 0 5px 20px rgba(56, 39, 39, 0.5), 0 0 10px $pink, 0 0 20px $pink;
  }

  &__image {
    position: absolute;
    inset: 0;
    z-index: 1;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter 0.3s ease;
    }
  }

  &:hover,
  &:focus-within,
  &.card--active {
    .card__image {
      transform: translateY(30px) scale(0.5);

      img {
        filter: brightness(0.8);
      }
    }

    .card__content {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &__content {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 1.5rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3));
    transform: translateY(100%);
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__details {
    text-align: center;
  }

  &__title {
    color: $purple;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba($purple, 0.5);
  }

  &__link {
    display: inline-block;
    text-decoration: none;
    font-size: clamp(0.875rem, 2vw, 1rem);
    color: $blue;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover,
    &:focus-visible {
      color: $green;
      border-color: currentColor;
      outline: none;
      text-shadow: 0 0 10px currentColor;
    }

    i {
      margin-left: 0.5rem;
    }
  }
}
</style>
