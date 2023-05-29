<template>
  <div class="page wrapper">
    <h1>Add Video</h1>
    <div class="divider"></div>
    <TextInput label="Title" placeholder="Title of Video" v-model:input="form.title" inputType="text" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="Video Url" placeholder="Add a url of a Youtube Video" v-model:input="form.videoUrl"
      inputType="text" />
    <span v-for="error in v$.videoUrl.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <SubmitBtn text="add video" @click="addYoutubeVideoLink" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { useVuelidate } from '@vuelidate/core'
import { required, url } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import Swal from '@/utils/swal'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  title: '',
  videoUrl: ''
})

const rules = {
  title: { required },
  videoUrl: { required, url }
};

const v$ = useVuelidate(rules, form)

const addYoutubeVideoLink = async () => {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('url', form.videoUrl)
      await axios.post('api/video', formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      Swal.fire(
        {
          title: 'New video added!',
          text: 'You added a video with the name "' + form.title + '"',
          icon: 'success',
          confirmButtonColor: "#219dff",
        }
      )
      router.push('/account/profile/' + userStore._id)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error message:', error.message);
      } else {
        console.error('An error occurred:', error);
      }
    }
  } else {
    Swal.fire(
      {
        title: 'Opps, something went wrong!',
        text: 'You dont fill all the fields that are required or inputs are invalid',
        icon: 'warning',
        confirmButtonColor: "#219dff",
      }
    )
  }
}
</script>