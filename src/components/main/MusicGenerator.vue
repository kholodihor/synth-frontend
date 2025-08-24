<template>
  <section class="page">
    <div class="wrapper">
      <h1>AI Music Generator</h1>
      <div class="divider" />

      <form class="generator" @submit.prevent="onSubmit">
        <div class="row">
          <label id="mode-label">Mode</label>
          <div class="neon-select" ref="selectRef">
            <button
              class="neon-select__btn"
              type="button"
              :aria-expanded="open"
              aria-haspopup="listbox"
              aria-labelledby="mode-label"
              @click="toggleOpen"
              @keydown="onTriggerKeydown"
            >
              {{ modeLabel }}
              <span class="chevron" aria-hidden="true">▼</span>
            </button>
            <ul
              v-if="open"
              class="neon-select__list"
              role="listbox"
              aria-labelledby="mode-label"
              tabindex="0"
              @keydown.prevent.stop="onListKeydown"
            >
              <li
                v-for="(opt, i) in modeOptions"
                :key="opt.value"
                class="neon-select__option"
                :class="{ active: i === highlighted, selected: opt.value === mode }"
                role="option"
                :aria-selected="opt.value === mode"
                @mouseenter="highlighted = i"
                @mousedown.prevent
                @click="selectOption(opt.value)"
              >
                {{ opt.label }}
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <label for="prompt">Prompt</label>
          <input id="prompt" class="inputbox" v-model.trim="prompt" type="text" placeholder="e.g. upbeat synthwave with retro vibes" />
        </div>

        <div class="row" v-if="mode === 'with_described_lyrics'">
          <label for="describedLyrics">Described Lyrics</label>
          <textarea id="describedLyrics" class="inputbox" v-model.trim="describedLyrics" rows="4" placeholder="Describe the theme/story for the lyrics"></textarea>
        </div>

        <div class="row" v-if="mode === 'with_lyrics'">
          <label for="lyrics">Lyrics</label>
          <textarea id="lyrics" class="inputbox" v-model.trim="lyrics" rows="6" placeholder="Paste your lyrics here"></textarea>
        </div>

        <div class="row">
          <label for="duration">Duration (seconds)</label>
          <input id="duration" class="inputbox" v-model.number="duration" type="number" min="5" max="120" />
        </div>

        <div class="actions">
          <button type="submit" :disabled="submitting">
            <span v-if="!submitting">Generate</span>
            <span v-else>Generating...</span>
          </button>
        </div>

        <p v-if="error" class="error" role="alert">{{ error }}</p>
      </form>

      <div v-if="result" class="result" aria-live="polite">
        <div class="media">
          <img v-if="coverUrl" :src="coverUrl" alt="Generated cover" />
          <audio v-if="audioUrl" :src="audioUrl" controls preload="none" />
        </div>

        <div v-if="result.categories?.length" class="categories">
          <span class="badge" v-for="(c, i) in result.categories" :key="i">{{ c }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import '@/utils/axios'
import axios from 'axios'

type GenerateResponse = {
  // Audio URLs/keys
  s3_key?: string
  song_url?: string
  audio_url?: string
  audio?: string
  // Image URLs/keys
  cover_image_s3_key?: string
  cover_url?: string
  image_url?: string
  image?: string
  // Metadata
  categories?: string[]
}

const mode = ref<'with_described_lyrics' | 'from_description' | 'with_lyrics'>('with_described_lyrics')
const modeOptions = [
  { value: 'with_described_lyrics', label: 'With Described Lyrics' },
  { value: 'from_description', label: 'From Description' },
  { value: 'with_lyrics', label: 'With Lyrics' },
] as const
const modeLabel = computed(() => modeOptions.find(o => o.value === mode.value)?.label || '')

// custom dropdown state
const open = ref(false)
const highlighted = ref(0)
const selectRef = ref<HTMLElement | null>(null)

function toggleOpen() {
  open.value = !open.value
  if (open.value) {
    const idx = modeOptions.findIndex(o => o.value === mode.value)
    highlighted.value = idx >= 0 ? idx : 0
    nextTick(() => focusList())
  }
}

function focusList() {
  const el = selectRef.value?.querySelector('.neon-select__list') as HTMLElement | null
  el?.focus()
}

function selectOption(val: typeof mode.value) {
  mode.value = val
  open.value = false
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (!open.value) toggleOpen()
  }
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if (e.key === 'ArrowDown') {
    highlighted.value = (highlighted.value + 1) % modeOptions.length
  } else if (e.key === 'ArrowUp') {
    highlighted.value = (highlighted.value - 1 + modeOptions.length) % modeOptions.length
  } else if (e.key === 'Enter' || e.key === ' ') {
    selectOption(modeOptions[highlighted.value].value)
  }
}

