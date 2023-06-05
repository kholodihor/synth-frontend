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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBandsStore } from '@/stores/bandsStore'
import { useUserStore } from '@/stores/userStore'
import LinkBtn from "@/components/shared/LinkBtn.vue";
import type { Band } from '@/types';
import  Card from '@/components/shared/Card.vue'

const route = useRoute()
const bandsStore = useBandsStore()
const userStore = useUserStore()

const bands = ref<Band[]>([])

onMounted(async () => {
  await bandsStore.fetchBandsByUserId()
  bands.value = bandsStore.bands
})

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
  }
}
</style>
