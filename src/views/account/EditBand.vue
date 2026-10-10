<template>
  <div class="page wrapper">
    <h1>Edit Band</h1>
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
      label="band Country"
      inputType="text"
      placeholder="Band Country"
      v-model:input="form.location"
    />
    <span v-for="error in v$.location.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <CroppedImage :image="preview || form.image || DefaultAvatar" />
    <div class="inputbox">
      <label for="image">
        Upload Image
        <input type="file" hidden id="image" accept="image/*" @change="handleFile" />
        <span v-for="error in v$.image.$errors" :key="error.uid" class="error">{{
          error.$message
        }}</span>
      </label>
    </div>
    <TextArea
      label="description"
      placeholder="Add more information here"
      v-model:description="form.description"
    />
    <span v-for="error in v$.description.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <SubmitBtn :text="processing ? 'loading...' : 'edit band'" @submit="updateBand" />
  </div>
</template>

<script setup lang="ts">
import type { Band } from '@/types'
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import DefaultAvatar from '/DefaultUserAvatar.png'

const route = useRoute()
const router = useRouter()
const bandsStore = useBandsStore()
const userStore = useUserStore()
const { preview, select, upload } = useImageUpload('/api/uploadbandimage')

const form = reactive({
  title: '',
  description: '',
  location: '',
  image: ''
})

const processing = ref(false)

const rules = {
  title: { required },
  description: { required },
  location: { required },
  image: { required }
}

const v$ = useVuelidate(rules, form)

onMounted(async () => {
  try {
    const { data } = await axios.get<Band>(`api/bands/${route.params.id}`)
    Object.assign(form, {
      title: data.title,
      location: data.location,
      image: data.image,
      description: data.description
    })
  } catch (error) {
    notifyError('Failed to Load Band', error)
  }
})

const handleFile = async (event: Event) => {
  await select((event.target as HTMLInputElement).files?.[0])
  // Satisfy the "image required" rule while the new image is pending upload
  if (preview.value && !form.image) form.image = preview.value
}

const updateBand = async () => {
  if (!(await v$.value.$validate())) {
    notifyInvalidForm()
    return
  }
  processing.value = true
  try {
    const image = (await upload()) ?? form.image
    await axios.patch(`api/bands/${route.params.id}`, { ...form, image })
    notifySuccess('Band is updated!', `You edited a band called "${form.title}"`)
    await bandsStore.fetchBandsByUserId()
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Failed to Update Band', error)
  } finally {
    processing.value = false
  }
}
</script>
