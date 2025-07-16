<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    loopInterval?: number
    firstLoopInterval?: number
  }>(),
  {
    loopInterval: 4000,
    firstLoopInterval: 4000,
  },
)

const isVisible = ref(true)

const BLINK_DURATION = 300 // how long the text is hidden (ms)
const BLINK_INTERVAL = 600 // time between each blink (ms)
const LOOP_INTERVAL = ref(props.loopInterval) // time before starting next blink cycle (ms)
const FIRST_LOOP_INTERVAL = ref(props.firstLoopInterval) // time before starting next blink cycle (ms)

let loopTimeout: ReturnType<typeof setTimeout> | null = null
let blinkTimeouts: ReturnType<typeof setTimeout>[] = []

const startBlinkingLoop = () => {
  const runBlinkCycle = () => {
    // Blink 1
    blinkTimeouts.push(
      setTimeout(() => {
        isVisible.value = false
      }, 0),
    )
    blinkTimeouts.push(
      setTimeout(() => {
        isVisible.value = true
      }, BLINK_DURATION),
    )

    // Blink 2
    blinkTimeouts.push(
      setTimeout(() => {
        isVisible.value = false
      }, BLINK_INTERVAL),
    )
    blinkTimeouts.push(
      setTimeout(() => {
        isVisible.value = true
      }, BLINK_INTERVAL + BLINK_DURATION),
    )

    // Schedule next cycle
    loopTimeout = setTimeout(runBlinkCycle, LOOP_INTERVAL.value)
  }

  loopTimeout = setTimeout(runBlinkCycle, FIRST_LOOP_INTERVAL.value)
}

onMounted(() => {
  startBlinkingLoop()
})

onBeforeUnmount(() => {
  if (loopTimeout) clearTimeout(loopTimeout)
  blinkTimeouts.forEach((timeout) => clearTimeout(timeout))
  blinkTimeouts = []
})
</script>

<template>
  <div
    :style="{
      opacity: isVisible ? 1 : 0,
    }"
  >
    <slot></slot>
  </div>
</template>
