<template>
  <div>
    <input type="file" @change="processImage" accept="image/*" />
    <p v-if="extractedText">추출된 텍스트: <br />{{ extractedText }}</p>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const API_KEY = import.meta.env.VITE_API_KEY;
const extractedText = ref('');

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
    const response = await axios.post<AnnotateImageResponse>(`/vision?key=${API_KEY}`,
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
    alert('에러 발생')
    console.error(error);
  }
};
</script>