<template>
  <div class="page wrapper">
    <h1>Edit Band</h1>
    <div class="divider"></div>
    <TextInput label="band name" inputType="text" placeholder="Band Name" v-model:input="form.title" />
    <span v-for="error in v$.title.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <TextInput label="band Country" inputType="text" placeholder="Band Country" v-model:input="form.location" />
    <span v-for="error in v$.location.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
    <CroppedImage v-if="choosedImage" :image="choosedImage" />
    <CroppedImage v-else :image="form.image ? form.image : DefaultAvatar" />
    <div class="inputbox">
      <label for="image">
        Upload Image
        <input type="file" hidden id="image" ref="fileInput" @change="handleFileUpload">
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
import { useBandsStore } from '@/stores/bandsStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import TextInput from '@/components/shared/TextInput.vue';
import TextArea from '@/components/shared/TextArea.vue';
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'
import DefaultAvatar from '/DefaultUserAvatar.png'

const route = useRoute()
const router = useRouter()
const bandsStore = useBandsStore()
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

const handleFileUpload = () => {
  imageFile.value = fileInput.value.files[0]
  choosedImage.value = URL.createObjectURL(imageFile.value)
}

const getUploadedImage = async () => {
  try {
    if (imageFile.value) {
      const formData = new FormData();
      formData.append('band', imageFile.value);
      const { data } = await axios.post('/api/uploadbandimage', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
    const res = await axios.get<Band>('api/bands/' + route.params.id)
    form.title = res.data.title
    form.location = res.data.location
    form.image = bandsStore.bandImage(res.data.image)
    form.description = res.data.description
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error message:', error.message);
    } else {
      console.error('An error occurred:', error);
    }
  }
}

const updateBand = async () => {
  if (imageFile.value) {
    await getUploadedImage()
  }
  if (!form.image) {
    Swal.fire(
      'No  image found!',
      'Please choose an image of your choice and complete all other inputs',
      'warning'
    )
    return null
  }
  const result = await v$.value.$validate();
  if (result) {
    const formData = new FormData();
    formData.append('title', form.title)
    formData.append('location', form.location)
    formData.append('description', form.description)
    if (form.image) {
      formData.append('image', form.image)
    }
    try {
      await axios.patch<Band>('api/bands/' + route.params.id, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      Swal.fire(
        {
          title: 'Band is updated!',
          text: 'The band you edited is called "' + form.title + '"',
          icon: 'success',
          background: "rgba(0,0,0,0.5)",
          confirmButtonColor: "#219dff",
        }
      )
      await bandsStore.fetchBandsByUserId()
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
        text: 'You dont fill all fields that are required or inputs are invalid',
        icon: 'warning',
        confirmButtonColor: "#219dff",
      }
    )
  }
}
</script>
