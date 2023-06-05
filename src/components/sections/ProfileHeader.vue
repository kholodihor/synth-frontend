<template>
  <div class="profile-header">
    <div class="logo">
      Synth
    </div>
    <div v-if="!profileStore._id">
      <router-link to="/login" class="login">
        Login
      </router-link>
    </div>
    <div v-else class="profile">
      <router-link :to="'/account/profile/' + profileStore._id" class="login">
        Go to Profile
      </router-link>
      <LinkBtn text="LogOut" :danger="true" style="margin-right: 2rem" @click="logOut" />
      <div class="avatar-wrapper">
        <div class="avatar">
          <img :src="profileStore.image" :alt="getFirstLetters(profileStore.username)">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useSongStore } from '@/stores/songStore'
import { useVideoStore } from '@/stores/videoStore'
import { getFirstLetters } from '@/helpers'
import Swal from '@/utils/swal'
import LinkBtn from "@/components/shared/LinkBtn.vue";

const router = useRouter()
const userStore = useUserStore()
const profileStore = useProfileStore()
const songStore = useSongStore()
const videoStore = useVideoStore()

onMounted(async () => {
  await profileStore.fetchProfileById()
})

const logOut = async () => {

  Swal.fire({
    title: `Are you sure you want to logout from 'Synth' ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    confirmButtonColor: '#29fd53',
    cancelButtonColor: 'red',
  }).then(async (result: { isConfirmed: boolean; }) => {
    if (result.isConfirmed) {
      try {
        userStore.clearUser()
        profileStore.clearProfile()
        songStore.clearSongs()
        videoStore.clearVideos()
        window.localStorage.removeItem('token');
        router.push('/')
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  })
}
</script>

<style scoped lang="scss">
.profile-header {
  width: 90%;
  margin: 1rem auto;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $black;
  box-shadow: 0 0 5px $blue;

  @media screen and (max-width:550px) {
    flex-direction: column;
  }

  .logo {
    font-size: 3rem;
    font-style: italic;
    text-shadow: $text-shadow-main;
  }

  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid $blue;
    color: $blue;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;

    &:hover {
      box-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
    }

    @media screen and (max-width:450px) {
      font-size: 0.8rem;
    }
  }

  .profile {
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;


    .avatar-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 1rem;


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
        font-size: 1rem;
        text-transform: capitalize;

      }

    }
  }
}
</style>