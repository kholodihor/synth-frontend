<template>
  <div class="input__wrapper">
    <label for="textInput" class="label">{{ label }}</label>
    <div class="input-container">
      <input
        :type="showPassword ? 'text' : inputType"
        :placeholder="placeholder"
        class="text__input"
        :id="label"
        v-model="computedInput"
      />
      <button
        v-if="inputType === 'password'"
        type="button"
        class="toggle-password"
        @click="togglePasswordVisibility"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <span v-if="showPassword">🙈</span>
        <span v-else>👁️</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref } from 'vue'

const emit = defineEmits(['update:input'])

const props = defineProps({
  label: String,
  input: String,
  inputType: String,
  placeholder: { type: String, default: '' }
})

const { label, input, inputType, placeholder } = toRefs(props)

// Password visibility state
const showPassword = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const computedInput = computed({
  get: () => input?.value,
  set: (val) => emit('update:input', val)
})
</script>

<style scoped lang="scss">
.input__wrapper {
  margin: 1rem auto;
  width: 60%;
  min-width: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 0.5rem;

  .input-container {
    width: 90%;
    position: relative;
    display: flex;
    align-items: center;
  }

  .text__input {
    width: 100%;
    padding: 0.8rem;
    border-radius: 0.5rem;
    background: #232323;
    color: white;
  }

  .toggle-password {
    position: absolute;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    height: 100%;

    &:hover {
      color: white;
    }

    &:focus {
      outline: none;
    }
  }

  .label {
    width: 90%;
    padding: 0.2rem;
    font-size: 0.7rem;
    color: $purple;
    text-align: left;
    text-transform: uppercase;
  }

  .error {
    width: 90%;
    padding: 0.2rem;
    font-size: 0.8rem;
    color: red;
    text-align: left;
  }
}
</style>
