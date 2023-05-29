<template>
  <div class="page wrapper">
    <h1>Register</h1>
    <TextInput label="name" inputType="text" placeholder="Your Name" v-model:input="form.username" />
    <span v-for="error in v$.username.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="email" inputType="text" placeholder="Your Email" v-model:input="form.email" />
    <span v-for="error in v$.email.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="password" inputType="password" placeholder="Your Password" v-model:input="form.password" />
    <span v-for="error in v$.password.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="Confirm Password" inputType="password" placeholder="Confirm Your Password"
      v-model:input="form.confirmPassword" />
    <span v-for="error in v$.confirmPassword.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <button @click="register" class="form-button">Register</button>
    <RouterLink to="/login">Already have an account? <span class="login-link">Login!</span></RouterLink>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
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
import TextInput from '@/components/shared/TextInput.vue';

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
  confirmPassword: '',
})

const rules = computed(() => {
  return {
    username: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, minLength: minLength(6), sameAs: sameAs(form.password) },
  }
})

const v$ = useVuelidate(rules, form)

const register = async () => {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const response = await axios.post('/api/user/register', {
        username: form.username,
        email: form.email,
        password: form.password
      })
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
      console.log('Response:', response.data)
      userStore.setUserDetails(response)
      await profileStore.fetchProfileById()
      await songStore.fetchSongsByUserId()
      await bandsStore.fetchBandsByUserId()
      await videoStore.fetchVideosByUserId()
      router.push('/account/profile/' + userStore._id)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error message:', error.message);
      } else {
        console.error('An error occurred:', error);
      }
    }
  } else {
    Swal.fire(
      {
        title: 'Opps, something went wrong!',
        text: 'You dont fill all fields that are required or inputs are invalid',
        icon: 'warning',
        confirmButtonColor: "#219dff",
      }
    )
  }
}
</script>

<style scoped lang="scss">
.form-button {
  @include formButton
}

.login-link:hover {
  color: $blue;
  text-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
}
</style>