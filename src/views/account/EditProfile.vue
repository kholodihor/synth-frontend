<template>
  <div class="page">
    <div class="wrapper">
      <h1>Edit Profile</h1>
      <div class="divider"></div>
      <TextInput
        label="Your New Name"
        inputType="text"
        placeholder="Your Name"
        v-model:input="form.username"
      />
      <span v-for="error in v$.username.$errors" :key="error.uid" class="error">{{
        error.$message
      }}</span>
      <CroppedImage v-if="imageFile || currentImageUrl" :image="imageFile || currentImageUrl" />
      <CroppedImage v-else :image="DefaultAvatar" />
      <FileUpload
        id="profile-image-upload"
        label="Upload Profile Image"
        accept="image/*"
        :error="v$.image.$errors[0]?.$message"
        @file-selected="handleFileSelected"
      />
      <SubmitBtn
        :text="isProcessing ? 'Updating...' : 'Update Profile'"
        :disabled="isProcessing"
        @click="updateUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from '@/utils/swal'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import DefaultAvatar from '/DefaultUserAvatar.png'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'
import FileUpload from '@/components/shared/FileUpload.vue'

const userStore = useUserStore()
const profileStore = useProfileStore()
const router = useRouter()

interface ProfileForm {
  username: string
  image: string | File | null
}

const form = reactive<ProfileForm>({
  username: '',
  image: null
})

const imageFile = ref<string>('')
const currentImageUrl = ref<string>('')
const isProcessing = ref(false)

onMounted(() => {
  form.username = profileStore.username || ''
  currentImageUrl.value = profileStore.image || ''
  form.image = currentImageUrl.value
})

const rules = {
  username: { required },
  image: { required }
}

const v$ = useVuelidate(rules, form)

const handleFileSelected = (file: File | null) => {
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        imageFile.value = reader.result
        // We don't set form.image to the File object anymore
        // Instead, we'll use the base64 string from imageFile.value in getUploadedImage
      }
    }
    reader.readAsDataURL(file)
  } else {
    imageFile.value = ''
    form.image = currentImageUrl.value
  }
}

const getUploadedImage = async (): Promise<boolean> => {
  try {
    if (imageFile.value) {
      // Send the base64 image directly in the request body, like in EditBand.vue
      const { data } = await axios.post('/api/uploadavatar', { image: imageFile.value })
      currentImageUrl.value = data.url
      form.image = data.url
      return true
    } else if (typeof form.image === 'string' && form.image) {
      // If it's already a string URL, no need to upload
      currentImageUrl.value = form.image
      return true
    }
    return false // No valid image
  } catch (error) {
    console.error('Upload error:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: 'Failed to upload the image. Please try again.'
    })
    return false
  }
}

const updateUser = async () => {
  if (isProcessing.value) return

  isProcessing.value = true

  try {
    const uploadSuccess = await getUploadedImage()
    if (!uploadSuccess) {
      isProcessing.value = false
      return
    }

    const result = await v$.value.$validate()
    if (!result) {
      await Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        confirmButtonColor: '#219dff'
      })
      return
    }

    const response = await axios.patch('api/user', {
      username: form.username,
      avatarUrl: currentImageUrl.value || ''
    })

    if (response.data) {
      // Update the store with the new data
      userStore.$patch({
        username: response.data.username,
        image: response.data.avatarUrl
          ? `${import.meta.env.VITE_APP_API_URL}uploads/images/users/${response.data.avatarUrl}`
          : ''
      })

      // Then fetch fresh data
      await userStore.fetchUser()

      await Swal.fire({
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#219dff'
      })

      router.push(`/account/profile/${userStore._id}`)
    }
  } catch (error) {
    console.error('Update error:', error)
    if (axios.isAxiosError(error)) {
      await Swal.fire({
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    } else {
      await Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    }
  } finally {
    isProcessing.value = false
  }
}
</script>
