<template>
  <div class="audio-player">
    <div ref="playerRef" class="player-container">
      <div class="player-header">
        <div class="now-playing">
          <div class="song-info">
            <h3 class="song-title">{{ currentSong?.title || 'No song selected' }}</h3>
            <p class="song-artist">{{ currentSong?.artist || 'Select a song to play' }}</p>
          </div>
        </div>
        <div class="volume-control">
          <button class="volume-btn" @click="toggleMute" :aria-label="isMuted ? 'Unmute' : 'Mute'">
            <i
              :class="[
                'fas',
                isMuted
                  ? 'fa-volume-mute'
                  : volume > 0.5
                  ? 'fa-volume-up'
                  : volume > 0
                  ? 'fa-volume-down'
                  : 'fa-volume-off'
              ]"
            ></i>
          </button>
          <input
            type="range"
            class="volume-slider"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            @input="updateVolume"
            aria-label="Volume"
          />
        </div>
      </div>

      <div class="progress-container">
        <span class="time current">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seek" ref="progressBar">
          <div class="progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="time duration">{{ formatTime(duration) }}</span>
      </div>

      <div class="controls">
        <button
          class="control-btn"
          @click="previousTrack"
          :disabled="currentIndex <= 0"
          aria-label="Previous track"
        >
          <i class="fas fa-backward"></i>
        </button>

        <button class="control-btn play-btn" @click="togglePlay" aria-label="Play or pause">
          <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
        </button>

        <button
          class="control-btn"
          @click="nextTrack"
          :disabled="currentIndex >= songs.length - 1"
          aria-label="Next track"
        >
          <i class="fas fa-forward"></i>
        </button>

        <button
          class="control-btn"
          @click="toggleRepeat"
          :class="{ active: repeat }"
          aria-label="Toggle repeat"
        >
          <i class="fas fa-redo"></i>
        </button>

        <button
          class="control-btn"
          @click="toggleShuffle"
          :class="{ active: shuffle }"
          aria-label="Toggle shuffle"
        >
          <i class="fas fa-random"></i>
        </button>
      </div>

      <div class="playlist">
        <div
          v-for="(song, index) in songs"
          :key="index"
          class="playlist-item"
          :class="{ active: currentIndex === index }"
          @click="playSong(index)"
        >
          <div class="song-info">
            <span class="song-number">{{ index + 1 }}</span>
            <div class="song-details">
              <span class="song-name">{{ song.title }}</span>
              <span class="song-artist">{{ song.artist }}</span>
            </div>
          </div>
          <span class="song-duration">{{ formatTime(songDurations[index] || 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import type { Song } from '@/types'

const props = defineProps<{
  songs: Song[]
}>()

// State
const audio = ref<HTMLAudioElement | null>(null)
const playerRef = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const currentIndex = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)
const previousVolume = ref(0.7)
const repeat = ref(false)
const shuffle = ref(false)
const isLoading = ref(true)
const songDurations = ref<number[]>([])

// Reset play state when component mounts to ensure consistency
onMounted(() => {
  isPlaying.value = false
})

// Computed
const currentSong = computed(() => props.songs[currentIndex.value])
const progress = computed(() => (currentTime.value / duration.value) * 100 || 0)

// Methods
const initializeAudio = () => {
  audio.value = new Audio()
  audio.value.volume = volume.value
  audio.value.autoplay = false // Explicitly disable autoplay

  audio.value.addEventListener('timeupdate', updateProgress)
  audio.value.addEventListener('ended', handleSongEnd)
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value?.duration || 0
  })

  // Load song durations
  props.songs.forEach((song, index) => {
    const tempAudio = new Audio(song.song)
    tempAudio.addEventListener('loadedmetadata', () => {
      songDurations.value[index] = tempAudio.duration
    })
  })

  isLoading.value = false
}

const togglePlay = async () => {
  if (!audio.value) return

  try {
    if (isPlaying.value) {
      await audio.value.pause()
      isPlaying.value = false
    } else {
      // If we don't have a source yet, load the first song
      if (!audio.value.src && props.songs.length > 0) {
        await playSong(0, true)
      } else {
        await audio.value.play()
        isPlaying.value = true
      }
    }
  } catch (error) {
    console.error('Error toggling play state:', error)
    isPlaying.value = false
  }
}

const updateProgress = () => {
  if (!audio.value) return
  currentTime.value = audio.value.currentTime
}

