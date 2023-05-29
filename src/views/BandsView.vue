<template>
  <div class="page wrapper">
    <h1>SynthPop Bands</h1>
    <div class="divider"></div>
    <div class="bands-wrapper">
      <div class="card" v-for="band in bands" :key="band.id">
        <div class="image">
          <img :src="bandsStore.bandImage(band.image)" alt="" />
        </div>
        <div class="post-content">
          <h1>{{ band.title }}</h1>
          <p>
            {{ cutString(band.description) }}
          </p>
          <div class="footer">
            <div class="avatar-wrapper">
              <div class="avatar">
                <img :src="userStore.userImage(band?.user?.avatarUrl)" width="20" alt="">
              </div>
              <div class="author"> added by <p>{{ band?.user?.username }}</p>
              </div>
            </div>
            <router-link class="readmore" :to="'/band/' + band._id">Read More...</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <v-pagination v-model="page" :pages="pageCount" :range-size="1" active-color="#219dff"
        @update:modelValue="getPaginateBands" />
    </div>
    <LinkBtn text="Main Page" url="/" class="home-link" />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useBandsStore } from '@/stores/bandsStore';
import { useUserStore } from '@/stores/userStore';
import { cutString } from '@/helpers';
import type { Band } from '@/types';
import LinkBtn from '@/components/shared/LinkBtn.vue';
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

const bandsStore = useBandsStore()
const userStore = useUserStore()
const page = ref(1)
const bands = ref<any>([])
const pageCount = ref(0)

onMounted(async () => {
  await getBands()
})

const getPaginateBands = async () => {
  try {
    console.log(page.value)
    const res = await axios.get<Band[]>('api/bands-paginate?page=' + page.value)
    bands.value = res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error message:', error.message);
    } else {
      console.error('An error occurred:', error);
    }
  }
}

const getBands = async () => {
  try {
    const res = await axios.get<Band[]>('api/bands')
    pageCount.value = Math.ceil(res.data.length / 6)
    await getPaginateBands()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error message:', error.message);
    } else {
      console.error('An error occurred:', error);
    }
  }
}
</script>

<style scoped lang="scss">
.bands-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

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


    .post-content {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 0.5rem;
      flex-direction: column;
      padding: 1rem;




      h3 {
        text-transform: uppercase;
      }
    }
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
          border-radius: 100%;
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

  .actions {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
    align-items: center;
    margin-top: 1rem;
  }
}

.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-top: 1rem;
}

.home-link {
  margin-top: 1rem;
}
</style>