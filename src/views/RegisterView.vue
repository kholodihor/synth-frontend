<template>
  <div class="page wrapper">
    <h1>Register</h1>
    <TextInput
      label="name"
      inputType="text"
      placeholder="Your Name"
      v-model:input="form.username"
    />
    <span v-for="error in v$.username.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
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
    <TextInput
      label="Confirm Password"
      inputType="password"
      placeholder="Confirm Your Password"
      v-model:input="form.confirmPassword"
    />
    <span v-for="error in v$.confirmPassword.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <span v-if="form.password !== form.confirmPassword" class="error">Passwords mismatch</span>
    <button @click="register" class="form-button">
      {{ isProcessing ? 'processing' : 'register' }}
    </button>
    <RouterLink to="/login"
      >Already have an account? <span class="login-link">Login!</span></RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import Swal from '@/utils/swal'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useSongStore } from '@/stores/songStore'
import { useVideoStore } from '@/stores/videoStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue'

const router = useRouter()
const userStore = useUserStore()
const profileStore = useProfileStore()
const songStore = useSongStore()
const videoStore = useVideoStore()
const bandsStore = useBandsStore()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const isProcessing = ref(false)

const rules = computed(() => {
  return {
    username: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, minLength: minLength(6), sameAs: sameAs(form.password) }
  }
})

const v$ = useVuelidate(rules, form)

const register = async () => {
  errorMessage.value = ''
  const result = await v$.value.$validate()
  
  if (!result) {
    errorMessage.value = 'Please fill in all required fields correctly.'
    return
  }
  
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isProcessing.value = true
  
  try {
    // Make the registration request
    const response = await axios.post('/api/user/register', {
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password
    })
    
    // Check if we got a token in the response
    if (!response.data?.token) {
      throw new Error('No authentication token received')
    }
    
    // Set the authorization header for future requests
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
    
    // Update user store with the response data
    userStore.setUserDetails(response)
    
    // Show success message
    await Swal.fire({
      title: 'Registration Successful!',
      text: 'Your account has been created successfully.',
      icon: 'success',
      confirmButtonColor: '#219dff',
      timer: 2000,
      timerProgressBar: true
    })
    
    // Fetch user data in the background, but don't wait for it
    Promise.all([
      profileStore.fetchProfileById(),
      songStore.fetchSongsByUserId(),
      bandsStore.fetchBandsByUserId(),
      videoStore.fetchVideosByUserId()
    ]).catch(console.error) // Log any errors but don't block the navigation
    
    // Redirect to profile
    router.push('/account/profile/' + userStore._id)
    
  } catch (error: unknown) {
    console.error('Registration error:', error) // Log the full error for debugging
    let errorMessageText = 'An error occurred during registration. Please try again.'
    let fieldWithError = ''
    
    if (axios.isAxiosError(error)) {
      const response = error.response
      const responseData = response?.data
      
      // Log the full response for debugging
      console.log('Error response:', {
        status: response?.status,
        statusText: response?.statusText,
        data: responseData
      })
      
      // Handle different response formats
      if (typeof responseData === 'string') {
        errorMessageText = responseData
      } else if (responseData && typeof responseData === 'object') {
        // Handle standardized error format
        if (responseData.message) {
          errorMessageText = String(responseData.message)
          
          // If the backend specifies which field has an error, highlight it
          if (responseData.field) {
            fieldWithError = responseData.field
            // Set specific validation error for the field
            if (fieldWithError === 'email') {
              v$.email.$errors = [{ $message: errorMessageText }]
            } else if (fieldWithError === 'password') {
              v$.password.$errors = [{ $message: errorMessageText }]
            } else if (fieldWithError === 'username') {
              v$.username.$errors = [{ $message: errorMessageText }]
            }
          }
        } else if (responseData.error) {
          errorMessageText = String(responseData.error)
        } else if (Array.isArray(responseData.errors)) {
          errorMessageText = responseData.errors.map((e: { msg?: string; message?: string } | string) => {
            if (typeof e === 'string') return e;
            return e.msg || e.message || JSON.stringify(e);
          }).join(', ');
        } else if (Object.keys(responseData).length > 0) {
          // If we have an object with data, try to stringify it
          errorMessageText = JSON.stringify(responseData)
        }
      }
      
      // Handle specific HTTP status codes with default messages
      if (!errorMessageText || errorMessageText.includes('Network Error')) {
        if (response?.status === 400) {
          errorMessageText = 'Invalid registration data. Please check your input.'
        } else if (response?.status === 401) {
          errorMessageText = 'Authentication failed. Please try again.'
        } else if (response?.status === 409) {
          errorMessageText = 'An account with this email already exists.'
        } else if (response?.status === 500) {
          errorMessageText = 'Server error. Please try again later.'
        }
      }
      
      // Fallback to status text if we still don't have a message
      if ((!errorMessageText || errorMessageText === 'Error') && response?.statusText) {
        errorMessageText = response.statusText
      }
    } else if (error instanceof Error) {
      errorMessageText = error.message
    }
    
    // Clean up the error message
    errorMessageText = errorMessageText.replace(/^Error: /, '').trim()
    
    // Update the reactive error message for inline display
    errorMessage.value = errorMessageText
    
    // Show error in a toast notification
    await Swal.fire({
      title: 'Registration Failed',
      text: errorMessageText || 'An unknown error occurred',
      icon: 'error',
      confirmButtonColor: '#219dff',
      allowOutsideClick: false
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

.login-link:hover {
  color: $blue;
  text-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
}
</style>
