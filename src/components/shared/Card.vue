<template>
  <div class="card">
    <div class="image">
      <img :src="band.image" alt="" />
    </div>
    <div class="bands-content">
      <h3>{{ band.title }}</h3>
      <span class="country">{{ band.location }}</span>
      <p class="description">
        {{ cutString(band.description) }}
      </p>
      <div class="actions" v-if="userStore._id === route.params.id">
        <LinkBtn text="Edit Band" :url="'/account/edit-band/' + band._id" :warning="true" />
        <LinkBtn text="Delete Band" @click="deleteBand(band._id, band.title)" :danger="true" />
      </div>
      <div class="footer" v-if="!route.params.id">
        <div class="avatar-wrapper">
          <div class="avatar">
            <img :src="band?.user?.avatarUrl" width="20" alt="" />
          </div>
          <div class="author">
            added by
            <p>{{ band?.user?.username }}</p>
          </div>
        </div>
        <div class="readmore-container">
          <router-link class="readmore" :to="'/band/' + band._id">⏩ Read More</router-link>
        </div>
      </div>
      <div v-else class="readmore-container" style="margin-top: 2rem">
        <router-link class="readmore" :to="'/band/' + band._id">⏩ Read More </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Band } from '@/types'
import { cutString } from '@/helpers'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useBandsStore } from '@/stores/bandsStore'
import LinkBtn from '@/components/shared/LinkBtn.vue'

const userStore = useUserStore()
const bandsStore = useBandsStore()
const route = useRoute()

defineProps<{
  band: Band
}>()

const deleteBand = (_id: string, title: string) => {
  bandsStore.deleteBand(_id, title)
}
</script>

<style scoped lang="scss">
.card {
  aspect-ratio: 3/4;
  padding: 0.5rem;
  box-shadow: 0 0 2px $white;
  border-radius: 3px;
  margin: 0 auto;
  max-height: 35rem;

  .image {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
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
    margin-bottom: auto;
  }

  .description {
    height: 4rem;
  }
  .readmore-container {
    margin-left: auto;
    margin-top: auto;
    padding-left: 1rem;
  }
  .readmore {
    color: $lightgray;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: $green;
      text-shadow: 0 0 5px $green;
    }
  }

  .country {
    display: inline-block;
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
    align-items: center;
    margin-top: 0.5rem;
  }

  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;

    .readmore {
      margin-bottom: 1rem;
      color: $lightgray;

      &:hover {
        color: $green;
        text-shadow: 0 0 5px $green;
      }
    }

    .avatar-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 100%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
          object-fit: cover;
          object-position: center;
        }
      }

      .author {
        font-size: 0.8rem;

        p {
          font-size: 1rem;
          text-transform: capitalize;
        }
      }
    }
  }
}
</style>