function onClickOutside(e: MouseEvent) {
  if (!selectRef.value) return
  if (!selectRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
const prompt = ref('')
const describedLyrics = ref('')
const lyrics = ref('')
const duration = ref<number>(30)
const submitting = ref(false)
const error = ref('')
const result = ref<GenerateResponse | null>(null)

const audioUrl = computed(() =>
  result.value?.s3_key ||
  result.value?.song_url ||
  result.value?.audio_url ||
  result.value?.audio ||
  ''
)

const coverUrl = computed(() =>
  result.value?.cover_image_s3_key ||
  result.value?.cover_url ||
  result.value?.image_url ||
  result.value?.image ||
  ''
)

const endpoints: Record<string, string> = {
  with_described_lyrics: '/api/music/generate-with-described-lyrics',
  from_description: '/api/music/generate-from-description',
  with_lyrics: '/api/music/generate-with-lyrics',
}

async function onSubmit() {
  error.value = ''
  result.value = null

  if (!prompt.value) {
    error.value = 'Prompt is required.'
    return
  }

  try {
    submitting.value = true
    const endpoint = endpoints[mode.value]

    const body: Record<string, any> = { prompt: prompt.value, duration: duration.value }
    if (mode.value === 'with_described_lyrics') body.described_lyrics = describedLyrics.value
    if (mode.value === 'with_lyrics') body.lyrics = lyrics.value

    const { data } = await axios.post<GenerateResponse>(endpoint, body)
    result.value = data
  } catch (e: any) {
    const apiMsg = e?.response?.data?.error
    error.value = apiMsg || e?.message || 'Unexpected error'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.generator {
  width: min(900px, 100%);
  margin: 0 auto 2rem;
  display: grid;
  gap: 1rem;

  .row {
    display: flex;
    flex-direction: column;
    width: 100%;

    label {
      margin-bottom: 0.35rem;
      color: $white;
      text-shadow: $text-shadow-main;
      font-weight: 600;
    }

    input,
    textarea {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba($blue, 0.4);
      color: $white;
      border-radius: 8px;
      padding: 0.75rem 0.9rem;
      outline: none;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;

      &:focus {
        border-color: $blue;
        box-shadow: 0 0 0 3px rgba($blue, 0.25);
      }
    }

    textarea {
      resize: vertical;
    }

    /* Neon custom dropdown */
    .neon-select {
      position: relative;
      width: 100%;

      &__btn {
        width: 100%;
        text-align: left;
        background: linear-gradient(180deg, rgba($black, 0.6), rgba($black, 0.4)) padding-box,
                    linear-gradient(90deg, rgba($blue, 0.7), rgba($purple, 0.7)) border-box;
        border: 1px solid transparent;
        color: $white;
        border-radius: 10px;
        padding: 0.75rem 2.5rem 0.75rem 0.9rem;
        cursor: pointer;
        box-shadow: 0 0 15px rgba($blue, 0.15), inset 0 0 10px rgba($purple, 0.1);
        transition: box-shadow 0.2s ease;

        &:hover {
          box-shadow: 0 0 20px rgba($blue, 0.25), inset 0 0 12px rgba($purple, 0.15);
        }
        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba($blue, 0.3), 0 0 22px rgba($purple, 0.3);
        }

        .chevron {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: $blue;
          text-shadow: 0 0 8px rgba($blue, 0.8);
        }
      }

      &__list {
        position: absolute;
        margin-top: 0.35rem;
        width: 100%;
        max-height: 240px;
        overflow: auto;
        list-style: none;
        padding: 0.35rem;
        background: rgba($black, 0.9);
        border: 1px solid rgba($blue, 0.6);
        border-radius: 10px;
        box-shadow: 0 20px 35px rgba($black, 0.7), 0 0 25px rgba($blue, 0.25);
        outline: none;
        z-index: 50;

        // Neon scrollbar
        &::-webkit-scrollbar {
          width: 10px;
        }
        &::-webkit-scrollbar-track {
          background: rgba($black, 0.6);
          border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba($blue, 0.6), rgba($purple, 0.6));
          border-radius: 10px;
          box-shadow: 0 0 10px rgba($blue, 0.5);
        }
        &::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba($blue, 0.8), rgba($purple, 0.8));
        }
      }

      &__option {
        padding: 0.55rem 0.6rem;
        border-radius: 8px;
        cursor: pointer;
        color: $white;
        transition: background 0.15s ease, box-shadow 0.15s ease;

        &:hover {
          background: rgba($blue, 0.15);
        }

        &.active {
          background: rgba($blue, 0.2);
          box-shadow: inset 0 0 0 1px rgba($blue, 0.5);
        }

        &.selected {
          background: rgba($purple, 0.2);
          box-shadow: inset 0 0 0 1px rgba($purple, 0.5);
        }
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;

    button {
      padding: 0.75rem 1.25rem;
      border: 1px solid $blue;
      background: linear-gradient(180deg, rgba($blue, 0.25), rgba($purple, 0.25));
      color: $white;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px rgba($blue, 0.25);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }
}

.result {
  width: min(900px, 100%);
  margin: 1rem auto 3rem;
  display: grid;
  gap: 1rem;

  .media {
    display: grid;
    gap: 1rem;

    img {
      width: 100%;
      border-radius: 12px;
      border: 1px solid rgba($blue, 0.4);
      box-shadow: 0 10px 30px rgba($black, 0.6);
    }

    audio {
      width: 100%;
      filter: drop-shadow(0 6px 18px rgba($black, 0.5));
    }
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .badge {
      padding: 0.3rem 0.6rem;
      border: 1px solid rgba($pink, 0.6);
      color: $white;
      border-radius: 999px;
      font-size: 0.8rem;
      background: rgba($pink, 0.15);
      text-shadow: $text-shadow-main;
    }
  }
}
</style>
