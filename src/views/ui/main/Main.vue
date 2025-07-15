<template>
    <div class="main" :style="mainStyle">
        <header>
            <img src="/images/logo.png" alt="">
            <p :style="{ fontSize: '120px' }">Игра мемори</p>
        </header>
        <div v-if="showButton" :style="{ fontSize: '64px', textAlign: 'center' }" @click="onStart">
            Нажмите, чтобы начать
        </div>
    </div>
</template>

<script setup lang="ts">
import { transform } from 'typescript';
import { computed, onUnmounted, ref } from 'vue';

const animationStep = ref(1)
let interval = null

const showButton = computed(() => animationStep.value === 1)

const mainStyle = computed(() => {
    if (animationStep.value === 15) {
        return {
            background: `url('/images/animations/1/${animationStep.value}.png'), url('/images/bg-main.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover', // or custom sizes like '100% auto'
            transition: 'transform 0.5s',
            transform: 'translateY(-100%)'
        }
    }
    return {
        background: `url('/images/animations/1/${animationStep.value}.png'), url('/images/bg-main.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', // or custom sizes like '100% auto'
    }
})

const onStart = () => {
    interval = setInterval(() => {
        if (animationStep.value < 15)
            animationStep.value = animationStep.value + 1
    }, 100)
}

onUnmounted(() => {
    if (interval) clearInterval(interval);
});

</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 120px 150px 150px;
    height: 100%;
}

header {
    display: flex;
    justify-content: space-between;
}
</style>