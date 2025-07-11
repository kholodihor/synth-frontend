<template>
  <div class="page wrapper">
    <h1>Add a Band</h1>
    <div class="divider"></div>
    <TextInput label="band name" inputType="text" placeholder="Band Name" v-model:input="form.title" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="Country of the Band" inputType="text" placeholder="Band Country" v-model:input="form.location" />
    <span v-for="error in v$.location.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <CroppedImage :image="imageFile ? imageFile : ''" />
    <FileUpload 
      label="Band Image" 
      placeholder="Click to upload a band image" 
      id="band-image" 
      accept="image/*" 
      @file-selected="handleFile" 
      :errorMessage="v$.image.$errors.length ? v$.image.$errors[0].$message : ''" 
    />
    <TextArea label="description" placeholder="Add an information about this band here"
      v-model:description="form.description" />
    <span v-for="error in v$.description.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <SubmitBtn :text="processing ? 'loading...' : 'add band'" @submit="addBand" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Swal from '@/utils/swal'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useBandsStore } from '@/stores/bandsStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { handleErrors } from '@/utils/handleErrors'
import TextInput from '@/components/shared/TextInput.vue';
import TextArea from '@/components/shared/TextArea.vue';
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'
import FileUpload from '@/components/shared/FileUpload.vue'

const userStore = useUserStore()
const bandsStore = useBandsStore()
const router = useRouter()

const form = reactive({
  title: '',
  description: '',
  location: '',
  image: ''
})

const imageFile = ref()
const processing = ref(false)

const rules = {
  title: { required },
  description: { required },
  location: { required },
  image: { required }
};

const v$ = useVuelidate(rules, form)

const handleFile = (file: File) => {
  imageFile.value = file
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
      const { data } = await axios.post('/api/uploadbandimage', { image: imageFile.value });
      
      // Check if the response has the success flag
      if (data && data.success === false) {
        Swal.fire({
          title: 'Upload Failed',
          text: handleErrors(data.message || 'Failed to upload band image'),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
        return null;
      }
      
      form.image = data.url;
      return data.url;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error response:', error.response?.data);
      
      Swal.fire({
        title: 'Upload Failed',
        text: handleErrors(error.response?.data?.message || error.message),
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    } else {
      console.error('An error occurred:', error);
      
      Swal.fire({
        title: 'Upload Failed',
        text: 'An unexpected error occurred while uploading the image',
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    }
    return null;
  };
}

const addBand = async () => {
  processing.value = true
  await getUploadedImage()
  const result = await v$.value.$validate();
  if (result) {
    const data = new FormData();
    data.append('title', form.title)
    data.append('location', form.location)
    data.append('description', form.description)
    if (form.image) {
      data.append('image', form.image)
    }
    try {
      const response = await axios.post('api/bands/', data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      // Check if the response has the success flag
      if (response.data && response.data.success === false) {
        Swal.fire({
          title: 'Failed to Add Band',
          text: handleErrors(response.data.message || 'Failed to add band'),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
        return;
      }
      
      Swal.fire({
        title: 'Band is added!',
        text: 'The band you added is called "' + form.title + '"',
        icon: 'success',
        confirmButtonColor: '#219dff',
      })
      await bandsStore.fetchBandsByUserId()
      router.push('/account/profile/' + userStore._id)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data);
        
        Swal.fire({
          title: 'Failed to Add Band',
          text: handleErrors(error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
      } else {
        console.error('An error occurred:', error);
        
        Swal.fire({
          title: 'Failed to Add Band',
          text: 'An unexpected error occurred',
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
      }
    } finally {
      processing.value = false
    }
  } else {
    Swal.fire(
      {
        title: 'Something went wrong!',
        text: 'You dont fill all fields that are required or inputs are invalid',
        icon: 'warning',
        confirmButtonColor: "#219dff",
      }
    )
  }
}
</script>
