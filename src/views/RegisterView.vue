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
    <!-- Error messages will be shown with SweetAlert -->
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
import { useUserStore } from '@/stores/userStore'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators'
import { notifyError, notifyInvalidForm } from '@/utils/notify'
import TextInput from '@/components/shared/TextInput.vue'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isProcessing = ref(false)

// Mirror the backend Joi rules so users see problems before submitting
const usernamePattern = helpers.withMessage(
  'Username can only contain letters, numbers, spaces, underscores and dashes',
  helpers.regex(/^[\p{L}\p{N} _-]+$/u)
)
const passwordPattern = helpers.withMessage(
  'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
)

const rules = computed(() => ({
  username: { required, minLength: minLength(3), usernamePattern },
  email: { required, email },
  password: { required, minLength: minLength(6), passwordPattern },
  confirmPassword: { required, sameAs: sameAs(form.password) }
}))

const v$ = useVuelidate(rules, form)

const register = async () => {
  if (!(await v$.value.$validate())) {
    notifyInvalidForm()
    return
  }
  isProcessing.value = true
  try {
    await userStore.register({
      username: form.username,
      email: form.email,
      password: form.password
    })
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Registration Failed', error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped lang="scss">
.form-button {
  @include formButton;
}

.login-link {
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
