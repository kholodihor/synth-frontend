<template>
  <div class="page wrapper">
    <h1>Add a Band</h1>
    <div class="divider"></div>
    <TextInput label="band name" inputType="text" placeholder="Band Name" v-model:input="form.title" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="Country of the Band" inputType="text" placeholder="Band Country" v-model:input="form.location" />
    <span v-for="error in v$.location.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <CroppedImage :image="imageFile ? imageFile : ''" />
    <div class="inputbox">
      <label for="image">
        Upload Image
        <input type="file" hidden id="image" ref="fileInput" @change="handleFile">
        <span v-for="error in v$.image.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
      </label>
    </div>
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
import TextInput from '@/components/shared/TextInput.vue';
import TextArea from '@/components/shared/TextArea.vue';
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'

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
const fileInput = ref()
const processing = ref(false)

const rules = {
  title: { required },
  description: { required },
  location: { required },
  image: { required }
};

const v$ = useVuelidate(rules, form)

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
      await axios.post('api/bands/', data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      Swal.fire(
        {
          title: 'Band is added!',
          text: 'The band you added is called "' + form.title + '"',
          icon: 'success',
          confirmButtonColor: "#219dff",
        }
      )
      await bandsStore.fetchBandsByUserId()
      router.push('/account/profile/' + userStore._id)

    } catch (error) {
      console.log(error)
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
