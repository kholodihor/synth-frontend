<template>
  <div class="page wrapper relative">
    <LinkBtn text="Main Page" url="/" class="home-link" />
    <div class="inner">
      <div class="screen-overlay"></div>
      <div class="image">
        <div class="image-box">
          <img :src="userStore.image" class="img" alt="" />
        </div>
      </div>
      <div class="info">
        <div class="info-inner">
          <h3>{{ userStore.username }}</h3>
          <LinkBtn
            v-if="userStore._id == route.params.id"
            text="Edit Profile"
            url="/account/edit-profile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { User } from '@/types'
import LinkBtn from '@/components/shared/LinkBtn.vue'

const route = useRoute()

defineProps<{
  userStore: User
}>()
</script>

<style scoped lang="scss">
.inner {
  position: relative;
  display: flex;
  width: 90%;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;

  @media screen and (max-width: 650px) {
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

    @media screen and (max-width: 650px) {
      width: 100%;
    }

    @media screen and (max-width: 450px) {
      width: 100vw;
    }

    .image-box {
      width: 20rem;
      border-radius: 20rem;

      @media screen and (max-width: 650px) {
        width: 80vw;
      }

      .img {
        width: 80%;
        object-fit: cover;
        border-radius: 20rem;

        @media screen and (max-width: 650px) {
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

      @media screen and (max-width: 650px) {
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

@keyframes pan-overlay {
  from {
    background-position: 0% 0%;
  }

  to {
    background-position: 0% -100%;
  }
}

.screen-overlay {
  background: linear-gradient(
    rgba(33, 157, 255, 0.15),
    rgba(33, 157, 255, 0.15) 3px,
    transparent 3px,
    transparent 9px
  );
  background-size: 100% 9px;
  height: 100%;
  width: 100%;
  animation: pan-overlay 40s infinite linear;
  position: absolute;
  z-index: -1;
  left: 0px;
  top: 0px;
}
</style>
