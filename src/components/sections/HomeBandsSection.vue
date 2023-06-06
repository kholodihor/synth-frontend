<template>
  <div class="wrapper">
    <h1>Best SynthPop Bands</h1>
    <div class="divider"></div>
    <div>
      <div class="bands-wrapper">
        <Card v-for="band in bands.slice(0, 3)" :key="band._id" :band="band" />
      </div>
      <div class="link-to-bands-wrapper">
        <router-link class="link-to-bands" to="/bands">View More Bands...</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Band } from '@/types';
import Card from '@/components/shared/Card.vue'

defineProps<{
  bands: Band[]
}>()

</script>

<style scoped lang="scss">
.wrapper {
  padding-bottom: 2rem;

  h1 {
    width: 100%;
    text-align: left;
    text-shadow: $text-shadow-main;
  }

  .buttons-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
  }

  .bands-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media screen and (max-width:850px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width:450px) {
      grid-template-columns: 1fr;
    }

    .card {
      padding: 0.8rem;
      box-shadow: 0 0 2px $white;
      border-radius: 3px;

      .image {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 90%;
          object-fit: cover;
        }
      }

      .bands-content {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 0.5rem;
        flex-direction: column;

        h3 {
          text-transform: uppercase;
          font-size: 1.5rem;
          text-shadow: $text-shadow-main;
        }

        .readmore {
          color: $lightgray;

          &:hover {
            color: $green;
            text-shadow: 0 0 5px $green;
          }
        }
      }

      .country {
        display: inline-block;
        font-size: 0.7rem;
        padding: 0.5rem 0;

      }
    }

    .actions {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      gap: 0.8rem;
      align-items: center;
      margin-top: 1rem;
    }
  }

  .link-to-bands-wrapper {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .link-to-bands {
      color: $lightgray;

      &:hover {
        color: $green;
        text-shadow: 0 0 5px $green;
      }
    }
  }
}
</style>
