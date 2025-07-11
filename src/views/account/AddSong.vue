<template>
  <div class="page wrapper">
    <h1>Add a Song</h1>
    <div class="divider"></div>
    <TextInput label="Song artist" placeholder="Who is an Artist" v-model:input="form.artist" inputType="text" />
    <span v-for="error in v$.artist.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="Song Title" placeholder="Name a New Song" v-model:input="form.title" inputType="text" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <FileUpload 
      label="Song File" 
      placeholder="Click to upload a song file" 
      id="song-file" 
      accept="audio/*" 
      @file-selected="handleFileUpload" 
      :errorMessage="v$.song.$errors.length ? v$.song.$errors[0].$message : ''" 
    />
    <SubmitBtn @click="addSong" :text="processing ? 'loading...' : 'add song'" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Swal from '@/utils/swal'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { useSongStore } from '@/stores/songStore'
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { handleErrors } from '@/utils/handleErrors'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import FileUpload from '@/components/shared/FileUpload.vue'

const userStore = useUserStore()
const songStore = useSongStore()
const router = useRouter()

const form = reactive({
  title: '',
  artist: '',
  song: ''
})

const songFile = ref()
const processing = ref(false)

const rules = {
  title: { required },
  artist: { required },
  song: { required }
};

const v$ = useVuelidate(rules, form)

const handleFileUpload = (file: File) => {
  songFile.value = file
}

const getUploadedSong = async () => {
  try {
    if (songFile.value) {
      const formData = new FormData()
      formData.append('song', songFile.value)
      const { data } = await axios.post('/api/uploadsong', formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      
      // Check if the response has the success flag
      if (data && data.success === false) {
        Swal.fire({
          title: 'Upload Failed',
          text: handleErrors(data.message || 'Failed to upload song file'),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
        return null;
      }
      
      form.song = data.url;
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
        text: 'An unexpected error occurred while uploading the song',
        icon: 'error',
        confirmButtonColor: '#219dff'
      })
    }
    return null;
  };
}

const addSong = async () => {
  processing.value = true
  await getUploadedSong();
  const result = await v$.value.$validate();
  if (result) {
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('artist', form.artist)
      formData.append('song', form.song)
      const response = await axios.post('api/songs', formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      // Check if the response has the success flag
      if (response.data && response.data.success === false) {
        Swal.fire({
          title: 'Failed to Add Song',
          text: handleErrors(response.data.message || 'Failed to add song'),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
        processing.value = false
        return;
      }
      
      Swal.fire({
        title: 'Song is added!',
        text: 'You added a song called "' + form.title + '" by ' + form.artist,
        icon: 'success',
        confirmButtonColor: '#219dff',
      })
      songStore.fetchSongsByUserId()
      setTimeout(() => {
        router.push('/account/profile/' + userStore._id)
      }, 200)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data);
        
        Swal.fire({
          title: 'Failed to Add Song',
          text: handleErrors(error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#219dff'
        })
      } else {
        console.error('An error occurred:', error);
        
        Swal.fire({
          title: 'Failed to Add Song',
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