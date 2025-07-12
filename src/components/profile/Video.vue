<template>
  <div class="video-section">
    <div class="section-header">
      <h2>My Videos</h2>
      <div class="buttons-wrapper" v-if="userStore._id == route.params.id">
        <LinkBtn text="Add Video" url="/account/add-video">
          <i class="fas fa-plus"></i>
          Add Video
        </LinkBtn>
        <LinkBtn
          text="Delete Video"
          url="/account/delete-video"
          :danger="true"
          v-if="videos.length"
        >
          <i class="fas fa-trash"></i>
          Delete Video
        </LinkBtn>
      </div>
    </div>
    <div class="divider"></div>
    <div class="videos-grid">
      <div v-if="videos.length" class="video-items">
        <div v-for="video in videos" :key="video._id" class="video-item">
          <div class="video-frame">
            <iframe
              :src="replaceUrl(video.url)"
              width="100%"
              height="100%"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
      <div v-else class="no-videos">
        <i class="fas fa-video"></i>
        <p>No videos added yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video, User } from '@/types'
import { useRoute } from 'vue-router'
import { replaceUrl } from '@/helpers'
import LinkBtn from '@/components/shared/LinkBtn.vue'

const route = useRoute()

defineProps<{
  videos: Video[]
  userStore: User
}>()
</script>

<style scoped lang="scss">
.video-section {
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

  h2 {
    font-size: 2.5rem;
    color: $white;
    text-shadow: $text-shadow-main;

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

.videos-grid {
  width: 100%;

  .video-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
}

.video-item {
  background: rgba($dark, 0.5);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba($blue, 0.2);

  .video-header {
    padding: 1rem;
    background: rgba($dark, 0.8);

    h4 {
      color: $white;
      font-size: 1.2rem;
      margin: 0;
      text-align: center;

      @media (max-width: 480px) {
        font-size: 1.1rem;
      }
    }
  }

  .video-frame {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}

.no-videos {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
  color: $white;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  i {
    font-size: 3rem;
    color: rgba($blue, 0.5);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.8;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
}
</style>
