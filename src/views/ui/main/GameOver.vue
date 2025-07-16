<template>
  <div :style="mainStyle" class="game-over-container">
    <div class="content" :style="contentStyle">
      <p class="fz-1">Отличная работа</p>
      <div class="content-again">
        <BlinkingMessage v-if="isGameOver" :first-loop-interval="6000">
          <p class="fz-3">Повторить игру?</p>
        </BlinkingMessage>
        <div class="content-again-choice-actions">
          <p class="fz-2 button-text" @click="onNo">Нет</p>
          <p class="fz-2 button-text" @click="onYes">Да</p>
        </div>
      </div>
    </div>
  </div>
  ,
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/counter'
import { wait } from '@/utils/wait'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import BlinkingMessage from './BlinkingMessage.vue'
const { isGameOver } = storeToRefs(useUiStore())
const store = useUiStore()
const animationStep = ref(1)
let contentAppearTimeout = null
let animationInterval: ReturnType<typeof setInterval> | null = null
const showContent = ref(false)

const onNo = () => {
  store.hideGameOver()
  store.showMain()
}
const onYes = () => {
  store.hideGameOver()
}

const runAnimation = () => {
  animationStep.value = 1
  let frame = 1
  animationInterval = setInterval(() => {
    frame++
    animationStep.value = frame
    if (frame >= 12) {
      clearInterval(animationInterval!)
      showContentHandler()
    }
  }, 100) // 100ms per frame
}

const resetAnimation = () => {
  animationStep.value = 1
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

const mainStyle = computed(() => {
  return {
    background: `url('/images/animations/2/${animationStep.value}.png'), url('/images/bg-game-over.png')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', // or custom sizes like '100% auto'
    opacity: isGameOver.value ? 100 : 0,
    zIndex: isGameOver.value ? 1 : -1,
  }
})

const contentStyle = computed(() => ({
  opacity: showContent.value ? 100 : 0,
}))

const showContentHandler = () =>
  (contentAppearTimeout = setTimeout(() => (showContent.value = true), 550))

const hideContentHandler = () => {
  contentAppearTimeout && clearTimeout(contentAppearTimeout)
  showContent.value = false
}

watchEffect(() => {
  if (isGameOver.value) {
    runAnimation()
    return
  }
  resetAnimation()
  hideContentHandler()
})
</script>

<style scoped>
.game-over-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transition:
    background 0.05s,
    opacity 1s;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 90px;
  gap: 350px;
  transition: opacity 0.5s;
  opacity: 0;
}

.content-again {
  display: flex;
  flex-direction: column;
  gap: 120px;
  align-items: center;
}

.content-again-choice-actions {
  display: flex;
  justify-content: space-between;
  width: 1110px;
}

.fz-1 {
  font-size: 120px;
}

.fz-2 {
  font-size: 100px;
}

.fz-3 {
  font-size: 64px;
}
</style>
