<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const preloadImages = () => {
  for (let i = 1; i <= 14; i++) {
    const img = new Image();
    img.src = `/images/animations/1/${i}.png`;
    document.body.appendChild(img).style.display = 'none';
  }
  for (let i = 1; i <= 12; i++) {
    const img = new Image();
    img.src = `/images/animations/2/${i}.png`;
    document.body.appendChild(img).style.display = 'none';
  }
};

onMounted(preloadImages); // Preload when component mounts
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
