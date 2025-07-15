import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('counter', () => {
  const isGameOver = ref(false)

  function showGameOver() {
    isGameOver.value = true
  }

  function hideGameOver() {
    isGameOver.value = false
  }

  return { isGameOver, showGameOver, hideGameOver }
})
