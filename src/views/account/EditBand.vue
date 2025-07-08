<template>
  <div class="page wrapper">
    <h1>Edit Band</h1>
    <div class="divider"></div>
    <TextInput label="band name" inputType="text" placeholder="Band Name" v-model:input="form.title" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="band Country" inputType="text" placeholder="Band Country" v-model:input="form.location" />
    <span v-for="error in v$.location.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <CroppedImage v-if="choosedImage" :image="imageFile ? imageFile : ''" />
    <CroppedImage v-else :image="form.image ? form.image : DefaultAvatar" />
    <div class="inputbox">
      <label for="image">
        Upload Image
        <input type="file" hidden id="image" ref="fileInput" @change="handleFile">
        <span v-for="error in v$.image.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
      </label>
    </div>
    <TextArea label="description" placeholder="Add more information here" v-model:description="form.description" />
    <span v-for="error in v$.description.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <SubmitBtn text="edit band" @submit="updateBand" />
  </div>
</template>

<script setup lang="ts">
import Swal from '@/utils/swal'
import type { Band } from '@/types';
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue';
import TextArea from '@/components/shared/TextArea.vue';
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'
import DefaultAvatar from '/DefaultUserAvatar.png'
import * as Effect from 'effect/Effect'
import { BandService, runBandEffect } from '@/services/effect/band.service'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  title: '',
  description: '',
  location: '',
  image: ''
})

const choosedImage = ref('')
const imageFile = ref()
const fileInput = ref()

const rules = {
  title: { required },
  description: { required },
  location: { required },
  image: { required }
};

const v$ = useVuelidate(rules, form)

onMounted(async () => {
  await getBandById()
})


const handleFile = () => {
  const file = fileInput.value.files[0]
  setFileToBase64(file)
}

const setFileToBase64 = (file: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imageFile.value = reader.result;
  };
};

const getUploadedImage = async () => {
  try {
    if (imageFile.value) {
      const { data } = await axios.post('/api/uploadbandimage', { image: imageFile.value },
      );
      form.image = data.url;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error message:', error.message);
    } else {
      console.error('An error occurred:', error);
    }
  };
}

const getBandById = async () => {
  try {
    // Create the get band effect
    const getBandEffect = Effect.gen(function* () {
      const bandService = yield* BandService
      return yield* bandService.getBandById(route.params.id as string)
    })
    
    // Execute the effect with proper error handling
    const getBandResult = await runBandEffect(getBandEffect)
    
    if (getBandResult.success && getBandResult.data) {
      const band = getBandResult.data
      form.title = band.title
      form.location = band.location
      form.image = band.image
      form.description = band.description
    } else if (getBandResult.error) {
      console.error('Error fetching band:', getBandResult.error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load band details',
        confirmButtonColor: '#219dff'
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred while loading band details',
      confirmButtonColor: '#219dff'
    })
  }
}

const updateBand = async () => {
  if (imageFile.value) {
    await getUploadedImage()
  }
  if (!form.image) {
    await Swal.fire({
      title: 'No image found!',
      text: 'Please choose an image of your choice and complete all other inputs',
      icon: 'warning',
      confirmButtonColor: '#219dff'
    })
    return null
  }
  
  const result = await v$.value.$validate();
  if (result) {
    try {
      const bandData = {
        title: form.title,
        location: form.location,
        description: form.description,
        image: form.image
      }
      
      // Create the update band effect
      const updateBandEffect = Effect.gen(function* () {
        const bandService = yield* BandService
        
        // Update the band
        yield* bandService.updateBand(route.params.id as string, bandData)
        
        // Fetch updated bands list
        yield* bandService.fetchBandsByUserId()
        
        return userStore._id
      })
      
      // Execute the effect with proper error handling
      const updateBandResult = await runBandEffect(updateBandEffect)
      
      if (updateBandResult.success) {
        await Swal.fire({
          title: 'Band is updated!',
          text: 'You edited a band called "' + form.title + '"',
          icon: 'success',
          background: 'rgba(0,0,0,0.5)',
          confirmButtonColor: '#219dff'
        })
        
        router.push('/account/profile/' + userStore._id)
      } else if (updateBandResult.error) {
        // Handle error
        const { error } = updateBandResult
        
        await Swal.fire({
          title: 'Update Failed',
          text: error.message || 'Failed to update the band',
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      await Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while updating the band',
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    }
  } else {
    await Swal.fire({
      title: 'Something went wrong!',
      text: 'You dont fill all fields that are required or inputs are invalid',
      icon: 'warning',
      confirmButtonColor: '#219dff'
    })
  }
}
</script>
