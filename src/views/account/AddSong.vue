<template>
  <div class="page wrapper">
    <h1>Add a Song</h1>
    <div class="divider"></div>
    <TextInput
      label="Song artist"
      placeholder="Who is an Artist"
      v-model:input="form.artist"
      inputType="text"
    />
    <span v-for="error in v$.artist.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <TextInput
      label="Song Title"
      placeholder="Name a New Song"
      v-model:input="form.title"
      inputType="text"
    />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <FileUpload
      label="Song File"
      placeholder="Click to upload a song file"
      id="song-file"
      accept="audio/*"
      @file-selected="(file: File) => (songFile = file)"
      :errorMessage="songError"
    />
    <SubmitBtn @click="addSong" :text="processing ? 'loading...' : 'add song'" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useSongStore } from '@/stores/songStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { notifyError, notifyInvalidForm, notifySuccess } from '@/utils/notify'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import FileUpload from '@/components/shared/FileUpload.vue'

const userStore = useUserStore()
const songStore = useSongStore()
const router = useRouter()

const form = reactive({
  title: '',
  artist: ''
})

const songFile = ref<File | null>(null)
const songError = ref('')
const processing = ref(false)

const rules = {
  title: { required },
  artist: { required }
}

const v$ = useVuelidate(rules, form)

const uploadSongFile = async (file: File) => {
  const formData = new FormData()
  formData.append('song', file)
  const { data } = await axios.post<{ url: string }>('/api/uploadsong', formData)
  return data.url
}

const addSong = async () => {
  songError.value = songFile.value ? '' : 'Song file is required'
  if (!(await v$.value.$validate()) || !songFile.value) {
    notifyInvalidForm()
    return
  }
  processing.value = true
  try {
    const song = await uploadSongFile(songFile.value)
    await axios.post('api/songs', { ...form, song })
    notifySuccess('Song is added!', `You added a song called "${form.title}" by ${form.artist}`)
    await songStore.fetchSongsByUserId()
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Failed to Add Song', error)
  } finally {
    processing.value = false
  }
}
</script>
