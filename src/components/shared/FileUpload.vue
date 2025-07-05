<template>
  <div class="file-upload">
    <label :for="id" class="file-upload__label">
      <i class="fas fa-upload"></i>
      {{ props.label }}
      <input
        type="file"
        :id="props.id"
        ref="fileInput"
        class="file-upload__input"
        :accept="props.accept"
        @change="handleFileChange"
      />
      <div v-if="fileName" class="file-upload__file-name">
        <i class="fas fa-file"></i> {{ fileName }}
      </div>
    </label>
    <div v-if="props.error" class="file-upload__error">
      <i class="fas fa-exclamation-circle"></i> {{ props.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  id?: string
  label?: string
  accept?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: 'file-upload',
  label: 'Upload File',
  accept: 'image/*',
  error: ''
})

const emit = defineEmits(['file-selected'])

const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    fileName.value = file.name
    emit('file-selected', file)
  } else {
    fileName.value = ''
    emit('file-selected', null)
  }
}

// Expose method to clear the file input
const clear = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
    fileName.value = ''
  }
}

defineExpose({
  clear
})
</script>

<style scoped lang="scss">
.file-upload {
  width: 30%;
  margin-bottom: 1rem;

  &__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 2px dashed #4a4a4a;
    border-radius: 8px;
    background-color: #1a1a1a;
    color: #a0a0a0;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 120px;

    &:hover {
      border-color: #7c3aed;
      background-color: rgba(124, 58, 237, 0.05);
      color: #fff;
    }

    i {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  }

  &__input {
    display: none;
  }

  &__file-name {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      color: #7c3aed;
      font-size: 1rem;
      margin: 0;
    }
  }

  &__error {
    margin-top: 0.5rem;
    color: #ef4444;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 1rem;
    }
  }
}
</style>
