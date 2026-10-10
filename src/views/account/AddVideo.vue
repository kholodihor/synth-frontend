<template>
  <div class="page wrapper">
    <h1>Add Video</h1>
    <div class="divider"></div>
    <TextInput
      label="Title"
      placeholder="Title of Video"
      v-model:input="form.title"
      inputType="text"
    />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <TextInput
      label="Video Url"
      placeholder="Add a url of a Youtube Video"
      v-model:input="form.videoUrl"
      inputType="text"
    />
    <span v-for="error in v$.videoUrl.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <SubmitBtn :text="processing ? 'loading...' : 'add video'" @click="addYoutubeVideoLink" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useVideoStore } from '@/stores/videoStore'
import { useVuelidate } from '@vuelidate/core'
import { required, url } from '@vuelidate/validators'
import { notifyError, notifyInvalidForm, notifySuccess } from '@/utils/notify'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'

const router = useRouter()
const userStore = useUserStore()
const videoStore = useVideoStore()

const processing = ref(false)

const form = reactive({
  title: '',
  videoUrl: ''
})

const rules = {
  title: { required },
  videoUrl: { required, url }
}

const v$ = useVuelidate(rules, form)

const addYoutubeVideoLink = async () => {
  if (!(await v$.value.$validate())) {
    notifyInvalidForm()
    return
  }
  processing.value = true
  try {
    await axios.post('api/video', { title: form.title, url: form.videoUrl })
    notifySuccess('New video added!', `You added a video "${form.title}"`)
    await videoStore.fetchVideosByUserId()
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Failed to Add Video', error)
  } finally {
    processing.value = false
  }
}
</script>
