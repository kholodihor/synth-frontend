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
        :class="{ 'with-toggle': showToggle }"
      />
      <button 
        v-if="showToggle" 
        type="button" 
        class="password-toggle"
        @click="togglePasswordVisibility"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <span v-if="showPassword">👁️</span>
        <span v-else>👁️‍🗨️</span>
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
  placeholder: { type: String, default: '' },
  showToggle: { type: Boolean, default: false }
})

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const { label, input, inputType, placeholder } = toRefs(props)

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
  position: relative;

  .input-container {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }

  .text__input {
    width: 100%;
    padding: 1rem;
    background: #131313;
    border-radius: 0.5rem;
    color: $white;
    padding-right: 3rem;

    &.with-toggle {
      padding-right: 3.5rem;
    }
  }

  .password-toggle {
    position: absolute;
    right: 0.8rem;
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    font-size: 1rem;
    line-height: 1;
    
    &:hover {
      color: $white;
    }
    
    &:focus {
      outline: none;
      color: $purple;
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
