<template>
  <div class="page wrapper">
    <h1>Add Video</h1>
    <div class="divider"></div>
    
    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ successMessage }}
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
      <ul v-if="fieldErrors.length" class="mt-2 list-disc list-inside">
        <li v-for="(error, index) in fieldErrors" :key="index">{{ error }}</li>
      </ul>
    </div>
    
    <TextInput 
      label="Title" 
      placeholder="Title of Video" 
      v-model:input="form.title" 
      inputType="text"
      :class="{ 'border-red-500': fieldErrors.some(e => e.field === 'title') }"
    />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    
    <TextInput 
      label="Video Url" 
      placeholder="Add a url of a Youtube Video" 
      v-model:input="form.videoUrl"
      inputType="text"
      :class="{ 'border-red-500': fieldErrors.some(e => e.field === 'videoUrl') }"
    />
    <span v-for="error in v$.videoUrl.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    
    <SubmitBtn 
      :text="processing ? 'Adding...' : 'Add Video'"  
      @click="addYoutubeVideoLink" 
      :disabled="processing"
      :class="{ 'opacity-50 cursor-not-allowed': processing }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useVuelidate } from '@vuelidate/core';
import { required, url } from '@vuelidate/validators';
import TextInput from '@/components/shared/TextInput.vue';
import SubmitBtn from '@/components/shared/SubmitBtn.vue';
// Swal is used in the template
import * as Effect from 'effect/Effect';
import { VideoService, runVideoEffect } from '@/services/effect/video.service';

interface FieldError {
  field: string;
  message: string;
}

const router = useRouter();
const userStore = useUserStore();

const processing = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const fieldErrors = ref<FieldError[]>([]);
const form = reactive({
  title: '',
  videoUrl: ''
});

// Clear all error messages
const clearErrors = () => {
  errorMessage.value = '';
  fieldErrors.value = [];
};

// Clear success message after a delay
const clearSuccessMessage = () => {
  if (successMessage.value) {
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  }
};

const rules = {
  title: { required },
  videoUrl: { required, url }
};

const v$ = useVuelidate(rules, form)

const addYoutubeVideoLink = async () => {
  clearErrors();
  
  const result = await v$.value.$validate();
  if (!result) {
    // Get all validation errors
    const errors = [
      ...v$.value.title.$errors.map((e: { $message: string }) => ({
        field: 'title',
        message: e.$message
      } as FieldError)),
      ...v$.value.videoUrl.$errors.map((e: { $message: string }) => ({
        field: 'videoUrl',
        message: e.$message
      } as FieldError))
    ];
    
    fieldErrors.value = errors;
    errorMessage.value = 'Please correct the following errors:';
    return;
  }

  processing.value = true;
  
  try {
    // Create the add video effect
    const addVideoEffect = Effect.gen(function* () {
      const videoService = yield* VideoService;
      
      // Add the video
      const videoData = {
        title: form.title.trim(),
        url: form.videoUrl.trim()
      };
      
      const video = yield* videoService.addVideo(videoData);
      
      // Fetch updated videos list
      yield* videoService.getVideosByUserId();
      
      return video;
    });
    
    // Execute the effect with proper error handling
    const addVideoResult = await runVideoEffect(addVideoEffect);
    
    if (addVideoResult.success && addVideoResult.data) {
      successMessage.value = `Successfully added video: ${form.title}`;
      clearSuccessMessage();
      
      // Reset form
      form.title = '';
      form.videoUrl = '';
      v$.value.$reset();
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.push('/account/profile/' + userStore._id);
      }, 1500);
      
    } else if (addVideoResult.error) {
      // Handle error
      const { error } = addVideoResult;
      
      if (error.field) {
        // Field-specific error
        fieldErrors.value = [{
          field: error.field,
          message: error.message
        }];
        errorMessage.value = 'There was a problem with your submission:';
      } else {
        // General error
        errorMessage.value = error.message || 'Failed to add the video. Please try again.';
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again later.';
  } finally {
    processing.value = false;
  }
}
</script>