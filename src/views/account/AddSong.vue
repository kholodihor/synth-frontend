<template>
  <div class="page wrapper">
    <h1>Add a Song</h1>
    <div class="divider"></div>
    <TextInput label="Song artist" placeholder="Who is an Artist" v-model:input="form.artist" inputType="text" />
    <span v-for="error in v$.artist.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="Song Title" placeholder="Name a New Song" v-model:input="form.title" inputType="text" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <FileUpload 
      id="song-upload"
      :label="songFile ? songFile.name : 'Upload Song'"
      accept="audio/*"
      :error="v$.song.$errors[0]?.$message"
      @file-selected="handleFileSelected"
    />
    <SubmitBtn @click="addSong" :text="processing ? 'loading...' : 'add song'" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Swal from '@/utils/swal';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useSongStore } from '@/stores/songStore';
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import TextInput from '@/components/shared/TextInput.vue';
import SubmitBtn from '@/components/shared/SubmitBtn.vue';
import FileUpload from '@/components/shared/FileUpload.vue';

const userStore = useUserStore()
const songStore = useSongStore()
const router = useRouter()

interface SongForm {
  title: string;
  artist: string;
  song: string | File;
}

const form = reactive<SongForm>({
  title: '',
  artist: '',
  song: ''
})

interface SongFile extends File {
  name: string;
}

const songFile = ref<SongFile | null>(null);
const processing = ref(false);

const rules = {
  title: { required },
  artist: { required },
  song: { required }
};

const v$ = useVuelidate(rules, form)

const handleFileSelected = (file: File | null) => {
  if (file) {
    songFile.value = file as SongFile;
    form.song = file;
  } else {
    songFile.value = null;
    form.song = '';
  }
};

const getUploadedSong = async (): Promise<boolean> => {
  try {
    if (songFile.value) {
      const formData = new FormData();
      formData.append('song', songFile.value);
      const { data } = await axios.post('/api/uploadsong', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Only assign the URL string, not the File object
      form.song = data.url;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Upload error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: 'Failed to upload the song. Please try again.',
    });
    return false;
  }
};

const addSong = async () => {
  processing.value = true;
  
  try {
    const uploadSuccess = await getUploadedSong();
    if (!uploadSuccess) {
      processing.value = false;
      return;
    }

    const result = await v$.value.$validate();
    if (result) {
      await axios.post('api/songs', {
        title: form.title,
        artist: form.artist,
        song: form.song
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        title: 'Song Added!',
        text: `You added a song called "${form.title}" by ${form.artist}`,
        icon: 'success',
        confirmButtonColor: '#219dff',
      });

      await songStore.fetchSongsByUserId();
      router.push('/account/profile/' + userStore._id);
    } else {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        confirmButtonColor: '#219dff',
      });
    }
  } catch (error) {
    console.error('Error adding song:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to add the song. Please try again.',
    });
  } finally {
    processing.value = false;
  }
}
</script>