<template>
  <div :class="mainClasses" :style="mainStyle">
    <header>
      <img src="/images/logo.png" alt="" />
      <p :style="{ fontSize: '120px' }">Игра мемори</p>
    </header>
    <BlinkingMessage v-if="showStartButton" @click="onStart">
      <p
        :style="{
          fontSize: '64px',
          textAlign: 'center',
          cursor: 'pointer',
        }"
      >
        Нажмите, чтобы начать
      </p>
    </BlinkingMessage>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { transform } from 'typescript'
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import BlinkingMessage from './BlinkingMessage.vue'

const animationStep = ref(1)
const { isMainShow } = storeToRefs(useUiStore())
const showStartButton = ref(true)
const store = useUiStore()
let interval = null

const mainClasses = computed(() => [isMainShow.value ? 'down' : 'up', 'main'])

const resetUi = () => {
  showStartButton.value = true
  animationStep.value = 1
}

const mainStyle = computed(() => {
  return {
    background: `url('/images/animations/1/${animationStep.value}.png'), url('/images/bg-main.png')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', // or custom sizes like '100% auto'
  }
})

watchEffect(async () => {
  if (animationStep.value === 15) {
    if (interval) clearInterval(interval)
    const hideContainer = new Promise((resolve) => {
      setTimeout(() => {
        store.hideMain()
        resolve('')
      }, 1000)
    })
    hideContainer.then(() => setTimeout(() => resetUi(), 1000))
    return
  }
})

const onStart = () => {
  showStartButton.value = false
  interval = setInterval(() => {
    console.log('interval tick')
    if (animationStep.value < 15) animationStep.value = animationStep.value + 1
  }, 100)
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 120px 150px 150px;
  height: 100%;
  transition: transform 0.3s ease-out;
  position: absolute;
  inset: 0;
  z-index: 1;
}

header {
  display: flex;
  justify-content: space-between;
}

.up {
  transform: translateY(-100%);
}

.down {
  transform: translateY(0);
}
</style>
