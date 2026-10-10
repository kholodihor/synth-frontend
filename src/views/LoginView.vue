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
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { notifyError, notifyInvalidForm } from '@/utils/notify'
import TextInput from '@/components/shared/TextInput.vue'

const form = reactive({
  email: '',
  password: ''
})

const isProcessing = ref(false)

const router = useRouter()
const userStore = useUserStore()

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) }
}

const v$ = useVuelidate(rules, form)

const login = async () => {
  if (!(await v$.value.$validate())) {
    notifyInvalidForm()
    return
  }
  isProcessing.value = true
  try {
    await userStore.login({ email: form.email, password: form.password })
    router.push(userStore.profilePath)
  } catch (error) {
    notifyError('Login Failed', error)
  } finally {
    isProcessing.value = false
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
