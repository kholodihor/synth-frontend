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
    <CroppedImage :image="imageFile || ''" />
    <FileUpload
      id="band-image-upload"
      label="Upload Band Image"
      accept="image/*"
      :error="v$.image.$errors[0]?.$message"
      @file-selected="handleFileSelected"
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
import Swal from '@/utils/swal'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useBandsStore } from '@/stores/bandsStore'
import { useUserStore } from '@/stores/userStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue'
import TextArea from '@/components/shared/TextArea.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'
import FileUpload from '@/components/shared/FileUpload.vue'

const bandsStore = useBandsStore()
const userStore = useUserStore()
const router = useRouter()

interface FormData {
  title: string
  description: string
  location: string
  image: string | File
}

const form = reactive<FormData>({
  title: '',
  description: '',
  location: '',
  image: ''
})

const imageFile = ref('')
const processing = ref(false)

const rules = {
  title: { required },
  description: { required },
  location: { required },
  image: { required }
}

const v$ = useVuelidate(rules, form)

const handleFileSelected = (file: File | null) => {
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        imageFile.value = reader.result
      }
    }
    reader.readAsDataURL(file)
    form.image = file
  } else {
    imageFile.value = ''
    form.image = ''
  }
}

const getUploadedImage = async () => {
  try {
    if (imageFile.value) {
      const { data } = await axios.post('/api/uploadbandimage', {
        image: imageFile.value
      })
      form.image = data.url
      return true
    }
    return false
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Upload error:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload the image. Please try again.'
      })
    } else {
      console.error('An unexpected error occurred:', error)
    }
    return false
  }
}

const addBand = async () => {
  processing.value = true

  try {
    if (imageFile.value) {
      const uploadSuccess = await getUploadedImage()
      if (!uploadSuccess) {
        processing.value = false
        return
      }
    }

    const result = await v$.value.$validate()
    if (result) {
      try {
        await axios.post('/api/bands', {
          title: form.title,
          location: form.location,
          description: form.description,
          image: form.image
        })

        await bandsStore.fetchBandsByUserId()

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Band added successfully!'
        })

        router.push('/account/profile/' + userStore._id)
      } catch (error) {
        console.error('Error adding band:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add the band. Please try again.'
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Something went wrong!',
        text: 'You dont fill all fields that are required or inputs are invalid',
        confirmButtonColor: '#219dff'
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred. Please try again.'
    })
  } finally {
    processing.value = false
  }
}
</script>
