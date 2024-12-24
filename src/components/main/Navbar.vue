<template>
  <header class="profile-header" role="banner">
    <router-link to="/" class="logo" aria-label="Synth - Home">Synth</router-link>
    
    <nav v-if="!profileStore._id" class="nav-actions">
      <router-link 
        to="/login" 
        class="login-btn"
        aria-label="Login to your account"
      >
        Login
      </router-link>
    </nav>

    <nav v-else class="profile" aria-label="User navigation">
      <router-link 
        :to="'/account/profile/' + profileStore._id" 
        class="login-btn"
        aria-label="Go to your profile"
      >
        Go to Profile
      </router-link>
      
      <LinkBtn 
        text="LogOut" 
        :danger="true" 
        class="logout-btn"
        @click="logOut"
        aria-label="Log out from your account"
      />
      
      <div class="avatar-wrapper">
        <div 
          class="avatar"
          role="img"
          :aria-label="'Profile picture of ' + profileStore.username"
        >
          <img 
            :src="profileStore.image" 
            :alt="getFirstLetters(profileStore.username)"
            loading="lazy"
          />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useSongStore } from '@/stores/songStore'
import { useVideoStore } from '@/stores/videoStore'
import { getFirstLetters } from '@/helpers'
import Swal from '@/utils/swal'
import LinkBtn from '@/components/shared/LinkBtn.vue'

const router = useRouter()
const userStore = useUserStore()
const profileStore = useProfileStore()
const songStore = useSongStore()
const videoStore = useVideoStore()

onMounted(async () => {
  try {
    await profileStore.fetchProfileById()
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
})

const logOut = async () => {
  const result = await Swal.fire({
    title: 'Are you sure you want to logout from Synth?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    confirmButtonColor: '#29fd53',
    cancelButtonColor: 'red',
    focusConfirm: false
  })

  if (result.isConfirmed) {
    try {
      userStore.clearUser()
      profileStore.clearProfile()
      songStore.clearSongs()
      videoStore.clearVideos()
      window.localStorage.removeItem('token')
      await router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      Swal.fire({
        title: 'Logout Failed',
        text: 'Please try again later',
        icon: 'error'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.profile-header {
  width: min(90%, 1200px);
  margin: 1rem auto;
  padding: clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 3rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $black;
  box-shadow: 0 0 5px rgba($blue, 0.5);
  border-radius: 8px;
  gap: clamp(0.5rem, 2vw, 1rem);

  @media (max-width: 550px) {
    flex-direction: column;
    text-align: center;
  }
}

.logo {
  font-size: clamp(2rem, 5vw, 3rem);
  font-style: italic;
  text-shadow: $text-shadow-main;
  text-decoration: none;
  color: inherit;
  transition: text-shadow 0.3s ease;

  &:hover,
  &:focus-visible {
    text-shadow: 0 0 10px $blue;
  }
}

.login-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid $blue;
  color: $blue;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  font-size: clamp(0.8rem, 2vw, 1rem);

  &:hover,
  &:focus-visible {
    box-shadow: 0 0 10px rgba($blue, 0.5);
    background-color: rgba($blue, 0.1);
    outline: none;
  }
}

.profile {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  padding: 0.5rem;

  @media (max-width: 550px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  .logout-btn {
    margin-right: clamp(1rem, 2vw, 2rem);
  }
}

.avatar-wrapper {
  .avatar {
    width: clamp(3rem, 8vw, 4rem);
    height: clamp(3rem, 8vw, 4rem);
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba($blue, 0.3);
    transition: border-color 0.3s ease;

    &:hover {
      border-color: $blue;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
