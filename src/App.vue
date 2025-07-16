<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useSleepingModeStore } from './stores/sleepingModeStore'
import WaitingMode from './components/WaitingMode.vue'

const preloadImages = () => {
  for (let i = 1; i <= 14; i++) {
    const img = new Image()
    img.src = `/images/animations/1/${i}.png`
    document.body.appendChild(img).style.display = 'none'
  }
  for (let i = 1; i <= 12; i++) {
    const img = new Image()
    img.src = `/images/animations/2/${i}.png`
    document.body.appendChild(img).style.display = 'none'
  }
}

useSleepingModeStore()

onMounted(preloadImages) // Preload when component mounts
</script>

<template>
  <RouterView />
  <WaitingMode />
</template>

<style scoped></style>
