<template>
  <div class="page wrapper">
    <h1>Login</h1>
    <TextInput label="email" inputType="text" placeholder="Your Email" v-model:input="form.email" />
    <span v-for="error in v$.email.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <TextInput
      label="password"
      inputType="password"
      placeholder="Your Password"
      v-model:input="form.password"
    />
    <span v-for="error in v$.password.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <span v-if="errorMessage" class="error">{{ handleErrors(errorMessage) }}</span>
    <button @click="login" class="form-button">{{ isProcessing ? 'processing' : 'login' }}</button>
    <RouterLink to="/register"
      >Do not have an account? <span class="register-link">Register!</span></RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import Swal from '@/utils/swal'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useSongStore } from '@/stores/songStore'
import { useVideoStore } from '@/stores/videoStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVuelidate } from '@vuelidate/core'
import { handleErrors } from '@/utils/handleErrors'
import { required, email, minLength } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue'

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isProcessing = ref(false)

const router = useRouter()
const userStore = useUserStore()
const profileStore = useProfileStore()
const songStore = useSongStore()
const videoStore = useVideoStore()
const bandsStore = useBandsStore()

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) }
}

const v$ = useVuelidate(rules, form)

const login = async () => {
  errorMessage.value = ''
  const result = await v$.value.$validate()
  
  if (!result) {
    errorMessage.value = 'Please fill in all required fields correctly.'
    return
  }

  isProcessing.value = true
  
  try {
    const res = await axios.post('api/user/login', {
      email: form.email.trim().toLowerCase(),
      password: form.password
    })
    
    if (!res.data?.token) {
      throw new Error('No authentication token received')
    }
    
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
    userStore.setUserDetails(res)
    
    // Fetch all user data in parallel
    await Promise.all([
      profileStore.fetchProfileById(),
      songStore.fetchSongsByUserId(),
      bandsStore.fetchBandsByUserId(),
      videoStore.fetchVideosByUserId()
    ])
    
    router.push('/account/profile/' + userStore._id)
    
  } catch (error: unknown) {
    let errorMessageText = 'An error occurred during login. Please try again.'
    
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data
      
      // Handle standardized error responses
      if (responseData && typeof responseData === 'object') {
        // Use the message from the response if available
        if (responseData.message) {
          errorMessageText = responseData.message
          
          // If the backend specifies which field has an error, highlight it
          if (responseData.field) {
            // Set specific validation error for the field
            if (responseData.field === 'email') {
              v$.email.$errors = [{ $message: errorMessageText }]
            } else if (responseData.field === 'password') {
              v$.password.$errors = [{ $message: errorMessageText }]
            }
          }
        } else if (responseData.error) {
          errorMessageText = responseData.error
        }
      } else {
        // Fallback to status-based messages
        if (error.response?.status === 401) {
          errorMessageText = 'Invalid email or password. Please try again.'
          v$.password.$errors = [{ $message: errorMessageText }]
        } else if (error.response?.status === 404) {
          errorMessageText = 'User not found. Please check your email.'
          v$.email.$errors = [{ $message: errorMessageText }]
        } else if (error.response?.status === 500) {
          errorMessageText = 'Server error. Please try again later.'
        }
      }
    } else if (error instanceof Error) {
      errorMessageText = error.message
    }
    
    errorMessage.value = errorMessageText
    
    await Swal.fire({
      title: 'Login Failed',
      text: errorMessageText,
      icon: 'error',
      confirmButtonColor: '#219dff'
    })
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped lang="scss">
.form-button {
  @include formButton;
}

.register-link:hover {
  color: $blue;
  text-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
}
</style>
