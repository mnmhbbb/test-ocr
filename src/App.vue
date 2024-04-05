<template>
  <div>
    <input v-if="!isLoading" type="file" @change="processImage" accept="image/*" />
    <div v-if="isLoading" class="loader" />
    <p v-if="!isLoading && extractedText">추출된 텍스트: <br />{{ extractedText }}</p>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const API_KEY = import.meta.env.VITE_API_KEY;
const extractedText = ref('');
const isLoading = ref(false);

const processImage = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result?.toString().split(',')[1];
      if (base64Image) {
        sendToVisionApi(base64Image);
      }
    };
    reader.readAsDataURL(file);
  }
};

interface AnnotateImageResponse {
  responses: {
    textAnnotations: { description: string }[];
  }[];
}

const sendToVisionApi = async (base64Image: string) => {
  try {
    isLoading.value = true;
    const response = await axios.post<AnnotateImageResponse>(`/.netlify/functions/vision?key=${API_KEY}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      }
    );
    if (response.data.responses[0].textAnnotations) {
      extractedText.value = response.data.responses[0].textAnnotations[0].description;
    } else {
      extractedText.value = '텍스트를 찾을 수 없습니다.';
    }
  } catch (error) {
    alert('에러 발생');
    isLoading.value = false;
    console.error(error);
  }
  finally{
    isLoading.value = false;
  }
};
</script>
<style>
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
    }
</style>