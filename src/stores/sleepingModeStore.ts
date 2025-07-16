// composables/useInactivityTimer.ts
import { onMounted, onUnmounted, watch, watchEffect } from 'vue'

// stores/sleepingModeStore.ts
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios'
import { useRoute } from 'vue-router'
import { useUiStore } from './counter'

export const useSleepingModeStore = defineStore('sleepingMode', () => {
  const isVisible = ref(true)
  const config = ref<{
    id: number
    sleepModeSeconds: number
    notificationSeconds: number
  }>({
    id: -1,
    sleepModeSeconds: 200,
    notificationSeconds: 30,
  })

  const show = () => {
    isVisible.value = true
  }
  const hide = () => {
    isVisible.value = false
  }

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('http://api-kambarka-nature.test.itlabs.top/api/wait_mode', {
  //         headers: {
  //           accept: 'application/json',
  //         },
  //       })
  //       config.value = response.data || {
  //         id: -1,
  //         sleepModeSeconds: 1,
  //         notificationSeconds: 1,
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }
  //   fetchData()

  useInactivityTimer()

  return { isVisible, show, hide, config }
})

export function useInactivityTimer() {
  const sleepingStore = useSleepingModeStore()
  const uiStore = storeToRefs(useUiStore())
  let timer: ReturnType<typeof setTimeout>
  const route = useRoute()

  const reset = (timeout: number) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      sleepingStore.show()
    }, timeout)
  }

  const activityEvents = ['touchstart', 'mousemove', 'keydown']
  const handleActivity = () => {
    if (sleepingStore.isVisible) {
      // sleepingStore.hide()
    }
    reset(sleepingStore.config.notificationSeconds * 1000)
  }

  onMounted(() => {
    activityEvents.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }))

    // Watch config for changes and start timer when loaded
    watch(
      () => sleepingStore.config.notificationSeconds,
      (newTimeout) => {
        reset(newTimeout * 1000)
      },
      { immediate: true },
    )
  })

  watchEffect((onCleanup) => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    // const shouldNotRun = uiStore.isMainShow.value
    // if (shouldNotRun) {
    //   intervalId = setInterval(() => {
    //     console.log('Handle activity')
    //     handleActivity()
    //   }, 1000)
    // }

    onCleanup(() => {
      if (intervalId) clearInterval(intervalId)
    })
  })

  onUnmounted(() => {
    activityEvents.forEach((evt) => window.removeEventListener(evt, handleActivity))
    clearTimeout(timer)
  })
}
