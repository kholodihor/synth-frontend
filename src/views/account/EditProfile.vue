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
      <CroppedImage :image="preview || form.image || DefaultAvatar" />
      <div class="inputbox">
        <label for="image">
          Upload Image
          <input type="file" hidden id="image" accept="image/*" @change="handleImage" />
        </label>
      </div>
      <SubmitBtn :text="processing ? 'loading...' : 'update profile'" @click="updateUser" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useImageUpload } from '@/composables/useImageUpload'
import { notifyError, notifyInvalidForm, notifySuccess } from '@/utils/notify'
import DefaultAvatar from '/DefaultUserAvatar.png'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'

const userStore = useUserStore()
const router = useRouter()
const { preview, select, upload } = useImageUpload('/api/uploadavatar')

const form = reactive({
  username: '',
  image: ''
})

const processing = ref(false)

onMounted(() => {
  form.username = userStore.username
  form.image = userStore.image
})

const rules = {
  username: { required }
}

const v$ = useVuelidate(rules, form)

const handleImage = (event: Event) => select((event.target as HTMLInputElement).files?.[0])

const updateUser = async () => {
  if (!(await v$.value.$validate())) {
    notifyInvalidForm()
    return
  }
  processing.value = true
  try {
    const avatarUrl = (await upload()) ?? form.image
    await axios.patch('api/user', { username: form.username, avatarUrl })
    await userStore.fetchUser()
    await notifySuccess('Success!', 'Profile updated successfully')
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Failed to Update Profile', error)
  } finally {
    processing.value = false
  }
}
</script>
