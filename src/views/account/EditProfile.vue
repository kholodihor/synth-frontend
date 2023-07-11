<template>
  <div class="page">
    <div class="wrapper">
      <h1>Edit Profile</h1>
      <div class="divider"></div>
      <TextInput label="Your New Name" inputType="text" placeholder="Your Name" v-model:input="form.username" />
      <span v-for="error in v$.username.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
      <CroppedImage v-if="imageFile" :image="imageFile" />
      <CroppedImage v-else :image="form.image ? form.image : DefaultAvatar" />
      <div class="inputbox">
        <label for="image">
          Upload Image
          <input type="file" hidden id="image" ref="fileInput" @change="handleImage">
          <span v-for="error in v$.image.$errors" :key="error.uid" class="error">{{ error.$message }}</span>
        </label>
      </div>
      <SubmitBtn text="update profile" @click="updateUser" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import Swal from '@/utils/swal'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import DefaultAvatar from '/DefaultUserAvatar.png'
import TextInput from '@/components/shared/TextInput.vue'
import SubmitBtn from '@/components/shared/SubmitBtn.vue'
import CroppedImage from '@/components/shared/CroppedImage.vue'

const userStore = useUserStore()
const profileStore = useProfileStore()
const router = useRouter()

const form = reactive({
  username: '',
  image: ''
})

const imageFile = ref()
const fileInput = ref()

onMounted(() => {
  form.username = profileStore.username || ''
  form.image = profileStore.image || ''
})

const rules = {
  username: { required },
  image: { required }
};

const v$ = useVuelidate(rules, form)

const handleImage = () => {
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
  if (imageFile.value) {
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
}

const updateUser = async () => {
  if (imageFile.value) {
    await getUploadedImage()
  }
  const result = await v$.value.$validate();
  if (result) {
    const formData = new FormData();
    formData.append('username', form.username)
    formData.append('avatarUrl', form.image)
    try {
      await axios.patch('api/user', formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      await userStore.fetchUser()
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
        title: 'Something went wrong!',
        text: 'You dont fill all fields that are required or inputs are invalid',
        icon: 'warning',
        confirmButtonColor: "#219dff",
      }
    )
  }
}
</script>
