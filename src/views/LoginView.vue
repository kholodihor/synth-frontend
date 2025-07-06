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
      :show-toggle="true"
    />
    <span v-for="error in v$.password.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
    <button @click="login" class="form-button">{{ isProcessing ? 'processing' : 'login' }}</button>
    <RouterLink to="/register"
      >Do not have an account? <span class="register-link">Register!</span></RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import * as Effect from 'effect/Effect'
import axios from 'axios'
import Swal from '@/utils/swal'
import TextInput from '@/components/shared/TextInput.vue'
import { useUserStore } from '@/stores/userStore'
import { AuthService, runAuthEffect } from '@/services/effect/auth.service'

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isProcessing = ref(false)

const router = useRouter()
const userStore = useUserStore()
// Other stores are now used within the auth service

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
    // Run the login effect
    const loginEffect = Effect.gen(function* () {
      const authService = yield* AuthService
      const { token, userId, user } = yield* authService.login(form.email, form.password)

      // Set the authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Set user details in the store with required fields
      userStore.setUserDetails({
        data: {
          token,
          _id: userId,
          username: user?.username || '',
          email: form.email,
          image: ''
        }
      })

      // Fetch additional user data
      yield* authService.fetchUserData()

      return userId
    })

    // Execute the effect with proper error handling
    const loginResult = await runAuthEffect(loginEffect)

    if (loginResult.success) {
      // Login successful, navigate to pfrontend/src/services/auth.service.tsrofile
      router.push(`/account/profile/${loginResult.data}`)
    } else if (loginResult.error) {
      // Handle error
      const { error } = loginResult
      errorMessage.value = error.message

      // Set field-specific errors if available
      if (error.field) {
        if (error.field === 'email') {
          v$.email.$errors = [{ $message: error.message }]
        } else if (error.field === 'password') {
          v$.password.$errors = [{ $message: error.message }]
        }
      }

      await Swal.fire({
        title: 'Login Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'An unexpected error occurred during login'
    await Swal.fire({
      title: 'Login Error',
      text: 'An unexpected error occurred. Please try again.',
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