const seek = (event: MouseEvent) => {
  if (!audio.value || !progressBar.value) return

  const rect = progressBar.value.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const time = percent * duration.value

  audio.value.currentTime = time
  currentTime.value = time
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const updateVolume = () => {
  if (!audio.value) return
  audio.value.volume = volume.value
  if (volume.value > 0) {
    isMuted.value = false
  }
}

const toggleMute = () => {
  if (!audio.value) return

  if (isMuted.value) {
    volume.value = previousVolume.value
    audio.value.volume = volume.value
  } else {
    previousVolume.value = volume.value
    volume.value = 0
    audio.value.volume = 0
  }
  isMuted.value = !isMuted.value
}

const playSong = (index: number, shouldPlay = false) => {
  if (index < 0 || index >= props.songs.length) return

  currentIndex.value = index
  if (!audio.value) return

  audio.value.src = props.songs[index].song
  audio.value.load()
  
  if (shouldPlay) {
    audio.value.play().catch(error => {
      console.error('Error playing song:', error)
      isPlaying.value = false
    })
  } else {
    isPlaying.value = false
  }
  isLoading.value = false
}

const nextTrack = () => {
  if (shuffle.value) {
    const nextIndex = Math.floor(Math.random() * props.songs.length)
    playSong(nextIndex)
  } else if (currentIndex.value < props.songs.length - 1) {
    playSong(currentIndex.value + 1)
  } else if (repeat.value) {
    playSong(0)
  }
}

const previousTrack = () => {
  if (currentTime.value > 3) {
    if (audio.value) audio.value.currentTime = 0
  } else if (currentIndex.value > 0) {
    playSong(currentIndex.value - 1)
  }
}

const handleSongEnd = () => {
  if (repeat.value) {
    playSong(currentIndex.value)
  } else {
    nextTrack()
  }
}

const toggleRepeat = () => {
  repeat.value = !repeat.value
}

const toggleShuffle = () => {
  shuffle.value = !shuffle.value
}

// Lifecycle
onMounted(() => {
  initializeAudio()
  // Don't autoplay on mount
  if (props.songs.length > 0) {
    // Initialize with first song but don't autoplay
    playSong(0, false)
    playSong(0)
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener('timeupdate', updateProgress)
    audio.value.removeEventListener('ended', handleSongEnd)
    audio.value.pause()
  }
})

// Watch for songs prop changes
watch(
  () => props.songs,
  (newSongs) => {
    if (newSongs.length > 0) {
      // Only update the current song but don't auto-play
      playSong(0, false)
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.audio-player {
  width: 100%;
  padding: clamp(1rem, 3vw, 2rem);
}

.player-container {
  background-color: rgba($black, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: clamp(1rem, 3vw, 1.5rem);
  width: min(100%, 800px);
  margin: 0 auto;
  box-shadow: 0 0 15px rgba($blue, 0.2);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.now-playing {
  flex: 1;
  min-width: 0;
}

.song-info {
  .song-title {
    font-size: clamp(1.1rem, 2.5vw, 1.3rem);
    color: $white;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .song-artist {
    font-size: clamp(0.9rem, 2vw, 1rem);
    color: rgba($white, 0.7);
    margin: 0.25rem 0 0;
  }
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .volume-btn {
    background: none;
    border: none;
    color: $white;
    cursor: pointer;
    padding: 0.5rem;

    &:hover {
      color: $blue;
    }
  }

  .volume-slider {
    width: 100px;
    height: 4px;
    appearance: none;
    -webkit-appearance: none;
    background: rgba($white, 0.2);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: $blue;
      border-radius: 50%;
      cursor: pointer;
    }

    &:hover::-webkit-slider-thumb {
      box-shadow: 0 0 10px rgba($blue, 0.5);
    }
  }
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .time {
    font-size: 0.9rem;
    color: rgba($white, 0.7);
    min-width: 45px;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    background: rgba($white, 0.1);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .progress {
      height: 100%;
      background: $blue;
      border-radius: 3px;
      position: relative;
    }
  }
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: 1.5rem;

  .control-btn {
    background: none;
    border: none;
    color: $white;
    cursor: pointer;
    padding: 0.5rem;
    transition: all 0.3s ease;
    opacity: 0.8;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      &:hover {
        transform: none;
      }
    }

    &.active {
      color: $blue;
    }

    &.play-btn {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: $blue;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 1rem;
      box-shadow: 0 0 10px rgba($blue, 0.3);
      opacity: 1;

      i {
        font-size: 1.2rem;
        margin-left: 0.2rem; // Slight offset for play icon to appear centered
      }

      &:hover {
        background: lighten($blue, 10%);
        box-shadow: 0 0 15px rgba($blue, 0.5);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.playlist {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  background: rgba($black, 0.3);
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($white, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($blue, 0.5);
    border-radius: 3px;

    &:hover {
      background: $blue;
    }
  }
}

.playlist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgba($white, 0.1);
  }

  &.active {
    background: rgba($blue, 0.2);

    .song-name {
      color: $blue;
    }
  }

  .song-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  .song-number {
    font-size: 0.9rem;
    color: rgba($white, 0.5);
    min-width: 20px;
  }

  .song-details {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .song-name {
      font-size: 0.95rem;
      color: $white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-artist {
      font-size: 0.85rem;
      color: rgba($white, 0.6);
    }
  }

  .song-duration {
    font-size: 0.85rem;
    color: rgba($white, 0.6);
  }
}
</style>
