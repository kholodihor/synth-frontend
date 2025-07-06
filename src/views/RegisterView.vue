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
      :show-toggle="true"
    />
    <span v-for="error in v$.password.$errors" :key="error.uid" class="error">{{
      error.$message
    }}</span>
    <TextInput
      label="Confirm Password"
      inputType="password"
      placeholder="Confirm Your Password"
      v-model:input="form.confirmPassword"
      :show-toggle="true"
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
import { useRouter, RouterLink } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import * as Effect from 'effect/Effect'
import axios from 'axios'
import Swal from '@/utils/swal'
import TextInput from '@/components/shared/TextInput.vue'
import { useUserStore } from '@/stores/userStore'
import { AuthService, runAuthEffect } from '@/services/effect/auth.service'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const isProcessing = ref(false)

const rules = computed(() => ({
  username: {
    required,
    minLength: minLength(3),
    maxLength: (value: string) => value.length <= 30 || 'Username cannot exceed 30 characters'
  },
  email: {
    required,
    email
  },
  password: {
    required,
    minLength: minLength(6)
  },
  confirmPassword: {
    required,
    sameAs: sameAs(form.password, 'Passwords do not match')
  }
}))

const v$ = useVuelidate(rules, form)

const register = async () => {
  errorMessage.value = ''
  const result = await v$.value.$validate()

  if (!result) {
    errorMessage.value = 'Please fill in all required fields correctly.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  isProcessing.value = true

  try {
    // Run the registration effect
    const registerEffect = Effect.gen(function* () {
      const authService = yield* AuthService
      const { token, userId, user } = yield* authService.register(
        form.username,
        form.email,
        form.password
      )

      // Set the authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Set user details in the store with required fields
      userStore.setUserDetails({
        data: {
          token,
          _id: userId,
          username: user?.username || form.username,
          email: form.email,
          image: ''
        }
      })

      // Show success message
      yield* Effect.promise(() =>
        Swal.fire({
          title: 'Registration Successful!',
          text: 'Your account has been created successfully.',
          icon: 'success',
          confirmButtonColor: '#219dff',
          timer: 2000,
          timerProgressBar: true
        })
      )

      // Fetch additional user data
      yield* authService.fetchUserData()

      return userId
    })

    // Execute the effect with proper error handling
    const registerResult = await runAuthEffect(registerEffect)

    if (registerResult.success) {
      // Registration successful, navigate to profile
      router.push(`/account/profile/${registerResult.data}`)
    } else if (registerResult.error) {
      // Handle error
      const { error } = registerResult
      errorMessage.value = error.message

      // Set field-specific errors if available
      if (error.field) {
        if (error.field === 'email') {
          v$.email.$errors = [{ $message: error.message }]
        } else if (error.field === 'password') {
          v$.password.$errors = [{ $message: error.message }]
        } else if (error.field === 'username') {
          v$.username.$errors = [{ $message: error.message }]
        }
      }

      await Swal.fire({
        title: 'Registration Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    }
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = 'An unexpected error occurred during registration'
    await Swal.fire({
      title: 'Registration Error',
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

.login-link:hover {
  color: $blue;
  text-shadow: 2px 2px 5px $blue, -2px -2px 5px $blue;
}
</style>
