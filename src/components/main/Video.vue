<template>
  <section class="video-section" aria-labelledby="video-section-title">
    <h1 id="video-section-title">SynthPop Videos</h1>
    <div class="divider" aria-hidden="true"></div>

    <div class="video-grid">
      <article v-for="video in displayedVideos" :key="video._id" class="video-item">
        <h2 class="video-title">{{ video.title }}</h2>
        <div class="video-container">
          <iframe
            :src="getEmbedUrl(video.url)"
            :title="video.title"
            class="video-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Video } from '@/types'

const props = defineProps<{
  videos: Video[]
}>()

const displayedVideos = computed(() => props.videos.slice(0, 3))

function getEmbedUrl(url: string): string {
  // Enhanced URL transformation for better security and performance
  try {
    const videoUrl = new URL(url)

    // Handle YouTube URLs
    if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
      const videoId = videoUrl.searchParams.get('v') || videoUrl.pathname.slice(1)
      return `https://www.youtube-nocookie.com/embed/${videoId}`
    }

    // Handle Vimeo URLs
    if (videoUrl.hostname.includes('vimeo.com')) {
      const videoId = videoUrl.pathname.slice(1)
      return `https://player.vimeo.com/video/${videoId}`
    }

    return url
  } catch (error) {
    console.error('Invalid video URL:', error)
    return url
  }
}
</script>

<style scoped lang="scss">
.video-section {
  width: min(95%, 1400px);
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

#video-section-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  text-align: left;
  text-shadow: $text-shadow-main;
  margin-bottom: 0.5rem;
}

.divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba($blue, 0.5), transparent);
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  justify-items: center;
  padding: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.video-item {
  width: 100%;
  max-width: 460px;

  @media (min-width: 769px) {
    &:last-child:nth-child(odd) {
      grid-column: 1 / -1;
      max-width: 520px;
    }
  }
}

.video-title {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: $purple;
  margin-bottom: 0.75rem;
  text-shadow: 0 0 10px rgba($purple, 0.3);
}

.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: rgba($black, 0.5);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 0 10px rgba($blue, 0.3);
  }
}

.video-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: inherit;
}

@media (max-width: 480px) {
  .video-section {
    padding: 1rem 0.5rem;
  }

  .video-container {
    border-radius: 4px;
  }
}
</style>
