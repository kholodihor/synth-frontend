<template>
  <div class="file-upload__wrapper">
    <label :for="id" class="label">{{ label }}</label>
    <div class="file-upload-container" @click="triggerFileInput" :class="{ 'has-file': fileName }">
      <div class="file-upload-content">
        <div class="file-upload-icon">
          <span v-if="!fileName">📁</span>
          <span v-else>📄</span>
        </div>
        <div class="file-upload-text">
          <span v-if="!fileName">{{ placeholder }}</span>
          <span v-else class="file-name">{{ fileName }}</span>
        </div>
      </div>
      <input
        :type="'file'"
        :id="id"
        ref="fileInputRef"
        class="file-upload__input"
        @change="handleFileChange"
        :accept="accept"
      />
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'

const emit = defineEmits(['update:file', 'file-selected'])

const props = defineProps({
  label: { type: String, default: 'Upload File' },
  placeholder: { type: String, default: 'Click to select a file' },
  id: { type: String, default: 'file-upload' },
  accept: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  file: { type: File, default: null }
})

const { label, placeholder, id, accept, errorMessage } = toRefs(props)
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(props.file || null)

const fileName = computed(() => {
  return selectedFile.value ? selectedFile.value.name : ''
})

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
    emit('update:file', input.files[0])
    emit('file-selected', input.files[0])
  }
}
</script>

<style scoped lang="scss">
.file-upload__wrapper {
  margin: 1rem auto;
  width: 60%;
  min-width: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 0.5rem;

  .label {
    align-self: flex-start;
    margin-left: 5%;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #aaa;
  }

  .file-upload-container {
    width: 90%;
    position: relative;
    display: flex;
    align-items: center;
    background: #232323;
    border: 2px dashed #444;
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #219dff;
      background: #2a2a2a;
    }

    &.has-file {
      border-style: solid;
      border-color: #219dff;
    }
  }

  .file-upload-content {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .file-upload-icon {
    font-size: 1.5rem;
    color: #aaa;
  }

  .file-upload-text {
    color: #aaa;
    font-size: 0.9rem;
  }

  .file-name {
    color: white;
    font-weight: 500;
    word-break: break-all;
  }

  .file-upload__input {
    display: none;
  }

  .error-message {
    color: #ff4d4f;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    align-self: flex-start;
    margin-left: 5%;
  }
}
</style>
