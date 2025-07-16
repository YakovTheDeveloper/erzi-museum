<template>
  <Transition name="slide-up-down">
    <div v-if="isVisible" class="modal-content">
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
        <button class="button pixel" @click="sleepingStore.hide"><span>Продолжить</span></button>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div v-if="isVisible" class="waiting-modal" @click.stop="sleepingStore.hide"></div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, Transition, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSleepingModeStore } from '@/stores/sleepingModeStore'

const modalClasses = computed(() => ['waiting-modal'])
// const modalClasses = computed(() => ['waiting-modal', isVisible.value && 'show'])

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

<style lang="scss">
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
  overflow: hidden;
  opacity: 1;
  z-index: 1;

  &.show {
    opacity: 1;
    z-index: 1000;

    .modal-content {
      //   transform: translateY(0);
    }
  }
}

.modal-content {
  position: absolute;
  z-index: 2;
  bottom: 50%;
  right: 50%;
  transform: translate(50%, 50%);
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

    &.pixel {
      position: relative;

      background: url('/images/bg-game-over-red.png');
      background-position: 81% 16%;
      background-repeat: no-repeat;
      background-size: 1000%;

      &:active {
        &:before {
          background-color: #5b0d0eab; /* red overlay with 50% opacity */
        }
      }

      &:before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: rgba(255, 0, 0, 0.808); /* red overlay with 50% opacity */
        z-index: 0;
      }
      > * {
        position: relative;
        z-index: 1;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.slide-up-down-enter-active,
.slide-up-down-leave-active {
  transition: transform 0.4s ease;
}

.slide-up-down-enter-from {
  transform: translate(50%, 2500px);
}
.slide-up-down-enter-to {
  transform: translate(50%, 50%);
}

.slide-up-down-leave-from {
  transform: translate(50%, 50%);
}
.slide-up-down-leave-to {
  transform: translate(50%, 2500px);
}
</style>
