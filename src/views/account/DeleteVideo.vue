<template>
  <div class="page">
    <div class="wrapper">
      <h1>Delete Video</h1>
      <div class="divider"></div>
      
      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-4">
        <p>Loading videos...</p>
      </div>
      
      <!-- No Videos Message -->
      <div v-else-if="videos.length === 0" class="text-center py-4">
        <p>No videos found.</p>
      </div>
      
      <!-- Videos List -->
      <div v-else>
        <div v-for="(video) in videos" :key="video._id" class="videowrapper mb-4 p-4 border rounded">
          <div class="title mb-2">
            <iframe class="w-full h-40" :src="replaceUrl(video.url)" frameborder="0" allowfullscreen></iframe>
            <h4 class="text-lg font-semibold mt-2">{{ video.title }}</h4>
          </div>
          <button 
            @click="confirmDelete(video)"
            :disabled="isDeletingId === video._id"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': isDeletingId === video._id }"
          >
            {{ isDeletingId === video._id ? 'Deleting...' : 'Delete Video' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Video } from '@/types';
import { replaceUrl } from '@/helpers';
import * as Effect from 'effect/Effect';
import { VideoService, runVideoEffect } from '@/services/effect/video.service';
import Swal from '@/utils/swal';

// State
const videos = ref<Video[]>([]);
const isLoading = ref(true);
const isDeletingId = ref<string | null>(null);
const successMessage = ref('');
const errorMessage = ref('');

// Clear error messages
const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

// Clear success message after delay
const clearSuccessMessage = () => {
  if (successMessage.value) {
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  }
};

// Fetch videos when component mounts
const fetchVideos = async () => {
  clearMessages();
  isLoading.value = true;
  
  try {
    const fetchEffect = Effect.gen(function* () {
      const videoService = yield* VideoService;
      return yield* videoService.getVideosByUserId();
    });

    const result = await runVideoEffect(fetchEffect);
    
    if (result.success && result.data) {
      videos.value = result.data;
    } else if (result.error) {
      errorMessage.value = result.error.message || 'Failed to load videos. Please try again.';
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    errorMessage.value = 'An unexpected error occurred while loading videos. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async (video: Video) => {
  clearMessages();
  
  const result = await Swal.fire({
    title: `Delete "${video.title}"?`,
    text: "This action cannot be undone. The video will be permanently removed.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    focusCancel: true
  });

  if (!result.isConfirmed) return;
  
  await deleteVideo(video);
};

const deleteVideo = async (video: Video) => {
  isDeletingId.value = video._id;
  clearMessages();
  
  try {
    const deleteEffect = Effect.gen(function* () {
      const videoService = yield* VideoService;
      
      // Delete the video
      yield* videoService.deleteVideo(video._id);
      
      // Fetch updated videos list
      return yield* videoService.getVideosByUserId();
    });

    const deleteResult = await runVideoEffect(deleteEffect);
    
    if (deleteResult.success) {
      // Update the local videos list
      if (deleteResult.data) {
        videos.value = deleteResult.data;
      }
      
      successMessage.value = 'Video deleted successfully.';
      clearSuccessMessage();
    } else if (deleteResult.error) {
      errorMessage.value = deleteResult.error.message || 'Failed to delete the video. Please try again.';
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again later.';
  } finally {
    isDeletingId.value = null;
  }
};

// Fetch videos when component mounts
onMounted(() => {
  fetchVideos();
});
</script>

<style scoped lang="scss">
.videowrapper {
  @include deleteWrapper;
  
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  
  .title {
    margin-bottom: 1rem;
    
    iframe {
      border-radius: 0.375rem;
      margin-bottom: 0.5rem;
    }
    
    h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }
  }
  
  button {
    width: 100%;
    padding: 0.5rem 1rem;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: all 0.2s ease-in-out;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .videowrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .title {
      flex: 1;
      margin-bottom: 0;
      margin-right: 1.5rem;
      
      iframe {
        margin-bottom: 0.5rem;
      }
    }
    
    button {
      width: auto;
      min-width: 120px;
    }
  }
}
</style>