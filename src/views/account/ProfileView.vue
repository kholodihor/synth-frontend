<template>
  <div class="page wrapper">
    <LinkBtn text="Main Page" url="/" class="home-link" />
    <div class="inner">
      <div class="image">
        <div class="image-box">
          <img :src="profileStore.image" class="img" alt="">
        </div>
      </div>
      <div class="info">
        <div class="info-inner">
          <h3>{{ profileStore.username }}</h3>
          <LinkBtn v-if="userStore._id == route.params.id" text="Edit Profile" url="/account/edit-profile" />
        </div>
      </div>
    </div>
  </div>
  <SongsSection />
  <VideoSection />
  <BandsSection />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import LinkBtn from '@/components/shared/LinkBtn.vue'
import SongsSection from '@/components/sections/SongsSection.vue';
import VideoSection from '@/components/sections/ProfileVideoSection.vue';
import BandsSection from '@/components/sections/ProfileBandsSection.vue';

const route = useRoute()
const userStore = useUserStore()
const profileStore = useProfileStore()

onMounted(async () => {
  await profileStore.fetchProfileById()
})

</script>

<style scoped lang="scss">
.inner {
  display: flex;
  width: 90%;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.8);

  @media screen and (max-width:650px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .image {
    width: 50%;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;


    @media screen and (max-width:650px) {
      width: 100%;

    }

    @media screen and (max-width:450px) {
      width: 100vw;

    }

    .image-box {
      width: 20rem;
      border-radius: 20rem;

      @media screen and (max-width:650px) {
        width: 80vw;
      }

      .img {
        width: 80%;
        object-fit: cover;
        border-radius: 20rem;

        @media screen and (max-width:650px) {
          width: 100%;

        }
      }
    }
  }

  .info {
    width: 50%;
    padding: 1rem;

    &-inner {
      width: 80%;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 2rem;

      @media screen and (max-width:650px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }

      h3 {
        color: $blue;
        font-size: 2rem;

        text-transform: uppercase;
      }
    }
  }
}

.home-link {
  position: absolute;
  top: 2rem;
  left: 2rem;
}
</style>