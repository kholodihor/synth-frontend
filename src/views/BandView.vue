<template>
  <div class="page wrapper">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading band details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <div class="actions">
        <button @click="getBandById" class="retry-button">
          <i class="fas fa-redo"></i>
          Retry
        </button>
        <router-link to="/bands" class="back-button">
          <i class="fas fa-arrow-left"></i>
          Back to Bands
        </router-link>
      </div>
    </div>

    <div v-else class="band-details">
      <div class="header">
        <h1>{{ band.title }}</h1>
        <div class="location">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ band.location }}</span>
        </div>
      </div>

      <div class="content">
        <div class="image-container">
          <img :src="band.image" :alt="band.title" />
        </div>

        <div class="description">
          <p>{{ band.description }}</p>
        </div>

        <div v-if="band.user" class="author-info">
          <div class="avatar">
            <img :src="band.user.avatarUrl" :alt="band.user.username" />
          </div>
          <div class="details">
            <p class="label">Added by</p>
            <p class="username">{{ band.user.username }}</p>
          </div>
        </div>
      </div>

      <div class="actions">
        <router-link to="/bands" class="back-button">
          <i class="fas fa-arrow-left"></i>
          Back to Bands
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import type { Band } from '@/types';

const route = useRoute()
const isLoading = ref(true)
const error = ref('')

const band = ref<Band>({
  _id: '',
  title: '',
  image: '',
  location: '',
  description: ''
})

onMounted(async () => {
  await getBandById()
})

const getBandById = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const res = await axios.get<Band>('api/bands/' + route.params.id)
    band.value = res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || err.message
    } else {
      error.value = 'An unexpected error occurred'
    }
    console.error('Error fetching band details:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  
  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: rgba($white, 0.7);
  }
  
  p {
    color: rgba($white, 0.9);
    margin: 0.5rem 0;
  }
}

.error-state {
  i {
    color: $red;
  }
  
  p {
    color: $red;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba($blue, 0.3);
  border-radius: 50%;
  border-top-color: $blue;
  animation: spin 1s linear infinite;
}

.band-details {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba($black, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba($white, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    color: $white;
    margin-bottom: 0.5rem;
  }
  
  .location {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: rgba($white, 0.7);
    
    i {
      color: $blue;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba($blue, 0.2);
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba($white, 0.9);
  text-align: justify;
  padding: 0 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba($white, 0.05);
  border-radius: 8px;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid $blue;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .details {
    .label {
      font-size: 0.875rem;
      color: rgba($white, 0.7);
      margin: 0;
    }
    
    .username {
      font-size: 1.1rem;
      color: $blue;
      margin: 0;
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.retry-button,
.back-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.retry-button {
  background: rgba($blue, 0.2);
  border: 1px solid $blue;
  color: $blue;
  
  &:hover {
    background: rgba($blue, 0.3);
  }
}

.back-button {
  background: rgba($white, 0.1);
  border: 1px solid rgba($white, 0.2);
  color: $white;
  
  &:hover {
    background: rgba($white, 0.15);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>