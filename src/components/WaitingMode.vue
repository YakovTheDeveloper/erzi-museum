<!-- components/WaitingModal.vue -->
<template>
  <div :class="modalClasses" @click.stop="sleepingStore.hide">
    <div class="modal-content">
      <div class="countdown">{{ countdownValue }}</div>
      <h1 class="title">Завершение сеанса</h1>
      <p class="body">Из-за отсутствия активности программа скоро вернётся в главное меню</p>
      <p class="caption">Вы можете нажать в любое место экрана, чтобы возобновить работу</p>
      <div class="actions">
        <button
          class="button button_secondary"
          @click="
            () => {
              sleepingStore.hide()
              router.push('/')
            }
          "
        >
          На главную
        </button>
        <button class="button" @click="sleepingStore.hide">Продолжить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSleepingModeStore } from '@/stores/sleepingModeStore'

const modalClasses = computed(() => ['waiting-modal', isVisible.value && 'show'])

// Store
const sleepingStore = useSleepingModeStore()
const { isVisible } = storeToRefs(sleepingStore)

// Router
const router = useRouter()

// Countdown state
const countdownValue = ref(30)
let interval: ReturnType<typeof setInterval> | null = null

const startCountdown = () => {
  countdownValue.value = sleepingStore.config?.sleepModeSeconds || 30
  interval = setInterval(() => {
    countdownValue.value--
    if (countdownValue.value <= 0) {
      clearCountdown()
      sleepingStore.hide()
      router.push({ name: 'home' }) // Or { path: '/' }
    }
  }, 1000)
}

const clearCountdown = () => {
  if (interval) clearInterval(interval)
  interval = null
}

// Tap or interaction cancels waiting mode
const hide = () => {
  clearCountdown()
  sleepingStore.hide()
}

// Watch modal visibility
watch(isVisible, (newVal) => {
  if (newVal) {
    startCountdown()
  } else {
    clearCountdown()
  }
})

watch(sleepingStore.config, (config) => {
  if (config) {
  } else {
  }
})

onUnmounted(() => {
  clearCountdown()
})
</script>

<style scoped lang="scss">
.waiting-modal {
  position: absolute;
  inset: 0;
  height: 2160px;
  width: 3840px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.3s ease-out;
  opacity: 0;
  overflow: hidden;

  &.show {
    opacity: 1;
    z-index: 1000;

    .modal-content {
      transform: translateY(0);
    }
  }
}

.modal-content {
  width: 1226px;
  height: 960px;
  gap: 64px;
  padding: 64px;
  color: #333333;
  font-weight: 400;
  font-size: 48px;
  line-height: 100%;
  text-align: center;
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(1600px);
  transition: transform 0.3s ease-out;
}

.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 80px;
  line-height: 100%;
  text-align: center;
  vertical-align: middle;
  color: #dc1f25;

  width: 248px;
  height: 248px;
  margin: 0 auto 64px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/misc/spinner.svg') center center no-repeat;
    background-size: contain;
    box-sizing: border-box;
    animation: countdown-spin 1.5s linear infinite;
  }

  @keyframes countdown-spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}

.title {
  font-weight: 700;
  font-size: 64px;
  line-height: 100%;
  margin-bottom: 64px;
}

.body {
  font-size: 48px;
  font-family: 'Menlo';
  margin-bottom: 32px;
}

.caption {
  font-weight: 600;
  font-size: 40px;
  line-height: 100%;
  text-align: center;
  opacity: 0.4;
  font-family: 'Menlo';
  margin-bottom: 64px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  .button {
    font-weight: 600;
    font-size: 40px;
    line-height: 100%;
    width: 100%;
    text-align: center;
    padding: 40px;
    border: 4px solid #dc1f25;
    background-color: #dc1f25;
    color: rgba(255, 255, 255, 1);

    &_secondary {
      background-color: transparent;
      color: #dc1f25;
    }
  }
}
</style>
