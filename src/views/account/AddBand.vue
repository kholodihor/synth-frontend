<template>
  <div class="page wrapper">
    <h1>Add a Band</h1>
    <div class="divider"></div>
    <TextInput
      label="band name"
      inputType="text"
      placeholder="Band Name"
      v-model:input="form.title"
    />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <TextInput
      label="Country of the Band"
      inputType="text"
      placeholder="Band Country"
      v-model:input="form.location"
    />
    <span v-for="error in v$.location.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <CroppedImage :image="preview" />
    <FileUpload
      label="Band Image"
      placeholder="Click to upload a band image"
      id="band-image"
      accept="image/*"
      @file-selected="select"
      :errorMessage="imageError"
    />
    <TextArea
      label="description"
      placeholder="Add an information about this band here"
      v-model:description="form.description"
    />
    <span v-for="error in v$.description.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <SubmitBtn :text="processing ? 'loading...' : 'add band'" @submit="addBand" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useImageUpload } from '@/composables/useImageUpload'
import { notifyError, notifyInvalidForm, notifySuccess } from '@/utils/notify'
import TextInput from '@/components/shared/TextInput.vue'
import TextArea from '@/components/shared/TextArea.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'
import FileUpload from '@/components/shared/FileUpload.vue'

const userStore = useUserStore()
const bandsStore = useBandsStore()
const router = useRouter()
const { preview, select, upload } = useImageUpload('/api/uploadbandimage')

const form = reactive({
  title: '',
  description: '',
  location: ''
})

const processing = ref(false)
const imageError = ref('')

const rules = {
  title: { required },
  description: { required },
  location: { required }
}

const v$ = useVuelidate(rules, form)

const addBand = async () => {
  imageError.value = preview.value ? '' : 'Band image is required'
  if (!(await v$.value.$validate()) || imageError.value) {
    notifyInvalidForm()
    return
  }
  processing.value = true
  try {
    const image = await upload()
    await axios.post('api/bands', { ...form, image })
    notifySuccess('Band is added!', `The band you added is called "${form.title}"`)
    await bandsStore.fetchBandsByUserId()
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Failed to Add Band', error)
  } finally {
    processing.value = false
  }
}
</script>
