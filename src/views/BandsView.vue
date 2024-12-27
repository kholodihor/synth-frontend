<template>
  <div class="page wrapper">
    <h1>SynthPop Bands</h1>
    <div class="divider"></div>

    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search bands..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch" class="search-button">
        <i class="fas fa-search"></i>
        Search
      </button>
    </div>

    <div v-if="searchQuery && bands.length > 0" class="view-all-container">
      <button @click="clearSearch" class="view-all-button">
        <i class="fas fa-list"></i>
        View All Bands
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading bands...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="getPaginateBands" class="retry-button">
        <i class="fas fa-redo"></i>
        Retry
      </button>
    </div>

    <template v-else>
      <div class="bands-wrapper">
        <TransitionGroup name="band-list">
          <div class="card" v-for="band in bands" :key="band._id">
            <div class="image">
              <img :src="band.image" :alt="band.title" />
            </div>
            <div class="post-content">
              <h2>{{ band.title }}</h2>
              <p>{{ cutString(band.description) }}</p>
              <div class="footer">
                <div class="avatar-wrapper">
                  <div class="avatar">
                    <img :src="band?.user?.avatarUrl" width="20" :alt="band?.user?.username" />
                  </div>
                  <div class="author">
                    added by
                    <p>{{ band?.user?.username }}</p>
                  </div>
                </div>
                <router-link class="readmore" :to="'/band/' + band._id">Read More...</router-link>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div v-if="bands.length === 0" class="no-results">
        <i class="fas fa-music"></i>
        <p>No bands found</p>
      </div>

      <div class="pagination" v-if="bands.length > 0">
        <v-pagination
          v-model="page"
          :pages="pageCount"
          :range-size="1"
          active-color="#219dff"
          @update:modelValue="getPaginateBands"
        />
      </div>
    </template>

    <LinkBtn text="Main Page" url="/" class="home-link" />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { cutString } from '@/helpers'
import type { Band } from '@/types'
import LinkBtn from '@/components/shared/LinkBtn.vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

const page = ref(1)
const bands = ref<Band[]>([])
const pageCount = ref(0)
const isLoading = ref(false)
const error = ref('')
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim() === '') {
    searchQuery.value = ''
  }
  page.value = 1
  getPaginateBands()
}

interface PaginatedResponse {
  bands: Band[]
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
}

const getPaginateBands = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const res = await axios.get<PaginatedResponse>('api/bands', {
      params: {
        page: page.value,
        limit: 6,
        query: searchQuery.value
      }
    })
    bands.value = res.data.bands
    pageCount.value = res.data.totalPages
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || err.message
    } else {
      error.value = 'An unexpected error occurred'
    }
    console.error('Error fetching paginated bands:', err)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1
  getPaginateBands()
}

onMounted(() => {
  getPaginateBands()
})
</script>

<style scoped lang="scss">
$dark-blue: #1a1f3c;
$white: #fff;
$blue: #219dff;
$red: #ff3b3f;
$black: #000;

.page.wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    color: $white;
    text-align: center;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba($blue, 0.5);

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
}

.loading-state,
.error-state,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: rgba($white, 0.7);

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }

  p {
    color: rgba($white, 0.9);
    margin: 0.5rem 0;
    font-size: 1.1rem;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
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

.retry-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba($blue, 0.2);
  border: 1px solid $blue;
  border-radius: 4px;
  color: $blue;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  &:hover {
    background: rgba($blue, 0.3);
  }

  i {
    font-size: 1rem;
    margin: 0;
    color: $blue;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba($blue, 0.3);
  border-radius: 50%;
  border-top-color: $blue;
  animation: spin 1s linear infinite;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
}

.bands-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0;
    padding: 1rem 0;
  }
}

.band-list-move,
.band-list-enter-active,
.band-list-leave-active {
  transition: all 0.5s ease;
}

.band-list-enter-from,
.band-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.band-list-leave-active {
  position: absolute;
}

.card {
  background: rgba($black, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 480px) {
    padding: 0.75rem;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba($blue, 0.2);
  }

  .image {
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    border-radius: 4px;
    margin-bottom: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.post-content {
  display: flex;
  flex-direction: column;
  flex: 1;

  h2 {
    font-size: 1.25rem;
    color: $white;
    margin-bottom: 0.5rem;

    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }

  p {
    color: rgba($white, 0.8);
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;

    @media (max-width: 480px) {
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba($white, 0.1);
  gap: 1rem;

  @media (max-width: 480px) {
    padding-top: 0.75rem;
    flex-wrap: wrap;
  }
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .author {
    font-size: 0.875rem;
    color: rgba($white, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }

    p {
      display: inline;
      color: $blue;
      margin: 0;
    }
  }
}

.readmore {
  color: $blue;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }

  &:hover {
    color: lighten($blue, 10%);
  }
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
  }
}

.home-link {
  margin-top: 2rem;
  width: fit-content;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    width: 100%;
  }
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: $white;
    background: rgba($dark-blue, 0.6);
    border: 1px solid rgba($blue, 0.3);
    border-radius: 4px;
    transition: all 0.3s ease;
    outline: none;

    &::placeholder {
      color: rgba($white, 0.5);
    }

    &:focus {
      border-color: $blue;
      box-shadow: 0 0 0 2px rgba($blue, 0.2);
      background: rgba($dark-blue, 0.8);
    }
  }

  .search-button {
    padding: 0.75rem 1.5rem;
    background-color: $blue;
    color: $white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: lighten($blue, 5%);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1rem;
    }
  }
}

.view-all-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  .view-all-button {
    padding: 0.75rem 1.5rem;
    background-color: rgba($blue, 0.2);
    color: $white;
    border: 1px solid rgba($blue, 0.3);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba($blue, 0.3);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1rem;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
