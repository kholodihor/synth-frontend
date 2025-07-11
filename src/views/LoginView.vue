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
    <!-- Error messages will be shown with SweetAlert -->
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
  const result = await v$.value.$validate()
  if (result) {
    try {
      isProcessing.value = true
      const res = await axios.post('api/user/login', {
        email: form.email,
        password: form.password
      })
      
      // Check if the response has the success flag
      if (res.data && res.data.success === false) {
        isProcessing.value = false
        Swal.fire({
          title: 'Login Failed',
          text: handleErrors(res.data.message || 'Login failed'),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
        return
      }
      
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
      userStore.setUserDetails(res)
      await profileStore.fetchProfileById()
      await songStore.fetchSongsByUserId()
      await bandsStore.fetchBandsByUserId()
      await videoStore.fetchVideosByUserId()
      isProcessing.value = false
      router.push('/account/profile/' + userStore._id)
    } catch (error) {
      isProcessing.value = false
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data)
        // Handle the new Effect-based error response format
        let errorMsg = 'An error occurred'
        if (error.response?.data) {
          errorMsg = error.response.data.message || error.message
        } else {
          errorMsg = error.message
        }
        
        Swal.fire({
          title: 'Login Failed',
          text: handleErrors(errorMsg),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
      } else {
        console.error('An error occurred:', error)
        Swal.fire({
          title: 'Login Failed',
          text: 'An unexpected error occurred',
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
      }
    }
  } else {
    Swal.fire({
      title: 'Something went wrong!',
      text: 'You dont fill all fields that are required or inputs are invalid',
      icon: 'warning',
      confirmButtonColor: '#219dff'
    })
  }
}
</script>

<style scoped lang="scss">
.form-button {
  @include formButton;
}

.register-link {
  color: $purple;
  cursor: pointer;
}

.error-container {
  width: 60%;
  min-width: 20rem;
  margin: 0.5rem auto;
  text-align: center;
}

.error {
  color: #ff4d4f;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
