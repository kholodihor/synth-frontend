<template>
  <div class="page wrapper">
    <h1>Login</h1>
    <TextInput label="email" inputType="text" placeholder="Your Email" v-model:input="form.email" />
    <span v-for="error in v$.email.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="password" inputType="password" placeholder="Your Password" v-model:input="form.password" />
    <span v-for="error in v$.password.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <button @click="login" class="form-button">login</button>
    <RouterLink to="/register">Do not have an account? <span class="register-link">Register!</span></RouterLink>
  </div>
</template>

<script setup lang="ts" >
import { reactive } from 'vue';
import axios from 'axios'
import Swal from '@/utils/swal'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useSongStore } from '@/stores/songStore'
import { useVideoStore } from '@/stores/videoStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue';

const form = reactive({
  email: '',
  password: '',
})

const router = useRouter()
const userStore = useUserStore()
const profileStore = useProfileStore()
const songStore = useSongStore()
const videoStore = useVideoStore()
const bandsStore = useBandsStore()

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) },
};

const v$ = useVuelidate(rules, form)

const login = async () => {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const res = await axios.post('api/user/login', {
        email: form.email,
        password: form.password,
      })
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
      userStore.setUserDetails(res)
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
        title: 'Something went wrong!',
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

.register-link:hover {
  color: $blue;
  text-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
}
</style>