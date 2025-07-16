import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('counter', () => {
  const isGameOver = ref(false)
  const isMainShow = ref(true)

  function showGameOver() {
    isGameOver.value = true
  }

  function hideGameOver() {
    isGameOver.value = false
  }

  function showMain() {
    isMainShow.value = true
  }

  function hideMain() {
    isMainShow.value = false
  }

  return { isGameOver, showGameOver, hideGameOver, isMainShow, showMain, hideMain }
})
