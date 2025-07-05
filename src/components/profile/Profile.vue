<template>
  <div class="profile-container">
    <div class="profile-header">
      <LinkBtn text="Main Page" url="/" class="home-link">
        <i class="fas fa-home"></i>
        Home
      </LinkBtn>
      <LinkBtn
        v-if="userStore._id == route.params.id"
        text="Edit Profile"
        url="/account/edit-profile"
        class="edit-link"
      >
        <i class="fas fa-edit"></i>
        Edit Profile
      </LinkBtn>
    </div>

    <div class="profile-content">
      <div class="profile-image">
        <img
          :src="userStore.image || '/DefaultUserAvatar.png'"
          :alt="userStore.username"
          class="avatar-image"
        />
        <div class="image-overlay"></div>
      </div>

      <div class="profile-info">
        <h1 class="username">{{ userStore.username }}</h1>
        <div class="stats">
          <div class="stat-item">
            <i class="fas fa-music"></i>
            <span>{{ songCount }} Songs</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-video"></i>
            <span>{{ videoCount }} Videos</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-users"></i>
            <span>{{ bandCount }} Bands</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { User } from '@/types'
import LinkBtn from '@/components/shared/LinkBtn.vue'
import { useSongStore } from '@/stores/songStore'
import { useVideoStore } from '@/stores/videoStore'
import { useBandsStore } from '@/stores/bandsStore'

const route = useRoute()
const songStore = useSongStore()
const videoStore = useVideoStore()
const bandsStore = useBandsStore()

defineProps<{
  userStore: Omit<User, 'token'>
}>()

const songCount = computed(() => songStore.songs.length)
const videoCount = computed(() => videoStore.videos.length)
const bandCount = computed(() => bandsStore.bands.length)
</script>

<style scoped lang="scss">
.profile-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }

  .home-link,
  .edit-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba($blue, 0.2);
    border: 1px solid rgba($blue, 0.3);
    border-radius: 0.5rem;
    color: $white;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($blue, 0.3);
      transform: translateY(-2px);
    }

    i {
      font-size: 1.2rem;
    }
  }
}

.profile-content {
  display: flex;
  gap: 3rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba($dark, 0.5);
  border: 1px solid rgba($blue, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.profile-image {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba($blue, 0.3);
  box-shadow: 0 0 20px rgba($blue, 0.2);

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba($blue, 0.1), transparent, rgba($blue, 0.1));
    pointer-events: none;
  }
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    width: 100%;
  }

  .username {
    font-size: 3rem;
    font-weight: 700;
    color: $white;
    text-shadow: 0 0 10px rgba($blue, 0.5);

    @media (max-width: 768px) {
      font-size: 2.5rem;
      text-align: center;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  .stats {
    display: flex;
    gap: 2rem;

    @media (max-width: 768px) {
      justify-content: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    @media (max-width: 480px) {
      gap: 1rem;
    }
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $white;
    font-size: 1.2rem;

    @media (max-width: 480px) {
      font-size: 1rem;
    }

    i {
      color: $blue;
      font-size: 1.5rem;

      @media (max-width: 480px) {
        font-size: 1.3rem;
      }
    }
  }
}
</style>
