<template>
  <div class="songs-section">
    <div class="section-header">
      <h1>My Songs</h1>
      <div class="buttons-wrapper" v-if="userStore._id == route.params.id">
        <LinkBtn text="Add Song" url="/account/add-song">
          <i class="fas fa-plus"></i>
          Add Song
        </LinkBtn>
        <LinkBtn text="Delete Song" url="/account/delete-song" :danger="true" v-if="songs.length">
          <i class="fas fa-trash"></i>
          Delete Song
        </LinkBtn>
      </div>
    </div>
    <div class="divider"></div>
    <div class="player-section">
      <SongPlayer v-if="songs.length" :songs="songs" />
      <div v-else class="no-songs">
        <i class="fas fa-music"></i>
        <p>No songs added yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Song, User } from '@/types'
import LinkBtn from '@/components/shared/LinkBtn.vue'
import SongPlayer from './SongPlayer.vue'

const route = useRoute()

defineProps<{
  songs: Song[]
  userStore: User
}>()
</script>

<style scoped lang="scss">
.songs-section {
  width: 100%;
  padding: 2rem;
  background: $black;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba($dark, 0.5);
  border: 1px solid rgba($blue, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    color: $white;
    text-shadow: 0 0 10px rgba($blue, 0.5);

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
}

.buttons-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;

    :deep(.btn) {
      width: 100%;
      justify-content: center;
    }
  }

  :deep(.btn) {
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

    &.danger {
      background: rgba($red, 0.2);
      border-color: rgba($red, 0.3);

      &:hover {
        background: rgba($red, 0.3);
      }
    }

    i {
      font-size: 1.2rem;
    }
  }
}

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($blue, 0.3),
    transparent
  );
  margin: 1rem 0;
}

.player-section {
  margin-top: 2rem;
}

.no-songs {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: rgba($white, 0.7);

  i {
    font-size: 3rem;
    color: $blue;
  }

  p {
    font-size: 1.2rem;
  }
}
</style>
