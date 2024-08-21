<template>
  <div class="wrapper">
    <h1>My Favourite Bands</h1>
    <div class="divider"></div>
    <div class="buttons-wrapper">
      <LinkBtn text="Add Band" url="/account/add-band" v-if="userStore._id == route.params.id" />
    </div>
    <div>
      <div class="bands-wrapper">
        <Card v-for="band in bands" :key="band._id" :band="band" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Band, User } from '@/types'
import { useRoute } from 'vue-router'
import LinkBtn from '@/components/shared/LinkBtn.vue'
import Card from '@/components/shared/Card.vue'

const route = useRoute()

defineProps<{
  bands: Band[]
  userStore: User
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
    place-items: center;

    @media screen and (max-width: 1280px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 550px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
