<template>
  <div class="wrapper">
    <h1>My Favourite Bands</h1>
    <div class="divider"></div>
    <div class="buttons-wrapper">
      <LinkBtn text="Add Band" url="/account/add-band" v-if="userStore._id == route.params.id" />
    </div>
    <div>
      <div class="bands-wrapper">
        <div v-for="band in bands" :key="band._id" class="card">
          <div class="image">
            <img :src="bandsStore.bandImage(band.image)" alt="" />
          </div>
          <div class="bands-content">
            <h3>{{ band.title }}</h3>
            <span class="country">{{ band.location }}</span>
            <p>
              {{ cutString(band.description) }}
            </p>
            <br />
            <router-link class="readmore" :to="'/band/' + band._id">Read More...</router-link>
            <div class="actions" v-if="userStore._id == route.params.id">
              <LinkBtn text="Edit Band" :url="'/account/edit-band/' + band._id" :warning="true" />
              <LinkBtn text="Delete Band" @click="deleteBand(band.title, band._id)" :danger="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from '@/utils/swal'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBandsStore } from '@/stores/bandsStore'
import { useUserStore } from '@/stores/userStore'
import LinkBtn from "@/components/shared/LinkBtn.vue";
import { cutString } from '@/helpers'
import type { Band } from '@/types';

const route = useRoute()
const bandsStore = useBandsStore()
const userStore = useUserStore()

const bands = ref<Band[]>([])

onMounted(async () => {
  await bandsStore.fetchBandsByUserId()
  bands.value = bandsStore.bands
})

const deleteBand = async (title: string, _id: string) => {
  Swal.fire({
    title: 'Are you sure you want to delete the band "' + title + '"',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, please!',
    confirmButtonColor: '#29fd53',
    cancelButtonColor: 'red',
  }).then(async (result: { isConfirmed: boolean; }) => {
    if (result.isConfirmed) {
      try {
        await axios.delete('api/bands/' + _id)
        bandsStore.fetchBandsByUserId()
        Swal.fire(
          'Deleted!',
          'This band has been deleted.',
          'success'
        )
      } catch (err) {
        console.log(err)
      }
    }
  })
}
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
          color: #aaa;

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
}
</style>
